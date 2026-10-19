import ViewProfileAndUpdate from "@/components/modules/Dashboard/DashboardShared/Profile/ViewProfileAndUpdate";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.profile");
  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function SuperAdminMyProfilePage() {
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "SUPER_ADMIN"
  )
    return redirect("/login");

  return (
    <div className="space-y-8">
      <ViewProfileAndUpdate />
    </div>
  );
}
