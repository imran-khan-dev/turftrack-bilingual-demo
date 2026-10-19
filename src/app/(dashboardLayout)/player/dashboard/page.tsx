import PlayerDashboardOverview from "@/components/modules/Dashboard/Player/PlayerDashboardOverview";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("player");
  return { title: t("dashboardTitle"), description: t("dashboardDescription"), robots: { index: false, follow: false } };
}

export default async function PlayerDashboardPage() {
  const result = await getUserInfo();
  
  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "PLAYER"
  )
    return redirect("/login");

  return (
    <div>
      <PlayerDashboardOverview />
    </div>
  );
}
