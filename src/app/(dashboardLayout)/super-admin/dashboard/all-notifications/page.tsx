import AllNotifications from "@/components/modules/Dashboard/DashboardShared/Notifications/AllNotifications";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("notifications");
  return { title: t("metadata.adminTitle"), description: t("description"), robots: { index: false, follow: false } };
}

export default async function AllNotificationsPage() {
  const t = await getTranslations("notifications");
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "SUPER_ADMIN"
  )
    return redirect("/login");

  return (
    <div className="space-y-8">
      <Suspense fallback={<div>{t("loadingPage")}</div>}>
        <AllNotifications />
      </Suspense>
    </div>
  );
}
