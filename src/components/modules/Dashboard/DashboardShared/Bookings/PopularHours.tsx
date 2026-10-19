"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ControlsBar from "../Overview/ControlsBar";
import { getPopularHours } from "@/services/booking/getPopularHours";

interface Business {
  id: string;
  name: string;
  slug: string;
}

interface PopularHourData {
  hour: number;
  label: string;
  count: number;
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

export default function PopularHours({ businesses, managerView = false, ownerView = false }: Props) {
  const translatedView = managerView || ownerView;
  const t = useTranslations("manager.popularHours");
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState("all");
  const [preset, setPreset] = useState("7");
  const [data, setData] = useState<PopularHourData[]>([]);

  const today = useMemo(() => formatDate(new Date()), []);
  const [from, setFrom] = useState(() => getPastDate(7));
  const [to, setTo] = useState(today);

  useEffect(() => {
    const fetchPopularHours = async () => {
      try {
        setLoading(true);

        const response = await getPopularHours({ from, to, selectedBusiness });

        if (!response.success) {
          console.warn(response.error);
          setData([]);
          return;
        }

        setData(response.data || []);
      } catch (err) {
        console.error("Unexpected dashboard orchestration issue:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularHours();
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

  const peakHour = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return null;
    return [...data].sort((a, b) => b.count - a.count)[0];
  }, [data]);

  return (
    <div className="space-y-6 mx-auto text-slate-800 antialiased selection:bg-emerald-500/10">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-md shadow-emerald-500/20">
            <Clock size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {translatedView ? t("title") : "Peak Traffic Density Profile"}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {translatedView ? t("description") : "Analyze popular reservation time distributions across active business operating timelines."}
            </p>
          </div>
        </div>

        {!loading && peakHour && peakHour.count > 0 && (
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100/60 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {translatedView ? t("peakHour", { hour: peakHour.label }) : `Highest Velocity: ${peakHour.label}`}
          </div>
        )}
      </div>

      {/* FILTER CONTROL PANEL BAR COMPONENT */}
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

      {/* CHART GRAPH DISPLAY */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm min-h-[400px] flex items-center justify-center">
        {loading ? (
          <div className="text-center flex flex-col items-center gap-2 text-xs font-bold text-slate-400 animate-pulse">
            <Loader2 size={22} className="animate-spin text-emerald-500" />
            {translatedView ? t("loading") : "Compiling operational booking timelines..."}
          </div>
        ) : !Array.isArray(data) ||
          data.length === 0 ||
          data.every((d) => d.count === 0) ? (
          <div className="text-xs font-bold text-slate-400 text-center">
            {translatedView ? t("empty") : "No confirmed or completed checkouts tracked inside this date parameters window."}
          </div>
        ) : (
          <div className="w-full h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  dy={8}
                  interval={
                    typeof window !== "undefined" && window.innerWidth < 640
                      ? 3
                      : 1
                  }
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "0.75rem",
                    border: "1px solid #475569",
                    padding: "10px",
                  }}
                  labelStyle={{
                    color: "#f8fafc",
                    fontWeight: "bold",
                    fontSize: "12px",
                    marginBottom: "3px",
                  }}
                  itemStyle={{
                    color: "#10b981",
                    fontWeight: "700",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "#f1f5f9", opacity: 0.5 }}
                />
                <Bar
                  name={translatedView ? t("chart") : "Bookings Logged"}
                  dataKey="count"
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
