import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const features = [
  "Unlimited Field Setup",
  "Dedicated Public Booking URL",
  "Manual Walk-in Slot Recording",
  "Online Gateway & Cash Support",
  "Real-Time Revenue Analytics",
  "Customer Database Access",
];

export default function PricingSection() {
  const t = useTranslations("marketing.pricing");
  return (
    <section
      id="pricing"
      className="py-20 md:py-28 bg-slate-50/50 scroll-mt-20"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {t("badge")}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            {t("title")}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            {t("description")}
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center border-b border-slate-100 pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              {t("offer")}
            </span>

            <h3 className="mt-5 text-2xl font-extrabold text-slate-900">
              {t("freeDays")}
            </h3>

            <p className="text-xs text-slate-500 mt-2">
              {t("trial", { days: 7 })}
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="text-sm text-slate-400 line-through">৳16</span>

              <span className="text-4xl font-black text-slate-900">৳8</span>

              <span className="text-xs font-semibold text-slate-500">
                {t("perBooking")}
              </span>
            </div>

            <p className="text-[11px] font-semibold text-emerald-600 mt-2">
              {t("introRate")}
            </p>
          </div>

          <ul className="py-6 space-y-3.5">
            <li className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              {t("trialFeature", { days: 7 })}
            </li>

            <li className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              {t("firstYearRate", { amount: 8 })}
            </li>

            <li className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              {t("standardRate", { amount: 16 })}
            </li>

            <li className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              {t("noSetup")}
            </li>

            <li className="flex items-center gap-3 text-xs text-slate-700 font-medium">
              <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              {t("noMonthly")}
            </li>
          </ul>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-[10px] text-center text-slate-400 mb-4">
              {t("payOnSuccess")}
            </p>

            <Button
              asChild
              className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide rounded-xl"
            >
              <Link
                href="/business/onboard"
                className="inline-flex items-center justify-center gap-2"
              >
                {t("cta")}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
