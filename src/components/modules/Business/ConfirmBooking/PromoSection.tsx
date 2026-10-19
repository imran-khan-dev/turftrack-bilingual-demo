/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDiscountSourceLabel } from "@/hooks/confirmBooking/useDiscountSourceLabel";
import { DiscountSource } from "@/types/discount";
import { AlertCircle, CheckCircle2, Loader2, Tag, Ticket } from "lucide-react";
import { useTranslations } from "next-intl";

interface PromoMessage {
  type: "success" | "error";
  text: string;
}

interface DiscountMeta {
  source?: string;
  type?: "PERCENT" | "FLAT" | "MIXED";
  discountValue?: number;
  discount: any;
}

interface PromoSectionProps {
  promoCode: string;
  setPromoCode: React.Dispatch<React.SetStateAction<string>>;
  checkoutLoading: boolean;
  applyPromo: (code: string) => void;
  promoMessage?: PromoMessage | null;
  data: {
    finalDiscount: number;
    discountMeta?: DiscountMeta | null;
  };
}

export function PromoSection({
  promoCode,
  setPromoCode,
  checkoutLoading,
  applyPromo,
  promoMessage,
  data,
}: PromoSectionProps) {
  const t = useTranslations("booking");
  const sourceFriendlyNames: Record<
    string,
    { title: string; subtitle: string }
  > = {
    "HIGHEST_ONLY = FIELD": {
      title: t("promoMeta.field.title"),
      subtitle: t("promoMeta.bestRateSubtitle"),
    },
    "HIGHEST_ONLY = BUSINESS": {
      title: t("promoMeta.business.title"),
      subtitle: t("promoMeta.bestRateSubtitle"),
    },
    "HIGHEST_ONLY = USER": {
      title: t("promoMeta.user.title"),
      subtitle: t("promoMeta.bestRateSubtitle"),
    },
    "HIGHEST_ONLY = PROMO": {
      title: t("promoMeta.promo.title"),
      subtitle: t("promoMeta.bestRateSubtitle"),
    },
    FIELD_ONLY: {
      title: t("promoMeta.specialSlot.title"),
      subtitle: t("promoMeta.specialSlot.subtitle"),
    },
    BUSINESS_ONLY: {
      title: t("promoMeta.businessOnly.title"),
      subtitle: t("promoMeta.businessOnly.subtitle"),
    },
    PROMO_ONLY: {
      title: t("promoMeta.promoOnly.title"),
      subtitle: t("promoMeta.promoOnly.subtitle"),
    },
    "USER + BEST_OTHER": {
      title: t("promoMeta.stacked.title"),
      subtitle: t("promoMeta.stacked.subtitle"),
    },
  };

  const percentValue =
    data.discountMeta?.discount?.promo?.info?.discountValue ??
    data.discountMeta?.discountValue;

  const isPercent = data.discountMeta?.type === "PERCENT";

  const discountLabel = isPercent
    ? t("percentOff", { percent: percentValue })
    : t("amountOff", { amount: data.finalDiscount });

  const metaConfig = (data.discountMeta?.source
    ? sourceFriendlyNames[data.discountMeta.source]
    : null) || {
    title: t("discountApplied"),
    subtitle: t("bestDiscountComputed"),
  };

  return (
    <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Ticket className="text-green-500" size={24} />
        <h2 className="text-xl font-black italic uppercase tracking-tight">
          {t("promoCode")}
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder={t("enterPromoCode")}
          className="min-h-14 sm:min-h-12 px-6 py-4 rounded-2xl border-2 border-slate-100 flex-1 outline-none focus:border-green-500 font-black uppercase tracking-widest transition-all placeholder:text-slate-300"
        />

        <button
          disabled={checkoutLoading}
          onClick={() => applyPromo(promoCode.toUpperCase())}
          className="h-12 px-10 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
        >
          {checkoutLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            t("apply")
          )}
        </button>
      </div>

      {promoMessage && (
        <div
          className={`mt-4 flex items-center gap-2 font-bold text-[11px] uppercase tracking-tight ${
            promoMessage.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {promoMessage.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{promoMessage.text}</span>
        </div>
      )}

      {data.finalDiscount > 0 && data.discountMeta && (
        <div className="mt-6 p-5 rounded-2xl bg-green-50/50 border border-green-100/80 flex items-start gap-4">
          <div className="p-3 bg-green-500 text-white rounded-xl">
            <Tag size={16} />
          </div>

          <div>
            <span className="text-[10px] tracking-widest uppercase font-black text-green-600 block">
              {t("activeCampaign")}
            </span>

            <h4 className="font-black text-slate-800 text-sm mt-0.5">
              {t(getDiscountSourceLabel(
                data.discountMeta.source as DiscountSource,
              ))}
            </h4>

            <div className="mt-2 rounded-lg bg-slate-50 p-2.5 border border-slate-100">
              <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>{metaConfig.title}:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  {discountLabel}
                </span>
              </div>

              <p className="text-[11px] font-normal leading-normal text-slate-400 mt-1">
                {metaConfig.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
