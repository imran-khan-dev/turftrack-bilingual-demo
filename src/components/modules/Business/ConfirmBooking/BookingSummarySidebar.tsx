"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingSummarySidebarProps {
  timeLeft: number;
  formattedTime: string;
  totalAmount: number;
  finalDiscount: number;
  amountToPayNow: number;
  paymentMode: "FULL" | "TIER" | "LATER";
  paymentMethod: "bkash" | "ssl" | "ziniPay";
  checkoutLoading?: boolean;
  isActionDisabled: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BookingSummarySidebar({
  timeLeft,
  formattedTime,
  totalAmount,
  finalDiscount,
  amountToPayNow,
  paymentMode,
  paymentMethod,
  checkoutLoading = false,
  isActionDisabled,
  onConfirm,
  onCancel,
}: BookingSummarySidebarProps) {
  const t = useTranslations("booking");
  const [showZiniWarning, setShowZiniWarning] = useState(false);

  const handlePayClick = () => {
    if (paymentMethod === "ziniPay" && paymentMode !== "LATER") {
      setShowZiniWarning(true);
      return;
    }

    onConfirm();
  };

  const handleZiniConfirm = () => {
    setShowZiniWarning(false);
    onConfirm();
  };

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-10 bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20" />

          <h2 className="text-2xl font-black italic uppercase tracking-widest mb-10 border-b border-white/10 pb-6">
            {t("bookingSummary")}
          </h2>

          {/* Timer */}
          <div className="mb-8 flex items-center justify-between bg-white/5 p-5 rounded-3xl border border-white/5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              {t("endsIn")}
            </span>

            <span
              className={`font-black italic text-lg ${
                timeLeft < 60 ? "text-red-400 animate-pulse" : "text-green-400"
              }`}
            >
              {formattedTime}
            </span>
          </div>

          {/* Summary values */}
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm px-1 font-bold uppercase tracking-widest text-[10px] text-slate-400">
              <span>{t("totalAmount")}</span>
              <span className="text-white text-base">৳{totalAmount}</span>
            </div>

            {finalDiscount > 0 && (
              <div className="flex justify-between items-center text-sm px-1 font-bold uppercase tracking-widest text-[10px] text-slate-400">
                <span>{t("campaignSavings")}</span>

                <span className="text-green-400 text-base">
                  - ৳{finalDiscount}
                </span>
              </div>
            )}

            <div className="h-px bg-white/10 mx-1" />

            <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10">
              <p className="uppercase text-[10px] font-black text-slate-500 mb-1 tracking-tighter">
                {t("amountToPayNow")}
              </p>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black italic text-green-400">
                  ৳
                </span>

                <span className="text-5xl font-black italic text-green-400 tracking-tighter">
                  {checkoutLoading ? "..." : amountToPayNow}
                </span>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="mt-10 px-2 flex items-start gap-3 opacity-60">
            <ShieldCheck className="text-green-500 shrink-0" size={16} />

            <p className="text-[9px] font-bold uppercase leading-relaxed tracking-tight">
              {t("secureCheckoutNotice")}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Button
              onClick={handlePayClick}
              disabled={isActionDisabled}
              className="w-full h-16 rounded-2xl font-black italic uppercase text-lg shadow-xl transition-all active:scale-[0.98] cursor-pointer bg-green-500 hover:bg-green-400 text-black disabled:opacity-50"
            >
              {checkoutLoading ? (
                <Loader2 className="animate-spin text-black" size={20} />
              ) : paymentMode === "LATER" ? (
                t("confirmAndPayLater")
              ) : (
                t("payAndConfirm")
              )}
            </Button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full h-12 rounded-2xl font-bold uppercase text-[11px] tracking-widest text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer text-center block mt-2"
            >
              {t("cancelBookingSession")}
            </button>
          </div>
        </div>
      </aside>

      {/* ZiniPay Amount Warning */}
      <Dialog open={showZiniWarning} onOpenChange={setShowZiniWarning}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle size={28} className="text-amber-500" />
            </div>

            <DialogTitle className="text-center text-xl font-black">
              {t("payExactAmount")}
            </DialogTitle>

            <DialogDescription className="text-center text-sm leading-relaxed text-slate-500">
              <span className="block font-bold text-slate-700 text-base mb-1">
                {t("amountToPay", { amount: amountToPayNow })}
              </span>

              <span className="block mt-5 pt-4 border-t border-slate-100">
                <strong className="text-slate-700">
                  {t("exactPaymentAmountNotice")}
                </strong>
                <br />
                <br />
                {t("incorrectAmountRefundNotice")}
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={handleZiniConfirm}
              disabled={isActionDisabled}
              className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-400 text-black font-black"
            >
              {t("understandContinuePay")}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowZiniWarning(false)}
              className="w-full h-12 rounded-xl"
            >
              {t("goBack")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
