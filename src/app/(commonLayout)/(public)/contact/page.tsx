import Contact from "@/components/modules/Contact";
import { Metadata } from "next";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.contact");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description"), type: "website" },
    twitter: { card: "summary", title: t("title"), description: t("description") },
    robots: { index: true, follow: true },
  };
}

export default function ContactPage() {
  return <Contact />;
}
