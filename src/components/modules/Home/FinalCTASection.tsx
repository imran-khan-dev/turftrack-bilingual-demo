import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function FinalCTASection() {
  const t = useTranslations("marketing.cta");
  return (
    <section className="py-20 md:py-28 bg-slate-950 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          {t("title")}
        </h2>
        <p className="mt-4 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          {t("description")}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto h-11 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wide rounded-xl shadow-lg shadow-emerald-950/40"
          >
            <Link
              href="/business/onboard"
              className="inline-flex items-center justify-center gap-2"
            >
              {t("primary")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white text-xs font-semibold rounded-xl"
          >
          <Link href="/contact">{t("contact")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
