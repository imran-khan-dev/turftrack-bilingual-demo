"use client";

import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface CancelBookingModalProps {
  open: boolean;
  cancelLoading?: boolean;
  onClose: () => void;
  onKeepBooking: () => void;
  onCancelBooking: () => void;
}

export function CancelBookingModal({
  open,
  cancelLoading = false,
  onClose,
  onKeepBooking,
  onCancelBooking,
}: CancelBookingModalProps) {
  const t = useTranslations("booking");
  const commonT = useTranslations("common");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-black text-red-500">
              {t("cancelBooking")}
            </p>

            <h2 className="text-3xl font-black tracking-tight italic mt-2 text-slate-900">
              {t("areYouSure")}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full cursor-pointer bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <p className="mt-5 text-slate-500 leading-relaxed font-medium">
          {t("cancelBookingDescription")}
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          <button
            onClick={onKeepBooking}
            disabled={cancelLoading}
            className="h-14 rounded-2xl cursor-pointer border border-slate-200 font-bold uppercase text-xs tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            {t("keepBooking")}
          </button>

          <button
            onClick={onCancelBooking}
            disabled={cancelLoading}
            className="h-14 rounded-2xl cursor-pointer bg-red-500 text-white font-bold uppercase text-xs tracking-widest hover:bg-red-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {cancelLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                {commonT("cancel")} <X size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
