import { SearchX } from "lucide-react";
import "@/app/global.css";
import { Metadata } from "next";
import NotFoundButtons from "@/components/shared/NotFoundButtons";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `404 | Turf Track`,
    description: `404 Page not found.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <div className="min-h-screen w-full bg-slate-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-center flex flex-col items-center">
        {/* Accent Icon Badge */}
        <div className="h-14 w-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-4 shadow-xs">
          <SearchX className="w-7 h-7 stroke-[1.75]" />
        </div>

        {/* 404 Status Pill */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 border border-rose-200/80 mb-3">
          {t("error.404")}
        </span>

        {/* Heading & Subtext */}
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {t("page.not.found")}
        </h1>
        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-xs">
          {t("resource.unavailable")}
        </p>

        {/* Action Buttons */}
        <NotFoundButtons />
      </div>
    </div>
  );
}
