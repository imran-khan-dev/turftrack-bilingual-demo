"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function NotFoundButtons() {
  const t = useTranslations("common");
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 w-full">
      <Button
        asChild
        className="w-full sm:w-1/2 h-9 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide rounded-lg"
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5" />
          {t("app.home")}
        </Link>
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => window.history.back()}
        className="w-full sm:w-1/2 h-9 text-xs font-semibold text-slate-700 border-slate-200 rounded-lg hover:bg-slate-50 inline-flex items-center justify-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t("back.variant2")}
      </Button>
    </div>
  );
}
