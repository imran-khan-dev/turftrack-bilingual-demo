"use client";

import { Ticket, Coins, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalculationDetails } from "@/types/booking";
import { IAuthUser } from "@/types/user";
import { useTranslations } from "next-intl";

type CheckoutUser = IAuthUser & {
  isSpecial?: boolean;
};

interface StepReviewCheckoutProps {
  calcData: CalculationDetails;
  promoCode: string;
  setPromoCode: (code: string) => void;
  appliedPromo: string;
  promoLoading: boolean;
  loading: boolean;
  handleApplyPromo: () => void;
  userData: CheckoutUser | null;
  isAuthorityUser: boolean;
  payLater: boolean;
  setPayLater: (value: boolean) => void;
  playerView?: boolean;
  managerView?: boolean;
  ownerView?: boolean;
}

export default function StepReviewCheckout({
  calcData,
  promoCode,
  setPromoCode,
  appliedPromo,
  promoLoading,
  loading,
  handleApplyPromo,
  userData,
  isAuthorityUser,
  payLater,
  setPayLater,
  playerView = false,
  managerView = false,
  ownerView = false,
}: StepReviewCheckoutProps) {
  const translated = playerView || managerView || ownerView;
  const t = useTranslations("player.reschedule");
  const bookingT = useTranslations("booking");
  return (
    <div className="space-y-4 animate-in fade-in duration-150 text-xs font-medium">
      <h4 className="font-bold text-slate-800 text-sm">
        {translated ? t("pricingReview") : "Reschedule Pricing Review"}
      </h4>

      {/* Overpayment adjustment */}
      {calcData.refundAmount > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex gap-2.5 animate-in slide-in-from-top-2 duration-200">
          <Coins className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">
              {translated ? t("overpayment") : "Overpayment Adjustment detected"}
            </span>
            <p className="text-emerald-800 font-semibold leading-relaxed">
              {translated ? t("refundExplanation", { amount: Number(calcData.refundAmount).toFixed(2) }) : `Refund of TK ${Number(calcData.refundAmount).toFixed(2)} will be recorded in your new booking context and processed.`}
            </p>
          </div>
        </div>
      )}

      {/* Promo Code Input */}
      <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Ticket className="h-3 w-3" /> {translated ? t("havePromo") : "Have a Promo Code?"}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={translated ? t("enterPromo") : "Enter promo code"}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            disabled={promoLoading || loading}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-slate-400 uppercase font-semibold"
          />
          <Button
            type="button"
            onClick={handleApplyPromo}
            disabled={promoLoading || loading || !promoCode.trim()}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 h-8 rounded-lg"
          >
            {promoLoading ? (translated ? t("applying") : "Applying...") : (translated ? bookingT("apply") : "Apply")}
          </Button>
        </div>
        {appliedPromo && (
          <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1 mt-1">
          {translated ? t("promoActive", { code: appliedPromo }) : <>✓ Promo code &ldquo;{appliedPromo}&rdquo; active</>}
          </p>
        )}
      </div>

      {/* Payment Tiers */}
      {calcData.partialPaymentTier &&
        calcData.partialPaymentTier.length > 0 && (
          <div className="border border-slate-200 bg-white rounded-xl p-3 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {translated ? t("installments") : "Available Installment Breakdowns"}
            </span>
            <div className="flex flex-wrap gap-2">
              {calcData.partialPaymentTier.map((tierAmount, index) => (
                <div
                  key={index}
                  className="border border-slate-100 bg-slate-50/80 rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-slate-700"
                >
                  {translated ? t("tier", { number: index + 1, amount: Number(tierAmount).toFixed(2) }) : `Tier ${index + 1}: TK ${Number(tierAmount).toFixed(2)}`}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Cost Assessment */}
      <div className="border border-slate-100 bg-slate-50/60 rounded-2xl p-4 space-y-2.5 text-slate-600 font-semibold">
        <div className="flex justify-between">
          <span>{translated ? t("subtotal") : "Total Subtotal Cost:"}</span>
          <span className="text-slate-800">
            TK {Number(calcData.totalAmount).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>{translated ? t("discounts") : "Final Discounts Deducted:"}</span>
          <span className="text-green-600">
            - TK {Number(calcData.finalDiscount).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>{translated ? t("payable") : "Adjusted Total Payable:"}</span>
          <span className="text-slate-800">
            TK {Number(calcData.payableAmount).toFixed(2)}
          </span>
        </div>
        <div className="h-px bg-slate-200" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-800 font-bold">
            {translated ? t("settlement") : "Settlement Assessment:"}
          </span>
          {calcData.remainingPayable === 0 && calcData.refundAmount === 0 && (
            <span className="text-green-600 font-bold">{translated ? t("evenExchange") : "Even Exchange"}</span>
          )}
          {calcData.refundAmount > 0 && (
            <span className="text-green-600 font-bold">
              {translated ? t("refundOwed", { amount: Number(calcData.refundAmount).toFixed(2) }) : `Refund Owed: TK ${Number(calcData.refundAmount).toFixed(2)}`}
            </span>
          )}
          {calcData.remainingPayable > 0 && (
            <span className="text-red-600 font-bold">
              {translated ? t("balanceDue", { amount: Number(calcData.remainingPayable).toFixed(2) }) : `Balance Due: TK ${Number(calcData.remainingPayable).toFixed(2)}`}
            </span>
          )}
        </div>
      </div>

      {/* Privileged Deferred Checkbox */}
      {userData?.isSpecial &&
        !isAuthorityUser &&
        calcData.remainingPayable > 0 && (
          <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer select-none">
            <input
              type="checkbox"
              checked={payLater}
              onChange={(e) => setPayLater(e.target.checked)}
              className="rounded text-slate-900 focus:ring-slate-900 h-4 w-4"
            />
            <div>
              <span className="font-bold text-slate-800 block text-xs">
                {translated ? t("deferPayment") : "Defer Balance Payment (Pay Later)"}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                {translated ? t("deferDescription") : "As a privileged player context, you can settle balance fees offline at checkout."}
              </span>
            </div>
          </label>
        )}

      {/* Authority privilege section */}
      {isAuthorityUser && (
        <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-xl text-purple-800 flex gap-2.5">
          <ShieldCheck className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-xs uppercase tracking-wide text-purple-700">
              {translated ? t("authorityTitle") : "Authority Bypass Privileges"}
            </span>
            <span className="font-medium text-[11px] block text-purple-900 mt-0.5">
              {translated ? t("authorityDescription") : "You are modifying this assignment as an administrator/manager. Total charge values are calculated above for clarity, but checkout validation parameters will execute automatically without requiring payment."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
