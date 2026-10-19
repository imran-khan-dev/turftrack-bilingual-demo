import { cookies } from "next/headers";
import { getTranslations as getNextTranslations } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "./locales";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get("NEXT_LOCALE")?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getTranslations(namespace?: string) {
  return getNextTranslations({ locale: await getLocale(), namespace });
}

export { getMessages } from "next-intl/server";
