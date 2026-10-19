import LoginForm from "@/components/modules/LoginForm";
import { Metadata } from "next";
import { getTranslations } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: t("loginPageTitle"),
    description: t("loginPageDescription"),
    robots: { index: true, follow: true },
  };
}

const LoginPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const t = await getTranslations("auth");
  const params = (await searchParams) || {};

  return (
    <div className="min-h-screen w-full bg-slate-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="space-y-1.5 text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t("welcome.back")}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t("enter.your.credentials.to.access.your.turf.track.account")}
          </p>
        </div>

        {/* Form */}
        <LoginForm redirect={params.redirect} />
      </div>
    </div>
  );
};

export default LoginPage;
