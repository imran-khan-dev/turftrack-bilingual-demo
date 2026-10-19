import { Building2, Globe2, Share2, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";

const steps = [Building2, Globe2, Share2, LayoutDashboard];

export default function HowItWorksSection() {
  const t = useTranslations("marketing.how");
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white scroll-mt-20">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((Icon, index) => {
            const step = index + 1;
            return (
              <div
                key={step}
                className="relative bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-emerald-600 transition-colors">
                      {String(step).padStart(2, "0")}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {t(`step${step}Title`)}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t(`step${step}Description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
