import { ClipboardCheck, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

interface OperationalRadarProps {
  loading: boolean;
  reviewCount: number;
  refundCount: number;
  managerView?: boolean;
}

export default function OperationalRadar({ loading, reviewCount, refundCount, managerView = false }: OperationalRadarProps) {
  const t = useTranslations("manager.overview");
  const label = (key: string, fallback: string) => managerView ? t(key as never) : fallback;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between transition-colors hover:border-slate-300">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
            {label("actionItem", "Action Item")}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">{label("reviewBookings", "Bookings For Review")}</h3>
          <p className="text-xs text-slate-500">{label("reviewDescription", "Unresolved Match Results Pending Review")}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-3xl font-black tracking-tight ${reviewCount > 15 ? "text-amber-600 animate-pulse" : "text-slate-700"}`}>
            {loading ? "..." : reviewCount}
          </span>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-600">
            <ClipboardCheck size={20} />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between transition-colors hover:border-slate-300">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
            {label("refundsPending", "Refunds Pending")}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">{label("refundQueue", "Refunds Queue")}</h3>
          <p className="text-xs text-slate-500">{label("refundDescription", "Cancellations awaiting platform settlement")}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-3xl font-black tracking-tight ${refundCount > 5 ? "text-rose-600 animate-pulse" : "text-slate-700"}`}>
            {loading ? "..." : refundCount}
          </span>
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-600">
            <RefreshCcw size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
