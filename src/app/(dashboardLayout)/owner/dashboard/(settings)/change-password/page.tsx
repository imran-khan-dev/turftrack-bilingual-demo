import ChangePasswordSection from "@/components/modules/Dashboard/DashboardShared/Profile/ChangePasswordSection";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { getTranslations } from "@/i18n/server";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: t("changePasswordPageTitle"),
    description: t("changePasswordPageDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function OwnerChangePasswordPage() {
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "OWNER"
  )
    return redirect("/login");

  return (
    <div className="space-y-8">
      <ChangePasswordSection />
    </div>
  );
}
