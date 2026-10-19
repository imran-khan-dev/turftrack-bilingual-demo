"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("marketing.hero");
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-24 pb-16 md:pt-32 md:pb-24 text-white">
      {/* Background Subtle Radial Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>
              {t("badge")}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.15]">
            {t("titleStart")} {" "}
            <span className="text-emerald-400">{t("titleEnd")}</span>
          </h1>

          {/* Supporting Text */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed">
            {t("description")}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Button
              asChild
              className="w-full sm:w-auto h-11 px-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide rounded-xl shadow-lg shadow-emerald-900/20"
            >
              <Link
                href="/business/onboard"
                className="inline-flex items-center justify-center gap-2"
              >
                {t("primaryCta")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-semibold rounded-xl"
            >
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {t("secondaryCta")}
              </a>
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-8 flex items-center gap-6 text-[11px] font-medium text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t("noSetupFees")}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t("instantActivation")}
            </span>
          </div>
        </div>

        {/* Dashboard Mockup Hero Visual */}
        <div className="mt-12 md:mt-16 relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-2 sm:p-3 shadow-2xl shadow-emerald-950/20 backdrop-blur-md">
            <div className="relative aspect-[1898/888] w-full overflow-hidden rounded-xl bg-slate-900">
              <Image
                src="/dashboard-overview.png"
                alt={t("imageAlt")}
                fill
                priority
                unoptimized
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
