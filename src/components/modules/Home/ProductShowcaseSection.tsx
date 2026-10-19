"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, X } from "lucide-react";
import { useTranslations } from "next-intl";

const benefits = ["benefit1", "benefit2", "benefit3", "benefit4"] as const;

export default function ProductShowcaseSection() {
  const t = useTranslations("marketing.showcase");
  const common = useTranslations("common");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <section className="py-20 md:py-28 bg-slate-50/50 border-y border-slate-200/80">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Context */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {t("badge")}
              </span>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight leading-tight">
                {t("title")}
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {t("description")}
              </p>

              <ul className="space-y-3 pt-2">
                {benefits.map((benefit) => (
                  <li
                  key={benefit}
                    className="flex items-center gap-2.5 text-xs font-medium text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    {t(benefit)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Visual */}
            <div className="lg:col-span-7">
              <div
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50 cursor-zoom-in transition-transform hover:scale-[1.01]"
                onClick={() => setIsPreviewOpen(true)}
              >
                <Image
                  src="/dashboard-overview.png"
                  alt={t("imageAlt")}
                  width={1898}
                  height={888}
                  quality={100}
                  priority
                  className="block h-auto w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Preview */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="relative max-h-[95vh] max-w-[95vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              aria-label={common("close")}
              className="absolute -right-2 -top-2 z-10 rounded-full bg-white p-2 shadow-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <Image
              src="/dashboard-overview.png"
              alt={t("imageAlt")}
              width={1898}
              height={888}
              quality={100}
              priority
              unoptimized
              className="max-h-[90vh] w-auto max-w-[90vw] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
