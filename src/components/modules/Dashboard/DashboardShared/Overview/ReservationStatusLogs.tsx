/* eslint-disable @typescript-eslint/no-explicit-any */
import { Activity } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { useTranslations } from "next-intl";

interface ReservationStatusLogsProps {
  loading: boolean;
  stats: any;
  managerView?: boolean;
}

export default function ReservationStatusLogs({
  loading,
  stats,
  managerView = false,
}: ReservationStatusLogsProps) {
  const t = useTranslations("manager.overview");
  const logs = [
    {
          label: managerView ? t("confirmed") : "Confirmed",
      value: stats?.confirmed ?? 0,
      border: "border-amber-200 bg-amber-50/30",
    },
    {
      label: managerView ? t("completed") : "Completed",
      value: stats?.completed ?? 0,
      border: "border-emerald-200 bg-emerald-50/30",
    },
    {
      label: managerView ? t("cancelled") : "Cancelled",
      value: stats?.cancelled ?? 0,
      border: "border-rose-200 bg-rose-50/30",
    },
    {
      label: managerView ? t("noShow") : "No Show",
      value: stats?.noShow ?? 0,
      border: "border-slate-200 bg-slate-50/50",
    },
    {
      label: managerView ? t("refunded") : "Refunded",
      value: stats?.refunded ?? 0,
      border: "border-rose-200/60 bg-rose-50/10",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Activity size={14} className="text-slate-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {managerView ? t("statusesTitle") : "Match Reservation Status Logs"}
        </h4>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-5 gap-3">
        {logs.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white border rounded-xl p-3 flex flex-col justify-between transition-colors ${stat.border}`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
              {stat.label}
            </p>
            <p className="mt-2 text-lg font-bold text-slate-800 tracking-tight">
              {loading ? (
                <span className="inline-block w-12 h-5 bg-slate-200/60 animate-pulse rounded" />
              ) : (
                <AnimatedNumber value={Number(stat.value)} isCurrency={false} />
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
