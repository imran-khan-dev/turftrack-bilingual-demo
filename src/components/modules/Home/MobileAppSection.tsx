"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openExternalLink } from "@/utils/openExternalLink";
import { useTranslations } from "next-intl";

export default function MobileAppSection() {
  const t = useTranslations("marketing.mobile");
  return (
    <section className="py-20 md:py-28 bg-slate-950 text-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {t("badge")}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t("title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t("description")}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              {/* <Button
                variant="outline"
                className="h-11 px-5 border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold gap-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                {t("android")}
              </Button> */}

              <Button
                variant="outline"
                onClick={() =>
                  openExternalLink(
                    "https://drive.google.com/file/d/1avakqYc4DZStCjYz0yrgNyQrdpRqhQ7j/view?usp=sharing",
                  )
                }
                className="h-11 px-5 border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold gap-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Android APK
              </Button>
              <Button
                variant="outline"
                className="h-11 px-5 border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl text-xs font-semibold gap-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                {t("appStore")}
              </Button>
            </div>
          </div>

          {/* Phone Mockup Visual */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-64 sm:w-72 aspect-[9/18] rounded-[2.5rem] border-4 border-slate-800 bg-slate-900 p-2 shadow-2xl shadow-emerald-950/40">
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-slate-950">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <source src="/mobile-view.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
