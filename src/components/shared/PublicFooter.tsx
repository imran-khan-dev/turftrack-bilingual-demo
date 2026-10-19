import Link from "next/link";
import { getTranslations } from "@/i18n/server";

export default async function PublicFooter() {
  const t = await getTranslations("common");
  const nav = await getTranslations("navigation");
  const marketing = await getTranslations("marketing.footer");
  return (
    <footer className="border-t border-slate-200 bg-white dark:bg-slate-950 dark:border-slate-800">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight">
              Turf Track
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {marketing("description")}
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {t("product")}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {t("how.it.works")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {t("features")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {t("pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {nav("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div className="space-y-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {marketing("businesses")}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link
                  href="/business/onboard"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {marketing("onboard")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {t("contact")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              House 5, Level 5 <br />
              Road 21, Gulshan 1, Dhaka 1212
              <br />
              <a
                href="mailto:contact@turftrack.pro"
                className="text-slate-700 dark:text-slate-300 font-medium hover:text-emerald-600 transition-colors mt-1 inline-block"
              >
                contact@turftrack.pro
              </a>
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 border-t border-slate-100 dark:border-slate-800 pt-6 text-center md:flex md:items-center md:justify-between text-xs text-slate-500 dark:text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {t("turf.track.all.rights.reserved")}
          </p>
          <div className="mt-2 md:mt-0 flex justify-center space-x-6">
            <Link
              href="/privacy-policy"
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              {nav("privacyPolicy")}
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              {nav("termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
