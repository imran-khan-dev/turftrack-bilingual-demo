/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatTo12Hour } from "@/utils/formatTime";
import { useTranslations } from "next-intl";
import { Loader2, ShieldAlert } from "lucide-react";

interface TableProps {
  blockedBookings: any[];
  isLoadingList: boolean;
  actionId: string | null;
  onRelease: (id: string) => void;
  managerView?: boolean;
}

export default function BlockedSlotsTable({
  blockedBookings,
  isLoadingList,
  actionId,
  onRelease,
  managerView = false,
}: TableProps) {
  const t = useTranslations("manager.blockSlots");
  const label = (key: string, fallback: string) => managerView ? t(key as never) : fallback;
  // Safe array conversion guard rail
  const safeBookings = Array.isArray(blockedBookings) ? blockedBookings : [];

  if (isLoadingList && safeBookings.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-2 text-zinc-400">
        <Loader2 size={20} className="animate-spin text-zinc-500" />
        <span className="text-xs font-medium">{label("loading", "Loading ledger indices...")}</span>
      </div>
    );
  }

  if (safeBookings.length === 0) {
    return (
      <div className="w-full py-12 px-4 flex flex-col items-center justify-center text-center space-y-2 border-t border-slate-100">
        <div className="p-2.5 rounded-full bg-slate-50 border border-slate-200 text-slate-400">
          <ShieldAlert size={18} />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {label("empty", "No Blocked Slots Found")}
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs">
            {label("clear", "All hours are clear for user reservations matching this criteria.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-t border-slate-200">
      {/* MOBILE RESPONSIVE LIST (Hidden on tablets and desktops) */}
      <div className="block sm:hidden divide-y divide-slate-100 bg-white">
        {safeBookings.map((item) => {
          if (!item) return null;

          const isReleasing = actionId === item.id;
          const targetDateStr = item.startTime
            ? new Date(item.startTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : label("notAvailable", "N/A");

          const startStr = item.startTime
            ? new Date(item.startTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "00:00";

          const endStr = item.endTime
            ? new Date(item.endTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "00:00";

          return (
            <div
              key={item.id}
              className="p-4 flex flex-col gap-3 hover:bg-slate-50/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs">
                  #{item.reference_id || item.id?.slice(0, 8)}
                </span>
                <button
                  type="button"
                  disabled={actionId !== null}
                  onClick={() => onRelease(item.id)}
                  className="inline-flex items-center justify-center h-7 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 text-[11px] font-bold rounded-xl transition-all disabled:opacity-50 min-w-[90px] cursor-pointer"
                >
                  {isReleasing ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    label("release", "Release")
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] pt-1">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {label("field", "Court / Field")}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {item.fieldName || item.field?.name || label("location", "Court Location")}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {label("date", "Date")}
                  </span>
                  <span className="font-medium text-slate-500">
                    {targetDateStr}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                    {label("time", "Time Window")}
                  </span>
                  <span className="font-bold text-slate-600">
                    {formatTo12Hour(startStr)} - {formatTo12Hour(endStr)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP TABLE VIEW (Hidden on small mobile viewports) */}
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100">
              <th className="py-3 px-4">{label("reference", "Reference ID")}</th>
              <th className="py-3 px-4">{label("field", "Field / Court")}</th>
              <th className="py-3 px-4">{label("date", "Target Schedule Date")}</th>
              <th className="py-3 px-4">{label("time", "Time Window")}</th>
              <th className="py-3 px-4 text-right">{label("actions", "Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
            {safeBookings.map((item) => {
              if (!item) return null;

              const isReleasing = actionId === item.id;
              const targetDateStr = item.startTime
                ? new Date(item.startTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : label("notAvailable", "N/A");

              const startStr = item.startTime
                ? new Date(item.startTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : "00:00";

              const endStr = item.endTime
                ? new Date(item.endTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : "00:00";

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-4 px-4 font-bold text-slate-800">
                    {item.reference_id || item.id?.slice(0, 8)}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    {item.fieldName || item.field?.name || label("location", "Court Location")}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-500">
                    {targetDateStr}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-600">
                    {formatTo12Hour(startStr)} - {formatTo12Hour(endStr)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      disabled={actionId !== null}
                      onClick={() => onRelease(item.id)}
                      className="inline-flex items-center justify-center h-7 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 text-[11px] font-bold rounded-xl transition-all disabled:opacity-50 min-w-[84px] cursor-pointer"
                    >
                      {isReleasing ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        label("quickRelease", "Quick Release")
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
