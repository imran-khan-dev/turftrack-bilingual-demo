"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  ArrowDownToLine,
  ArrowUpRight,
  Landmark,
  CreditCard,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import { AccessibleBusiness } from "@/components/shared/BusinessFilter";
import { settleDebt } from "@/services/payment/settleDebt";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface WalletBalances {
  currentBalance: string | number;
  eligibleWithdrawal: string | number;
  currentDebt: string | number;
  netEarningsFromOnlinePaid: string | number;
}

interface WalletStats {
  totalRevenue: string | number;
  lifetimeFeesPaid: string | number;
  totalWithdrawn: string | number;
}

interface WalletStatus {
  health: "HEALTHY" | "WARNING" | "CRITICAL" | string;
  debtLimit: number;
  isBlocked: boolean;
}

interface Payout {
  id: string;
  walletId: string;
  amount: string | number;
  status: "SUCCESS" | "PENDING" | "FAILED" | string;
  note?: string | null;
  processedBy?: string | null;
  reference?: string | null;
  createdAt: string;
  paidAt?: string | null;
}

interface WalletData {
  walletId: string;
  balances: WalletBalances;
  stats: WalletStats;
  status: WalletStatus;
  recentPayouts: Payout[];
}

interface MyWalletProps {
  data: WalletData;
  businesses?: AccessibleBusiness[];
  selectedBusinessId?: string;
  paymentMethod?: string;
}

const formatCurrency = (amount: string | number) =>
  `৳${Number(amount).toLocaleString("en-BD")}`;

const formatDate = (isoString: string | null | undefined, notAvailable: string) => {
  if (!isoString) return notAvailable;
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      dateStyle: "medium",
    });
  } catch {
    return notAvailable;
  }
};

