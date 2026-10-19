import FinalizeBookings from "@/components/modules/Dashboard/DashboardShared/Bookings/FinalizeBookings/FinalizeBookings";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("owner.metadata"); return { title: t("finalizeTitle"), description: t("bookingDescription"), robots: { index: false, follow: false } }; }

export default async function OwnerFinalizeBookingsPage() {
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "OWNER"
  )
    return redirect("/login");

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <FinalizeBookings ownerView />
      </div>
    </div>
  );
}
