"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscountSource } from "@/types/discount";
import { useTranslations } from "next-intl";

interface MobileCheckoutDockProps {
  checkoutLoading?: boolean;
  amountToPayNow: number;
  timeLeft: number;
  formattedTime: string;
  finalDiscount: number;
  discountSource?: DiscountSource;
  paymentMode: "FULL" | "TIER" | "LATER";
  isActionDisabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  getDiscountSourceLabel: (source?: DiscountSource) => string;
}

export function MobileCheckoutDock({
  checkoutLoading = false,
  amountToPayNow,
  timeLeft,
  formattedTime,
  finalDiscount,
  discountSource,
  paymentMode,
  isActionDisabled,
  onConfirm,
  onCancel,
  getDiscountSourceLabel,
}: MobileCheckoutDockProps) {
  const t = useTranslations("booking");
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-4 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
      {/* TOP INFO ROW */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
              {t("payNow")}
          </p>

          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-green-500">৳</span>

            <span className="text-3xl font-black italic tracking-tight text-slate-900">
              {checkoutLoading ? "..." : amountToPayNow}
            </span>
          </div>
        </div>

        <div
          className={`px-3 py-2 rounded-2xl border text-xs font-black tabular-nums ${
            timeLeft < 60
              ? "bg-red-500 text-white border-red-400 animate-pulse"
              : "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        >
          {formattedTime}
        </div>
      </div>

      {/* DISCOUNT PREVIEW */}
      {finalDiscount > 0 && (
        <div className="mb-4 rounded-2xl bg-green-50 border border-green-100 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase font-black tracking-widest text-green-600">
              {t("savings")}
            </p>

            <p className="text-xs font-bold text-slate-700">
              {t(getDiscountSourceLabel(discountSource))}
            </p>
          </div>

          <p className="text-lg font-black italic text-green-600">
            -৳{finalDiscount}
          </p>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="space-y-3">
        <Button
          onClick={onConfirm}
          disabled={isActionDisabled}
          className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-wide text-sm disabled:opacity-50"
        >
          {checkoutLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : paymentMode === "LATER" ? (
            t("confirmAndPayLater")
          ) : (
            t("payAndConfirm")
          )}
        </Button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full h-11 rounded-2xl border border-red-100 text-red-500 font-bold uppercase text-[11px] tracking-widest"
        >
          {t("cancelBooking")}
        </button>
      </div>
    </div>
  );
}
