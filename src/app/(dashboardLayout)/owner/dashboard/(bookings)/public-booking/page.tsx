/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import PublicBookingLinks from "../../../../../../components/modules/Dashboard/DashboardShared/Bookings/PublicBookingLink";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("owner.metadata");
  return {
    title: t("publicBookingTitle"),
    description: t("publicBookingDescription"),
    openGraph: {
      images: [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PublicBookingPage() {
  const result = await getUserInfo();
  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "OWNER"
  )
    return redirect("/login");

  const businesses = getAccessibleBusinesses(result.user);
  const t = await getTranslations("booking.pages");

  if (businesses.length === 0) return redirect("/login");

  const links = businesses.map((b: any) => ({
    businessName: b.name,
    slug: b.slug,
    url: `https://turftrack.pro/book/${b.slug}`,
  }));

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("publicBookingTitle")}
        description={t("publicBookingDescription")}
      />

      <PublicBookingLinks links={links} ownerView />
    </div>
  );
}
