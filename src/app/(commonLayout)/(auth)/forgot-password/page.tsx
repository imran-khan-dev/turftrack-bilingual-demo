import ForgotPasswordForm from "@/components/modules/ForgotPasswordForm";
import { Metadata } from "next";
import { getTranslations } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
  title: t("forgotPasswordPageTitle"),
  description: t("forgotPasswordPageDescription"),
  robots: {
    index: true,
    follow: true,
  },
  };
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50/50 flex items-center justify-center p-4">
      <ForgotPasswordForm />
    </div>
  );
}
