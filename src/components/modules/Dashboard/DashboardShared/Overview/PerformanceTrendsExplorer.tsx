/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { TrendingUp, CalendarDays, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface PerformanceTrendsExplorerProps {
  loading: boolean;
  bookingTrends: any[];
  revenueTrends: any[];
  canViewFinancials?: boolean; // hides the "Earned Revenue" tab for managers
  managerView?: boolean;
}

const formatTooltipLabel = (str: any) => {
  if (!str || isNaN(Date.parse(str))) {
    return String(str || "");
  }
  const date = new Date(str);
  return date.toLocaleDateString("en-US", { dateStyle: "long" });
};

// Custom Tooltip component injecting data badges matching line/bar visual representations
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 shadow-lg space-y-2">
        <p className="text-slate-200 font-bold text-xs">
          {formatTooltipLabel(label)}
        </p>
        <div className="space-y-1.5">
          {payload.map((item: any, idx: number) => {
            const displayValue =
              item.dataKey === "bookings"
                ? item.value
                : `৳${Number(item.value).toLocaleString()}`;

            return (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded shrink-0"
                  style={{ backgroundColor: item.color || item.fill }}
                />
                <span className="text-[11px] font-semibold text-slate-300">
                  {item.name}:
                </span>
                <span className="text-[11px] font-bold text-white ml-auto">
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function PerformanceTrendsExplorer({
  loading,
  bookingTrends,
  revenueTrends,
  canViewFinancials = true,
  managerView = false,
}: PerformanceTrendsExplorerProps) {
  const t = useTranslations("manager.overview");
  const finance = useTranslations("finance");
  const common = useTranslations("common");
  const [activeTab, setActiveTab] = useState<"bookings" | "revenue">(
    "bookings",
  );

  // Safety net: if a manager somehow lands on the revenue tab (e.g. stale
  // state from a role switch), force back to bookings.
  const effectiveTab = canViewFinancials ? activeTab : "bookings";

  const formatXAxis = (str: string) => {
    const date = new Date(str);
    return isNaN(date.getTime())
      ? str
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
  };

  const bookingsChartMargin = { top: 10, right: 10, left: 15, bottom: 5 };
  const revenueChartMargin = { top: 10, right: 45, left: 15, bottom: 5 };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
            <TrendingUp size={16} />
          </div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {managerView ? t("trendsTitle") : "Performance Trends Explorer"}
          </h3>
        </div>

        <div className="flex p-0.5 bg-slate-100 border border-slate-200 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
              effectiveTab === "bookings"
                ? "bg-white text-green-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <CalendarDays size={12} /> {managerView ? t("bookingsTab") : "Bookings & Checkout"}
          </button>
          {canViewFinancials && (
            <button
              onClick={() => setActiveTab("revenue")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                effectiveTab === "revenue"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Wallet size={12} /> {finance("earnedRevenue")}
            </button>
          )}
        </div>
      </div>

      <div className="w-full h-[320px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl text-xs font-bold text-slate-400 animate-pulse">
            {common("loading")}
          </div>
        ) : effectiveTab === "bookings" ? (
          <ResponsiveContainer width="100%" height="100%">
            {bookingTrends.length === 1 ? (
              <BarChart data={bookingTrends} margin={bookingsChartMargin}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  dy={8}
                  tickFormatter={formatXAxis}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `৳${v.toLocaleString()}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => Math.round(v).toString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  yAxisId="right"
                  name={managerView ? t("bookingsCount") : "Bookings Count"}
                  dataKey="bookings"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  yAxisId="left"
                  name={managerView ? t("checkoutGross") : "Checkout Gross"}
                  dataKey="salesValue"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            ) : (
              <AreaChart data={bookingTrends} margin={bookingsChartMargin}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="bookingsCountGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  dy={8}
                  tickFormatter={formatXAxis}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `৳${v.toLocaleString()}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => Math.round(v).toString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="right"
                  name={managerView ? t("bookingsCount") : "Bookings Count"}
                  type="monotone"
                  dataKey="bookings"
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#bookingsCountGrad)"
                />
                <Area
                  yAxisId="left"
                  name={managerView ? t("checkoutGross") : "Checkout Gross"}
                  type="monotone"
                  dataKey="salesValue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {revenueTrends.length === 1 ? (
              <BarChart data={revenueTrends} margin={revenueChartMargin}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  dy={8}
                  tickFormatter={formatXAxis}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `৳${v.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  name={finance("earnedRevenue")}
                  dataKey="earnedRevenue"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            ) : (
              <AreaChart data={revenueTrends} margin={revenueChartMargin}>
                <defs>
                  <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  dy={8}
                  tickFormatter={formatXAxis}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `৳${v.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  name={finance("earnedRevenue")}
                  type="monotone"
                  dataKey="earnedRevenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#activeGrad)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
