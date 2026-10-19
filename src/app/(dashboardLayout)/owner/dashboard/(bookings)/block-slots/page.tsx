import BlockedSlotsManagement from "@/components/modules/Dashboard/DashboardShared/Bookings/BlockSlots/BlockedSlotManagement";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> { const t = await getTranslations("owner.metadata"); return { title: t("blockSlotsTitle"), description: t("bookingDescription"), robots: { index: false, follow: false } }; }

export default async function OwnerBlockedSlotsPage() {
  const result = await getUserInfo();

    if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "OWNER"
  )
    return redirect("/login");

  return (
    <div className="space-y-8">
      <BlockedSlotsManagement user={result.user} ownerView />
    </div>
  );
}
