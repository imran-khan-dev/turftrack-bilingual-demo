import Image from "next/image";
import { useTranslations } from "next-intl";

const steps = ["step1", "step2", "step3", "step4", "step5"] as const;

export default function BookingExperienceSection() {
  const t = useTranslations("marketing.bookingExperience");
  return (
    <section className="py-20 md:py-28 bg-white">
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

        {/* Visual Workflow Steps Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-12">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="h-4 w-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                {t(step)}
              </span>
              {idx < steps.length - 1 && (
                <span className="hidden sm:inline text-slate-300 font-bold">
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Product Visual Container */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 shadow-sm">
          <div className="relative aspect-[1908/2114] w-full overflow-hidden rounded-xl bg-white border border-slate-200">
            <Image
              src="/booking-page-fresh.png"
              alt={t("imageAlt")}
              width={1908}
              height={2114}
              unoptimized
              className="h-auto w-full"
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
