/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import OperationalRadar from "./OperationalRadar";
import ControlsBar from "./ControlsBar";
import WalletPlatform from "./WalletPlatform";
import FinancialLedger from "./FinancialLedger";
import ReservationStatusLogs from "./ReservationStatusLogs";
import PerformanceTrendsExplorer from "./PerformanceTrendsExplorer";
import { serverGet } from "@/services/server-get";
import { useTranslations } from "next-intl";

interface Business {
  id: string;
  name: string;
  slug: string;
}

interface KPIData {
  earnedRevenue: number;
  pendingMatchFunds: number;
  totalOnlineCollection: number;
  totalRefunds: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  refunded: number;
}

interface BookingTrendPoint {
  date: string;
  bookings: number;
  salesValue: number;
}

interface RevenueTrendPoint {
  date: string;
  bookings: number;
  activeRevenue: number;
  deferredRevenue: number;
}

interface WalletBalances {
  currentBalance: number;
  eligibleWithdrawal: number;
  currentDebt: number;
  netEarningsFromOnlinePaid: number;
  totalWithdrawn: number;
}

type DashboardRole = "OWNER" | "MANAGER" | "SUPER_ADMIN";

interface Props {
  businesses: Business[];
  role: DashboardRole;
  ownerView?: boolean;
}

const getBdStringDate = (offsetDays = 0) => {
  const d = new Date();
  if (offsetDays) d.setDate(d.getDate() + offsetDays);

  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
};

const MAX_RANGE_DAYS = 90;

