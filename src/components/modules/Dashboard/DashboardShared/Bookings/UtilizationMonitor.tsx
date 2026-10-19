"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Gauge, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import ControlsBar from "../Overview/ControlsBar";
import { getUtilizationMetrics } from "@/services/booking/getUtilizationMetrics";

interface Business {
  id: string;
  name: string;
}

interface UtilizationStats {
  utilization: number;
  totalPossibleSlots: number;
  bookedSlots: number;
  idleSlots: number;
}

interface Props {
  businesses: Business[];
  managerView?: boolean;
  ownerView?: boolean;
}

const formatDate = (d: Date) => d.toISOString().split("T")[0];
const getPastDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDate(d);
};

export default function UtilizationMonitor({ businesses, managerView = false, ownerView = false }: Props) {
  const translatedView = managerView || ownerView;
  const t = useTranslations("manager.utilization");
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [preset, setPreset] = useState("7");
  const [metrics, setMetrics] = useState<UtilizationStats | null>(null);

  const today = useMemo(() => formatDate(new Date()), []);
  const [from, setFrom] = useState(() => getPastDate(7));
  const [to, setTo] = useState(today);

  useEffect(() => {
    const fetchUtilizationMetrics = async () => {
      try {
        setLoading(true);

        const response = await getUtilizationMetrics({
          from,
          to,
          selectedBusiness,
        });

        if (!response.success) {
          console.warn(response.error);
          setMetrics(null);
          return;
        }

        setMetrics(response.data ?? null);
      } catch (err) {
        console.error(
          "Unexpected error routing dashboard metric pipeline:",
          err,
        );
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUtilizationMetrics();
  }, [selectedBusiness, from, to]);

  const handlePresetChange = (value: string) => {
    setPreset(value);
    if (value === "today") {
      setFrom(today);
      setTo(today);
    } else if (value !== "custom") {
      setTo(today);
      setFrom(getPastDate(Number(value)));
    }
  };

  const chartData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: translatedView ? t("booked") : "Booked Slots", value: metrics.bookedSlots, color: "#10b981" },
      { name: translatedView ? t("idle") : "Idle Capacity", value: metrics.idleSlots, color: "#f1f5f9" },
    ];
  }, [metrics]);

  return (
    <div className="space-y-6 mx-auto text-slate-800 antialiased">
      {/* SECTION CONTAINER HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-md shadow-emerald-500/20">
            <Gauge size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {translatedView ? t("title") : "Resource Capacity Utilization"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {translatedView ? t("description") : "Track reservation density profile layouts and available inventory schedules."}
            </p>
          </div>
        </div>
      </div>

      {/* MATCHED CONTROLS BAR INTEGRATION */}
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
        yesterday={getPastDate(1)}
        managerView={translatedView}
      />

      {/* METRICS INTERFACE LAYOUT BLOCK */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px] flex items-center justify-center">
        {loading ? (
          <div className="text-center flex flex-col items-center gap-2 text-xs font-bold text-slate-400 animate-pulse">
            <Loader2 size={22} className="animate-spin text-emerald-500" />
            {translatedView ? t("loading") : "Calculating business schedule utilization configurations..."}
          </div>
        ) : !metrics || metrics.totalPossibleSlots === 0 ? (
          <div className="text-xs font-bold text-slate-400 text-center">
            {translatedView ? t("empty") : "No active business operational intervals mapped within this query selection."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 w-full items-center">
            {/* RADIAL VISUALIZATION GAUGE DISPLAY */}
            <div className="md:col-span-2 flex flex-col items-center justify-center relative min-h-[260px]">
              <div className="w-full h-[240px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={95}
                      startAngle={220}
                      endAngle={-40}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "0.5rem",
                        border: "none",
                      }}
                      itemStyle={{
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* TEXT LAYER INSIDE CENTER HOLE HOVER */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center translate-y-2">
                  <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                    {metrics.utilization}%
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">
                    {translatedView ? t("totalUtilized") : "Total Utilized"}
                  </span>
                </div>
              </div>
            </div>

            {/* SEGMENTED QUANTITY DATA CARD METRIC GRID */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TOTAL SLOTS CARD */}
              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {translatedView ? t("generatedCapacity") : "Generated Capacity"}
                </span>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-slate-800">
                    {metrics.totalPossibleSlots.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {translatedView ? t("totalWindows") : "Total generation windows possible."}
                  </p>
                </div>
              </div>

              {/* BOOKED SLOTS CARD */}
              <div className="border border-slate-100 bg-emerald-50/20 p-4 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                    {translatedView ? t("bookedInventory") : "Booked Inventory"}
                  </span>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-emerald-600">
                    {metrics.bookedSlots.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {translatedView ? t("occupied") : "Slots occupied via checkout tracking."}
                  </p>
                </div>
              </div>

              {/* IDLE CAPACITY CARD */}
              <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl col-span-1 sm:col-span-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {translatedView ? t("idle") : "Idle Overhead Windows"}
                  </span>
                  <AlertCircle size={14} className="text-slate-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-slate-700">
                    {metrics.idleSlots.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    (
                    {(
                      (metrics.idleSlots / metrics.totalPossibleSlots) *
                      100
                    ).toFixed(1)}
                    {translatedView ? t("leftover") : "% Leftover"})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {translatedView ? t("vacant") : "Vacant calendar allocations left open without incoming conversions."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
