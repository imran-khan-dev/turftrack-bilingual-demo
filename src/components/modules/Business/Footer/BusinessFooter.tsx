import { ShieldCheck, House } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BusinessFooter({ businessInfo }: any) {
  const t = useTranslations("booking");
  const commonT = useTranslations("common");
  return (
    <footer className="py-10 border-t border-slate-200 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* LEFT / INFO SECTION */}
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 transition-colors hover:text-primary hover-underline"
            >
              <House size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {commonT("app.home")}
              </span>
            </Link>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {t("verifiedMerchant")}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 hidden md:block" />
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              {t("footerCopyright", { year: new Date().getFullYear(), businessName: businessInfo.name })}
            </p>
          </div>

          {/* RIGHT / LEGAL LINKS */}
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">
            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-primary hover:underline"
            >
              {commonT("termsOfService")}
            </Link>
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-primary hover:underline"
            >
              {commonT("privacyPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
