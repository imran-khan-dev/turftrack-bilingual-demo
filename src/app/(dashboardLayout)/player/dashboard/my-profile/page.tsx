import ViewProfileAndUpdate from "@/components/modules/Dashboard/DashboardShared/Profile/ViewProfileAndUpdate";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("player");
  return { title: t("myProfileTitle"), description: t("myProfileDescription"), robots: { index: false, follow: false } };
}

export default async function PlayerMyProfilePage() {
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "PLAYER"
  )
    return redirect("/login");

  return (
    <div className="space-y-8">
      <ViewProfileAndUpdate playerView />
    </div>
  );
}
