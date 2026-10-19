/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  ShoppingBag,
  Trash2,
  Lock,
  Timer,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { BusinessField } from "@/types/business";
import { SelectedSlot } from "@/types/booking";
import { formatTo12Hour } from "@/utils/formatTime";
import { useTranslations } from "next-intl";

interface CheckoutCalculations {
  sumUpTotalAmount: number;
  finalDiscount: number;
  payableAmount: number;
}

interface ManualBookingSummarySidebarProps {
  selectedSlots: SelectedSlot[];
  fields: BusinessField[];
  activeCartId: string | null;
  timeLeft: number | null;
  promoInput: string;
  onPromoInput: (val: string) => void;
  promoMessage: { type: "success" | "error"; text: string } | null;
  calculations: CheckoutCalculations | null;
  isLockDisabled: boolean;
  isSubmitting: boolean;
  isCalculatingCheckout: boolean;
  onToggleSlot: (item: any) => void;
  onLockSession: () => void;
  onApplyPromo: () => void;
  onConfirmBooking: () => void;
  managerView?: boolean;
}

export default function ManulBookingSummarySidebar({
  selectedSlots,
  fields,
  activeCartId,
  timeLeft,
  promoInput,
  onPromoInput,
  promoMessage,
  calculations,
  isLockDisabled,
  isSubmitting,
  isCalculatingCheckout,
  onToggleSlot,
  onLockSession,
  onApplyPromo,
  onConfirmBooking,
  managerView = false,
}: ManualBookingSummarySidebarProps) {
  const t = useTranslations("manager.manualBooking");
  const baseTotalPrice = selectedSlots.reduce(
    (acc, curr) => acc + curr.price,
    0,
  );

  const formatTimerString = (seconds: number | null) => {
    if (seconds === null) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="lg:col-span-4 p-6 bg-zinc-50/30 dark:bg-zinc-900/10 flex flex-col justify-between gap-8">
      <div className="space-y-5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <ShoppingBag size={14} className="text-zinc-400" /> {managerView ? t("summary") : "Booking Summary"}
        </div>

        {/* CART LIST */}
        {selectedSlots.length === 0 ? (
          <div className="p-5 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-center text-xs text-zinc-400 font-medium">
            {managerView ? t("selectSlots") : "Select one or more time slots to compute the total price."}
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedSlots.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs shadow-2xs"
              >
                <div className="truncate pr-2">
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">
                    {fields.find((f) => f.id === item.fieldId)?.name}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 block text-[10px] mt-0.5">
                    {item.date} • {formatTo12Hour(item.startTime)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                    ৳{item.price}
                  </span>
                  {!activeCartId && (
                    <button
                      type="button"
                      onClick={() => onToggleSlot(item)}
                      className="text-zinc-400 hover:text-rose-500 transition-colors p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOCK BUTTON VS TIMER CODE SECTION */}
        {!activeCartId ? (
          <button
            type="button"
            onClick={onLockSession}
            disabled={isLockDisabled}
            className="w-full h-10 bg-black hover:bg-black/80 text-white text-xs font-bold rounded-lg disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Lock size={13} />
            )}
            {managerView ? t("lockSelected") : "Lock Selected Slots"}
          </button>
        ) : (
          <div className="border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <Timer
                  size={14}
                  className="text-amber-600 dark:text-amber-500"
                />{" "}
                {managerView ? t("holdExpires") : "Hold Expires In:"}
              </span>
              <span className="font-mono bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded text-xs text-amber-700 dark:text-amber-300 font-bold">
                {formatTimerString(timeLeft)}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wide block">
                {managerView ? t("havePromo") : "Have a promo code?"}
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={managerView ? t("enterCode") : "ENTER CODE"}
                  value={promoInput}
                  onChange={(e) => onPromoInput(e.target.value.toUpperCase())}
                  className="h-8 flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-2.5 text-xs font-semibold tracking-wider font-mono text-zinc-700 dark:text-zinc-300 uppercase outline-none focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={onApplyPromo}
                  disabled={isCalculatingCheckout || isSubmitting}
                  className="h-8 px-3.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-md text-xs font-semibold transition-all flex items-center justify-center min-w-[64px]"
                >
                  {isCalculatingCheckout ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    managerView ? t("apply") : "Apply"
                  )}
                </button>
              </div>
              {promoMessage && (
                <p
                  className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${promoMessage.type === "success" ? "text-emerald-600" : "text-rose-600"}`}
                >
                  {promoMessage.type === "success" ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )}
                  {promoMessage.text}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TOTAL BILLING ROW FOOTER */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-4">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-zinc-500">
            <span>{managerView ? t("subtotal") : "Subtotal:"}</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              ৳
              {(
                calculations?.sumUpTotalAmount || baseTotalPrice
              ).toLocaleString("en-BD")}
            </span>
          </div>
          {Number(calculations?.finalDiscount || 0) > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>{managerView ? t("discountApplied") : "Discount Applied:"}</span>
              <span>
                -৳{calculations?.finalDiscount.toLocaleString("en-BD")}
              </span>
            </div>
          )}
          <div className="flex justify-between text-zinc-800 dark:text-zinc-200 font-semibold border-t border-zinc-200 dark:border-zinc-800 pt-3 text-sm">
            <span>{managerView ? t("totalPayable") : "Total Payable:"}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ৳
              {(calculations?.payableAmount || baseTotalPrice).toLocaleString(
                "en-BD",
              )}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirmBooking}
          disabled={!activeCartId || isCalculatingCheckout || isSubmitting}
          className="w-full h-11 bg-zinc-900 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 text-white dark:text-zinc-900 disabled:text-zinc-400 text-xs font-medium uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          {isSubmitting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RefreshCw size={13} />
          )}
          {managerView ? t("confirmBooking") : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
