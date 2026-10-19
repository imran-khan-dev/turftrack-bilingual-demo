import { Building2, Wallet, CreditCard, Ban } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { useTranslations } from "next-intl";

interface WalletBalances {
  currentBalance: number;
  currentDebt: number;
  netEarningsFromOnlinePaid: number;
  totalWithdrawn: number;
}

interface WalletPlatformProps {
  selectedBusiness: string;
  walletLoading: boolean;
  walletBalances: WalletBalances;
}

export default function WalletPlatform({
  selectedBusiness,
  walletLoading,
  walletBalances,
}: WalletPlatformProps) {
  const t = useTranslations("wallet");
  const balances = walletBalances || {
    currentBalance: 0,
    currentDebt: 0,
    netEarningsFromOnlinePaid: 0,
    totalWithdrawn: 0,
  };


  const cards = [
    {
      key: "currentBalance",
      label: t("currentBalance"),
      value: balances.currentBalance,
      icon: Wallet,
      color: "bg-emerald-50/50 border-emerald-100/80 text-emerald-700",
    },
    {
      key: "lifetimeNetEarningsOnlinePaid",
      label: t("lifetimeNetEarningsOnlinePaid"),
      value: balances.netEarningsFromOnlinePaid,
      icon: CreditCard,
      color: "bg-teal-50/40 border-teal-100/80 text-teal-700",
    },
    {
      key: "lifetimeTotalWithdrawalsOnlinePaid",
      label: t("lifetimeTotalWithdrawalsOnlinePaid"),
      value: balances.totalWithdrawn,
      icon: CreditCard,
      color: "bg-teal-50/40 border-teal-100/80 text-teal-700",
    },
    {
      key: "currentPlatformDebt",
      label: t("currentPlatformDebt"),
      value: balances.currentDebt,
      icon: Ban,
      color:
        balances.currentDebt > 0
          ? "bg-rose-50 border-rose-200 text-rose-700"
          : "bg-slate-50 border-slate-200 text-slate-500",
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Building2 size={16} className="text-slate-500" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {selectedBusiness === "all"
            ? t("combinedOverview")
            : t("venueOverview")}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.key}
              className={`border rounded-xl p-4 flex flex-col justify-between min-h-[110px] transition-all ${card.color}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider opacity-90 leading-tight">
                  {card.label}
                </span>
                <div className="p-1.5 bg-white rounded-lg shadow-sm shrink-0 text-slate-600">
                  <IconComp size={14} />
                </div>
              </div>
              <h3 className="text-2xl font-bold tracking-tight mt-3">
                {walletLoading ? (
                  <span className="inline-block w-24 h-6 bg-slate-200/60 animate-pulse rounded" />
                ) : (
                  <AnimatedNumber
                    value={card.value ?? 0}
                    prefix="৳"
                    isCurrency={true}
                  />
                )}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
