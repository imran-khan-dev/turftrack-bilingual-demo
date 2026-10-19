/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  Wallet,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Ban,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { getPlayerDashboardStats } from "@/services/player/getPlayerDashboardStats";
import { useTranslations } from "next-intl";

interface UpcomingMatch {
  id: string;
  startTime: string;
  status: string;
  business: { name: string; location: string };
}

interface RecentActivityItem {
  id: string;
  businessName: string;
  date: string;
  status: string;
  amount: string | number;
}

interface DashboardStats {
  totalPending: number;
  totalConfirmed: number;
  totalCompleted: number;
  totalCancelled: number;
  totalRefunds: number;
  upcomingMatches: UpcomingMatch[];
  totalPaid: number;
  totalDue: number;
  totalUpcoming: number;
}

interface PlayerDashboardData {
  profile: { fullName: string; clubName: string };
  stats: DashboardStats;
  recentActivity: RecentActivityItem[];
  graphData: { completed: string; cancelled: string; pending: string };
  restrictedBusinesses: string[];
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  REFUNDED: "bg-slate-100 text-slate-600 border-slate-200",
  RESCHEDULED: "bg-violet-50 text-violet-700 border-violet-200",
};

const displayStatus = (status: string, t: ReturnType<typeof useTranslations>) => {
  const key = `statusLabels.${status}`;
  return t.has(key) ? t(key) : status;
};

const PIE_COLORS: Record<string, string> = {
  COMPLETED: "#10b981",
  CANCELLED: "#f43f5e",
  PENDING: "#f59e0b",
};

const formatTaka = (n: number) =>
  `৳${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function PlayerDashboardOverview() {
  const t = useTranslations("player");
  const [data, setData] = useState<PlayerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getPlayerDashboardStats();

      if (!result.success)
        throw new Error(result.data.message || t("dashboardLoadFailed"));
      setData(result.data);
    } catch (err: any) {
      console.error("Player dashboard load failed:", err);
      setError(err.message || t("dashboardLoadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-6 animate-pulse">
        <div className="h-24 bg-slate-100 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-72 bg-slate-100 rounded-2xl" />
          <div className="lg:col-span-2 h-72 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-700">
          {error || t("dashboardLoadError")}
        </p>
        <button
          onClick={loadDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700"
        >
          <RefreshCw size={13} /> {t("tryAgain")}
        </button>
      </div>
    );
  }

  const { profile, stats, recentActivity, graphData, restrictedBusinesses } =
    data;

  const pieData = [
    { name: "COMPLETED", value: Number(graphData.completed) },
    { name: "CANCELLED", value: Number(graphData.cancelled) },
    { name: "PENDING", value: Number(graphData.pending) },
  ].filter((d) => d.value > 0);

  const netDue = stats.totalDue > 0;

  return (
    <div className="w-full space-y-6 mx-auto text-slate-800 antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-2xl px-5 sm:px-6 py-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {t("welcomeBack", { name: profile.fullName.split(" ")[0] })}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {profile.clubName !== "None" ? profile.clubName : t("freeAgent")} ·{" "}
            {t("upcomingCount", { count: stats.totalUpcoming })}
          </p>
        </div>
        <button
          onClick={loadDashboard}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100/80 transition-all text-slate-700 shadow-sm self-start sm:self-auto"
        >
          <RefreshCw size={13} className="text-slate-500" />
          {t("refresh")}
        </button>
      </div>

      {/* Restriction banner */}
      {restrictedBusinesses.length > 0 && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4">
          <Ban className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-rose-700">
              {t("restrictedFromBooking")}
            </p>
            <p className="text-xs text-rose-600 mt-0.5">
              {restrictedBusinesses.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<CalendarClock size={16} />}
          label={t("upcoming")}
          value={stats.totalUpcoming}
          accent="text-indigo-600 bg-indigo-50"
        />
        <StatCard
          icon={<CheckCircle2 size={16} />}
          label={t("completed")}
          value={stats.totalCompleted}
          accent="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          icon={<XCircle size={16} />}
          label={t("cancelled")}
          value={stats.totalCancelled}
          accent="text-rose-600 bg-rose-50"
        />
        <StatCard
          icon={<Wallet size={16} />}
          label={netDue ? t("amountDue") : t("allSettled")}
          value={netDue ? formatTaka(stats.totalDue) : formatTaka(0)}
          accent={
            netDue
              ? "text-amber-600 bg-amber-50"
              : "text-emerald-600 bg-emerald-50"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player standing pie chart */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            {t("bookingMix")}
          </h3>
          {pieData.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-16">
              {t("noBookingHistory")}
            </p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[entry.name] || "#94a3b8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[entry.name] }}
                />
                <span className="text-[11px] font-semibold text-slate-500">
                  {displayStatus(entry.name, t)} ({entry.value}%)
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t("totalPaid")}</span>
              <span className="font-bold text-slate-800">
                {formatTaka(stats.totalPaid)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{t("totalDue")}</span>
              <span
                className={`font-bold ${netDue ? "text-amber-600" : "text-slate-800"}`}
              >
                {formatTaka(stats.totalDue)}
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming matches */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            {t("upcomingMatches")}
          </h3>
          {stats.upcomingMatches.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-16">
              {t("noUpcomingMatches")}
            </p>
          ) : (
            <div className="space-y-2">
              {stats.upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {match.business.name}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {match.business.location}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-slate-600">
                      {formatDate(match.startTime)}
                    </p>
                    <span
                      className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                        STATUS_STYLES[match.status] ||
                        "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {displayStatus(match.status, t)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
          {t("recentActivity")}
        </h3>
        {recentActivity.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-10">
            {t("noRecentActivity")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                  <th className="pb-2 font-bold">{t("business")}</th>
                  <th className="pb-2 font-bold">{t("date")}</th>
                  <th className="pb-2 font-bold">{t("status")}</th>
                  <th className="pb-2 font-bold text-right">{t("amount")}</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="py-2.5 font-semibold text-slate-700">
                      {item.businessName}
                    </td>
                    <td className="py-2.5 text-slate-500">
                      {formatDate(item.date)}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                          STATUS_STYLES[item.status] ||
                          "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {displayStatus(item.status, t)}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-800">
                      {formatTaka(Number(item.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${accent}`}
      >
        {icon}
      </div>
      <p className="text-lg font-bold text-slate-900 truncate">{value}</p>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
        {label}
      </p>
    </div>
  );
}
