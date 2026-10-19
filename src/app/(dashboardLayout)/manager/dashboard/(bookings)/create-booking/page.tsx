import CreateManualBooking from "@/components/modules/Dashboard/DashboardShared/Bookings/CreateManualBooking/CreateManualBooking";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("manager.metadata"); return { title: t("createBookingTitle"), description: t("createBookingDescription"), robots: { index: false, follow: false } }; }

export default async function ManagerManualBookingPage() {
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "MANAGER"
  )
    return redirect("/login");

  return (
    <div className="space-y-8">
      <CreateManualBooking user={result.user} managerView />
    </div>
  );
}
