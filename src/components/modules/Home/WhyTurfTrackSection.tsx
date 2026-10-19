import {
  ShieldAlert,
  Zap,
  HeartHandshake,
  TrendingUp,
  Layers,
} from "lucide-react";
import { useTranslations } from "next-intl";

const reasons = [
  ["manualTitle", "manualDescription", ShieldAlert],
  ["bookingTitle", "bookingDescription", Zap],
  ["playerTitle", "playerDescription", HeartHandshake],
  ["financeTitle", "financeDescription", TrendingUp],
  ["centralTitle", "centralDescription", Layers],
] as const;

export default function WhyTurfTrackSection() {
  const t = useTranslations("marketing.why");
  return (
    <section className="py-20 md:py-28 bg-white border-y border-slate-200/80">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(([titleKey, descriptionKey, Icon]) => {
            return (
              <div
                key={titleKey}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 hover:border-slate-300 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                  {t(titleKey)}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t(descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
