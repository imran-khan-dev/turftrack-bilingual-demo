import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Building2,
  Zap,
  DollarSign,
  Smartphone,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function AboutSection() {
  const t = useTranslations("marketing.about");
  return (
    <section
      id="about"
      className="py-16 sm:py-24 bg-slate-50/50 border-t border-b border-slate-200/80"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
        {/* --- HEADER --- */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200/80 text-xs font-semibold text-green-700 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            {t("badge")}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("title")}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* --- 3-COLUMN FEATURE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t("lowCostTitle")}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t("lowCostDescription")}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t("fastTitle")}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t("fastDescription")}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t("publicPageTitle")}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t("publicPageDescription")}
            </p>
          </div>
        </div>

        {/* --- HIGHLIGHT BANNER --- */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-slate-900">
                {t("authorityTitle")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t("authorityDescription")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>{t("noDoubleBookings")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>{t("smsUpdates")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>{t("refundPolicy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                <span>{t("instantSetup")}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <Link
              href="/business/onboard"
              className="w-full sm:w-auto h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {t("cta")}
              <ArrowRight className="w-4 h-4 text-green-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
