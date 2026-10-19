import PendingRefunds from "@/components/modules/Dashboard/DashboardShared/Bookings/PendingRefunds/PendingRefunds";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("owner.metadata"); return { title: t("refundsTitle"), description: t("bookingDescription"), robots: { index: false, follow: false } }; }

export default async function OwnerPendingRefundsPage() {
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "OWNER"
  )
    return redirect("/login");

  const businesses = getAccessibleBusinesses(result.user);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <PendingRefunds businesses={businesses} ownerView />
      </div>
    </div>
  );
}
