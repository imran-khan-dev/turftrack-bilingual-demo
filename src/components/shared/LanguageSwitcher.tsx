"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { setLocale } from "@/i18n/actions";
import { locales, type Locale } from "@/i18n/locales";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();

  async function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    await setLocale(nextLocale);
    router.refresh();
  }

  return (
    <div role="group" aria-label={t("language")}>
      {locales.map((option) => (
        <button
          key={option}
          type="button"
          lang={option}
          aria-pressed={locale === option}
          onClick={() => void changeLocale(option)}
        >
          {option === "bn" ? "বাংলা" : "English"}
        </button>
      ))}
    </div>
  );
}