export default function BusinessDashboardOverview({ businesses, role, ownerView = role === "OWNER" }: Props) {
  const t = useTranslations("manager.overview");
  const ownerT = useTranslations("owner.dashboard");
  const managerView = role === "MANAGER";
  const translatedOperationsView = managerView || ownerView;
  const canViewFinancials = role === "OWNER" || role === "SUPER_ADMIN";
  const canViewKpi = true; // OWNER, MANAGER, SUPER_ADMIN all see KPI stats

  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [preset, setPreset] = useState("7");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Timezone-safe execution targets
  const today = useMemo(() => getBdStringDate(0), []);
  const yesterday = useMemo(() => getBdStringDate(-1), []);

  const [from, setFrom] = useState(() => getBdStringDate(-7));
  const [to, setTo] = useState(today);

  const [stats, setStats] = useState<KPIData | null>(null);
  const [bookingTrends, setBookingTrends] = useState<BookingTrendPoint[]>([]);
  const [revenueTrends, setRevenueTrends] = useState<RevenueTrendPoint[]>([]);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [refundCount, setRefundCount] = useState<number>(0);

  const [walletBalances, setWalletBalances] = useState<WalletBalances>({
    currentBalance: 0,
    eligibleWithdrawal: 0,
    currentDebt: 0,
    netEarningsFromOnlinePaid: 0,
    totalWithdrawn: 0,
  });

  const validateRange = (start: string, end: string) => {
    const diff =
      (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= MAX_RANGE_DAYS;
  };

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        setLoading(true);

        const filterParams: Record<string, string> = { from, to };
        if (selectedBusiness !== "all") {
          filterParams.businessId = selectedBusiness;
        }

        const kpiPromise = canViewKpi
          ? serverGet("/finance/kpi-summary", filterParams)
          : Promise.resolve(null);

        // Revenue trend chart stays owner/super-admin only.
        const revenueTrendPromise = canViewFinancials
          ? serverGet("/finance/revenue-trends", filterParams)
          : Promise.resolve(null);

        const [
          kpiRes,
          bookingTrendRes,
          revenueTrendRes,
          reviewRes,
          refundRes,
          overpaidRefundRes,
        ] = await Promise.all([
          kpiPromise,
          serverGet("/booking/trends", filterParams),
          revenueTrendPromise,
          serverGet("/booking/all", { status: "FOR_REVIEW", limit: "1000" }),
          serverGet("/booking/all", {
            dateField: "cancelledAt",
            status: "FOR_REFUND",
            limit: "1000",
          }),
          serverGet("/booking/all", {
            isOverPaidRefunded: "false",
            limit: "1000",
          }),
        ]);

        if (canViewKpi) {
          setStats(kpiRes?.success ? kpiRes.data : null);
        } else {
          setStats(null);
        }

        if (canViewFinancials) {
          setRevenueTrends(
            (revenueTrendRes?.success ? revenueTrendRes.data?.trends : []) ||
              [],
          );
        } else {
          setRevenueTrends([]);
        }

        setBookingTrends(
          (bookingTrendRes?.success ? bookingTrendRes.data?.trends : []) || [],
        );

        setReviewCount(
          reviewRes?.success ? reviewRes.data?.meta?.total ?? 0 : 0,
        );

        const overpaidCount = (
          (overpaidRefundRes?.success
            ? overpaidRefundRes.data?.formattedData
            : []) || []
        ).filter((b: any) => Number(b.overPaidRefund || 0) > 0).length;

        setRefundCount(
          (refundRes?.success ? refundRes.data?.meta?.total ?? 0 : 0) +
            overpaidCount,
        );
      } catch (err) {
        console.error("Dashboard core pipeline request failure:", err);
      } finally {
        setLoading(false);
      }
    };

    if (validateRange(from, to)) {
      fetchAllDashboardData();
    }
  }, [
    selectedBusiness,
    from,
    to,
    refreshTrigger,
    canViewFinancials,
    canViewKpi,
  ]);

  useEffect(() => {
    if (!canViewFinancials) return;

    const fetchWalletData = async () => {
      try {
        setWalletLoading(true);

        if (selectedBusiness === "all") {
          const fetchPromises = businesses.map((b) =>
            serverGet(`/finance/${b.id}/my-wallet`).catch(() => null),
          );

          const results = await Promise.all(fetchPromises);

          const totals = results.reduce(
            (acc, curr) => {
              const balances = curr?.success ? curr.data?.balances : null;
              const stats = curr?.success ? curr.data?.stats : null;

              if (balances) {
                acc.currentBalance += Number(balances.currentBalance || 0);
                acc.currentDebt += Number(balances.currentDebt || 0);
                acc.eligibleWithdrawal += Number(
                  balances.eligibleWithdrawal || 0,
                );
                acc.netEarningsFromOnlinePaid += Number(
                  balances.netEarningsFromOnlinePaid || 0,
                );
                acc.totalWithdrawn += Number(stats?.totalWithdrawn || 0);
              }
              return acc;
            },
            {
              currentBalance: 0,
              currentDebt: 0,
              eligibleWithdrawal: 0,
              netEarningsFromOnlinePaid: 0,
              totalWithdrawn: 0,
            },
          );

          setWalletBalances(totals as any);
        } else {
          const res = await serverGet(`/finance/${selectedBusiness}/my-wallet`);

          if (res?.success && res.data?.balances) {
            setWalletBalances({
              currentBalance: Number(res.data.balances.currentBalance || 0),
              eligibleWithdrawal: Number(
                res.data.balances.eligibleWithdrawal || 0,
              ),
              currentDebt: Number(res.data.balances.currentDebt || 0),
              netEarningsFromOnlinePaid: Number(
                res.data.balances.netEarningsFromOnlinePaid || 0,
              ),
              totalWithdrawn: Number(res.data.stats?.totalWithdrawn || 0),
            });
          }
        }
      } catch (err) {
        console.error("Failed reconciling system wallet states:", err);
      } finally {
        setWalletLoading(false);
      }
    };

    if (businesses.length > 0 || selectedBusiness !== "all") {
      fetchWalletData();
    }
  }, [selectedBusiness, businesses, refreshTrigger, canViewFinancials]);

  const handlePresetChange = (value: string) => {
    setPreset(value);
    if (value === "today") {
      setFrom(today);
      setTo(today);
    } else if (value === "yesterday") {
      setFrom(yesterday);
      setTo(yesterday);
    } else if (value !== "custom") {
      setTo(today);
      // FIX: Forces lookbacks to be offset from local Bangladesh midnight reference
      setFrom(getBdStringDate(-Number(value)));
    }
  };

  const triggerManualDataSync = () => {
    setIsRefreshing(true);
    setStats(null);
    setWalletBalances({
      currentBalance: 0,
      eligibleWithdrawal: 0,
      currentDebt: 0,
      netEarningsFromOnlinePaid: 0,
      totalWithdrawn: 0,
    });

    setRefreshTrigger((prev) => prev + 1);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 650);
  };

  const isGlobalLoading = loading || isRefreshing;

  return (
    <div className="space-y-6 mx-auto text-slate-800 antialiased selection:bg-green-500/10">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {ownerView ? ownerT("title") : managerView ? t("title") : "Management Operations Console"}
          </h1>
          <p className="text-xs text-slate-500">
            {ownerView ? ownerT("description") : managerView ? t("description") : "Real-time systemic platform synchronization"}
          </p>
        </div>
        <button
          onClick={triggerManualDataSync}
          disabled={isGlobalLoading || walletLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100/80 disabled:opacity-50 transition-all text-slate-700 shadow-sm"
        >
          <RefreshCw
            size={13}
            className={`${
              isGlobalLoading ? "animate-spin text-green-600" : "text-slate-500"
            }`}
          />
          {ownerView ? (isGlobalLoading ? ownerT("syncing") : ownerT("refresh")) : managerView ? (isGlobalLoading ? t("syncing") : t("refresh")) : (isGlobalLoading ? "Syncing Console..." : "Refresh Console")}
        </button>
      </div>

      <OperationalRadar
        loading={isGlobalLoading}
        reviewCount={reviewCount}
        refundCount={refundCount}
        managerView={translatedOperationsView}
      />

      <ControlsBar
        businesses={businesses}
        selectedBusiness={selectedBusiness}
        setSelectedBusiness={setSelectedBusiness}
        preset={preset}
        handlePresetChange={handlePresetChange}
        from={from}
        to={to}
        setFrom={setFrom}
        setTo={setTo}
        setPreset={setPreset}
        today={today}
        yesterday={yesterday}
        managerView={translatedOperationsView}
      />

      {canViewFinancials && (
        <FinancialLedger loading={isGlobalLoading} stats={stats} />
      )}

      <ReservationStatusLogs loading={isGlobalLoading} stats={stats} managerView={translatedOperationsView} />

      <PerformanceTrendsExplorer
        loading={isGlobalLoading}
        bookingTrends={bookingTrends}
        revenueTrends={revenueTrends}
        canViewFinancials={canViewFinancials}
        managerView={translatedOperationsView}
      />

      {canViewFinancials && (
        <WalletPlatform
          selectedBusiness={selectedBusiness}
          walletLoading={walletLoading || isRefreshing}
          walletBalances={walletBalances}
        />
      )}
    </div>
  );
}
