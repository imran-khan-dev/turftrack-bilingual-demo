/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import { useTranslations } from "next-intl";

export interface FinancialMetric {
  label: string;
  netProfit: number;
  unpaidFee: number;
}

interface FinancialChartProps {
  data: FinancialMetric[];
  title?: string;
}

const SERIES = [
  {
    key: "netProfit",
    nameKey: "netProfit",
    color: "#10b981",
    gradientId: "colorProfit",
  },
  {
    key: "unpaidFee",
    nameKey: "unpaidFee",
    color: "#f43f5e",
    gradientId: "colorUnpaid",
  },
] as const;

export function SuperAdminEarningsChart({
  data,
  title,
}: FinancialChartProps) {
  const t = useTranslations("finance");
  const formattedData = data.map((item) => {
    const dateObj = new Date(item.label);
    const formattedLabel = isNaN(dateObj.getTime())
      ? item.label
      : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return { ...item, displayLabel: formattedLabel };
  });

  // running totals for the summary pills
  const totals = data.reduce(
    (acc, item) => ({
      netProfit: acc.netProfit + item.netProfit,
      unpaidFee: acc.unpaidFee + item.unpaidFee,
    }),
    { netProfit: 0, unpaidFee: 0 },
  );

  return (
    <>
      <FiltersToolbar showDateRange={true} showSearchFilters={false} />

      <div className="bg-white border-2 border-slate-100 rounded-4xl overflow-hidden hover:border-slate-200 transition-all">
        {/* HEADER */}
        <div className="px-7 pt-7 pb-2 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="h-10 w-1.5 rounded-full bg-green-500 shrink-0" />
            <div>
              <p className="text-lg font-black italic uppercase tracking-tight text-slate-900">
                {title || t("earningsAnalytics")}
              </p>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">
                {t("profitAndUnpaidFeesOverTime")}
              </p>
            </div>
          </div>

          {/* CUSTOM PILL LEGEND (doubles as summary totals) */}
          <div className="flex flex-wrap gap-2">
            {SERIES.map((s) => (
              <div
                key={s.key}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100"
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                  {t(s.nameKey)}
                </span>
                <span className="text-xs font-black text-slate-900">
                  ${totals[s.key].toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-7 pb-7">
          <div className="h-px bg-slate-100 my-6" />

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {SERIES.map((s) => (
                    <linearGradient
                      key={s.gradientId}
                      id={s.gradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={s.color}
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="displayLabel"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                  tickFormatter={(val) => `$${val}`}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                />

                {SERIES.map((s) => (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={t(s.nameKey)}
                    stroke={s.color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#${s.gradientId})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

/* Custom Tooltip — pill/rounded style matching the rest of the UI */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border-2 border-slate-100 bg-white px-4 py-3 shadow-xl text-xs space-y-2 min-w-[160px]">
        <p className="font-black uppercase tracking-tight text-slate-900 border-b border-slate-100 pb-2">
          {label}
        </p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-slate-400">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-black text-slate-900">
              ${item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
