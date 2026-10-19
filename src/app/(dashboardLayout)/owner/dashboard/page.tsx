import BusinessDashboardOverview from "@/components/modules/Dashboard/DashboardShared/Overview/BusinessDashboardOverview";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("owner.metadata");
  return {
  title: t("dashboardTitle"),
  description: t("dashboardDescription"),
  robots: {
    index: false,
    follow: false,
  },
  };
}

export default async function OwnerDashboardPage() {
  const result = await getUserInfo();

  if (!result) {
    const t = await getTranslations("owner.dashboard");
    return <div>{t("connectionError")}</div>;
  }

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "OWNER"
  )
    return redirect("/login");

  const businesses = getAccessibleBusinesses(result.user);

  return (
    <div className="space-y-8">
      <BusinessDashboardOverview role="OWNER" businesses={businesses} ownerView />
    </div>
  );
}
