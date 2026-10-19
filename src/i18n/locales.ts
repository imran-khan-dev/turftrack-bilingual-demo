export const locales = ["bn", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}