const formatTime = (isoString?: string | null) => {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

const healthStyles: Record<string, string> = {
  HEALTHY: "bg-emerald-50 text-emerald-700 border-emerald-200",
  WARNING: "bg-amber-50 text-amber-700 border-amber-200",
  CRITICAL: "bg-rose-50 text-rose-700 border-rose-200",
};

const payoutStatusStyles: Record<string, string> = {
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

function MiniStat({
  icon,
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className={cn("text-lg font-bold truncate", valueClassName)}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function MyWallet({
  data,
  businesses = [],
  selectedBusinessId,
  paymentMethod,
}: MyWalletProps) {
  const t = useTranslations("wallet");
  const common = useTranslations("common");
  const { balances, stats, status, recentPayouts } = data;

  const [isPending, startTransition] = useTransition();
  const [settleError, setSettleError] = useState<string | null>(null);
  const [showSettleDialog, setShowSettleDialog] = useState(false);

  const isZiniPay = paymentMethod === "ziniPay";

  const healthBadgeClass =
    healthStyles[status.health] ||
    "bg-slate-100 text-slate-600 border-slate-200";

  const debtRatio =
    status.debtLimit > 0
      ? Math.min(100, (Number(balances.currentDebt) / status.debtLimit) * 100)
      : 0;

  const currentDebtAmount = Number(balances.currentDebt) || 0;
  const hasDebt = currentDebtAmount > 0;
  const healthLabel = status.health === "HEALTHY"
    ? t("healthy")
    : status.health === "WARNING"
      ? t("warning")
      : status.health === "CRITICAL"
        ? t("critical")
        : status.health;
  const payoutStatusLabel = (payoutStatus: string) => {
    if (payoutStatus === "SUCCESS") return t("success");
    if (payoutStatus === "PENDING") return t("pending");
    if (payoutStatus === "FAILED") return t("failed");
    return payoutStatus;
  };
  const paymentLinkError = t("paymentLinkFailed");

  // const handleSettleDebt = () => {
  //   if (!selectedBusinessId) return;

  //   setSettleError(null);

  //   startTransition(async () => {
  //     const res = await settleDebt(selectedBusinessId);

  //     if (!res.success || !res.data?.paymentUrl) {
  //       const message = res.error || "Failed to generate payment link.";
  //       setSettleError(message);
  //       toast.error(message);
  //       return;
  //     }

  //     // Redirect to the SSLCommerz checkout page returned by the API
  //     window.location.href = res.data.paymentUrl;
  //   });
  // };

  const handleSettleDebt = () => {
    if (!selectedBusinessId) return;

    setSettleError(null);

    if (isZiniPay) {
      setShowSettleDialog(true);
      return;
    }

    startTransition(async () => {
      const res = await settleDebt(selectedBusinessId);

      if (!res.success || !res.data?.paymentUrl) {
        const message = res.error || paymentLinkError;
        setSettleError(message);
        toast.error(message);
        return;
      }

      window.location.href = res.data.paymentUrl;
    });
  };

  const confirmSettleDebt = () => {
    if (!selectedBusinessId) return;

    setShowSettleDialog(false);
    setSettleError(null);

    startTransition(async () => {
      const res = await settleDebt(selectedBusinessId);

      if (!res.success || !res.data?.paymentUrl) {
        const message = res.error || paymentLinkError;
        setSettleError(message);
        toast.error(message);
        return;
      }

      window.location.href = res.data.paymentUrl;
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Filters */}
      <FiltersToolbar
        businesses={businesses}
        showDateRange={false}
        showSearchFilters={false}
        showBusinessFilter={businesses.length > 0}
        showClearFilters={businesses.length > 0}
        showRefresh={true}
        businessParamKey="businessId"
        businessPlaceholder={common("allVenues")}
      />

      {/* Hero balance card — light theme */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm">
        {/* Soft decorative glow, tuned down for light bg */}
        <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-blue-50 blur-3xl" />

        <div className="relative flex flex-col gap-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Landmark size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {t("currentBalance")}
                </p>
              </div>
            </div>

            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border shrink-0",
                healthBadgeClass,
              )}
            >
              {status.health === "HEALTHY" ? (
                <ShieldCheck size={13} />
              ) : (
                <ShieldAlert size={13} />
              )}
              {healthLabel}
            </span>
          </div>

          <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {formatCurrency(balances.currentBalance)}
          </p>

          {/* Debt limit progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500">
                {t("currentDebt", { amount: formatCurrency(balances.currentDebt) })}
              </span>
              <span className="text-slate-400">
                {t("debtLimit", { amount: formatCurrency(status.debtLimit) })}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  debtRatio >= 90
                    ? "bg-rose-500"
                    : debtRatio >= 60
                    ? "bg-amber-500"
                    : "bg-emerald-500",
                )}
                style={{ width: `${debtRatio}%` }}
              />
            </div>
          </div>

          {/* Settle debt CTA — only when there's actually debt to settle */}
          {hasDebt && (
            <div className="flex flex-col gap-2 pt-1 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700">
                  {t("outstandingDebtNotice", { amount: formatCurrency(balances.currentDebt) })}
                </p>
                {!selectedBusinessId && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t("selectVenueToSettle")}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSettleDebt}
                disabled={!selectedBusinessId || isPending}
                className={cn(
                  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all shrink-0",
                  !selectedBusinessId
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-70",
                )}
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CreditCard size={14} />
                )}
                {isPending ? t("generatingPaymentLink") : t("settleDebt")}
              </button>
            </div>
          )}

          {settleError && (
            <p className="text-[11px] font-semibold text-rose-600">
              {settleError}
            </p>
          )}
        </div>
      </div>

      {/* Eligible for Withdrawal — standalone featured card, since this is
          the actionable number (what the owner can actually pull out).
          Calculation is spelled out inline with live values, not just a label. */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <ArrowUpRight size={16} className="text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              {t("eligibleForWithdrawal")}
            </p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(balances.eligibleWithdrawal)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
              {t("balanceBreakdown", {
                currentBalance: formatCurrency(balances.currentBalance),
                currentDebt: formatCurrency(balances.currentDebt),
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Blocked warning banner */}
      {status.isBlocked && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
            <ShieldAlert size={15} className="text-rose-600" />
          </div>
          {t("withdrawalsBlocked")}
        </div>
      )}

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MiniStat
          icon={<TrendingUp size={16} className="text-blue-500" />}
          label={t("lifetimeNetEarnings")}
          value={formatCurrency(balances.netEarningsFromOnlinePaid)}
        />
        <MiniStat
          icon={<ArrowUpRight size={16} className="text-emerald-500" />}
          label={t("lifetimeTotalWithdrawn")}
          value={formatCurrency(stats.totalWithdrawn)}
        />
        <MiniStat
          icon={<TrendingDown size={16} className="text-rose-500" />}
          label={t("currentDebtLabel")}
          value={formatCurrency(balances.currentDebt)}
          valueClassName={
            Number(balances.currentDebt) > 0
              ? "text-rose-600"
              : "text-slate-900"
          }
        />
      </div>

      {/* Recent Payouts */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <ArrowDownToLine size={14} className="text-slate-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t("recentPayouts")}</h2>
            <p className="text-[11px] text-slate-400">
              {t(recentPayouts.length === 1 ? "lastPayoutSingular" : "lastPayoutPlural", {
                count: Math.min(recentPayouts.length, 5),
              })}
            </p>
          </div>
        </div>

        {recentPayouts.length === 0 ? (
          <div className="text-center py-12 px-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center mx-auto mb-3">
              <Wallet size={18} className="text-slate-300" />
            </div>
            <p className="text-xs font-medium text-slate-400">{t("noPayoutsYet")}</p>
          </div>
        ) : (
          <>
            {/* MOBILE CARDS */}
            <div className="block sm:hidden divide-y divide-slate-100 px-5">
              {recentPayouts.map((payout) => (
                <div key={payout.id} className="py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {payout.reference || payout.note || t("payout")}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {formatDate(payout.createdAt, t("notAvailable"))} &middot;{" "}
                        {formatTime(payout.createdAt)}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 shrink-0">
                      {formatCurrency(payout.amount)}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 font-medium border uppercase tracking-wide text-[10px]",
                      payoutStatusStyles[payout.status] ||
                        "bg-slate-100 text-slate-600 border-slate-200",
                    )}
                  >
                    {payoutStatusLabel(payout.status)}
                  </span>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                    <th className="py-2.5 px-5 sm:px-6">{t("reference")}</th>
                    <th className="py-2.5 px-3">{t("note")}</th>
                    <th className="py-2.5 px-3">{t("amount")}</th>
                    <th className="py-2.5 px-3">{common("status.label")}</th>
                    <th className="py-2.5 px-3 pr-5 sm:pr-6">{t("date")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  {recentPayouts.map((payout) => (
                    <tr
                      key={payout.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-5 sm:px-6 font-semibold text-slate-800">
                        {payout.reference || "—"}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 max-w-[180px] truncate">
                        {payout.note || "—"}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 font-medium border uppercase tracking-wide text-[10px]",
                            payoutStatusStyles[payout.status] ||
                              "bg-slate-100 text-slate-600 border-slate-200",
                          )}
                        >
                          {payoutStatusLabel(payout.status)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 pr-5 sm:pr-6 text-slate-400">
                        <div className="flex flex-col">
                          <span>{formatDate(payout.createdAt, t("notAvailable"))}</span>
                          <span className="text-[10px]">
                            {formatTime(payout.createdAt)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {showSettleDialog && isZiniPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div
            className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settle-debt-title"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} className="text-amber-600" />
                  </div>

                  <div>
                    <h2
                      id="settle-debt-title"
                      className="text-base font-bold text-slate-900"
                    >
                      {t("settlementInstructionsTitle")}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      {t("settlementInstructionsDescription")}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSettleDialog(false)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
                  aria-label={common("close")}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  {t("paymentAmount")}
                </p>

                <p className="text-2xl font-black text-slate-900 mt-1">
                  {formatCurrency(currentDebtAmount)}
                </p>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <p className="font-bold text-slate-800">
                  {t("exactAmountRequired")}
                </p>

                <ul className="space-y-2 list-disc pl-4">
                  <li>
                    {t("underpaymentWarning")}
                  </li>

                  <li>
                    {t("overpaymentWarning")}
                  </li>

                  <li>
                    {t("incorrectAmountWarning")}
                  </li>

                  <li>
                    {t("incorrectAmountReview")}
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSettleDialog(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  {common("cancel")}
                </button>

                <button
                  type="button"
                  onClick={confirmSettleDebt}
                  disabled={isPending}
                  className="flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-70"
                >
                  {isPending
                    ? t("generatingPaymentLink")
                    : t("payAmount", {
                        amount: currentDebtAmount.toLocaleString("en-BD"),
                      })}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
