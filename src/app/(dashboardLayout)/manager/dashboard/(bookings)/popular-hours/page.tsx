import PopularHours from "@/components/modules/Dashboard/DashboardShared/Bookings/PopularHours";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("manager.metadata"); return { title: t("popularHoursTitle"), description: t("popularHoursDescription"), robots: { index: false, follow: false } }; }

export default async function ManagerBookingPopularHoursPage() {
  const result = await getUserInfo();


  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "MANAGER"
  )
    return redirect("/login");

  const businesses = getAccessibleBusinesses(result.user);

  return (
    <div className="space-y-8">
      <PopularHours businesses={businesses} managerView />
    </div>
  );
}
