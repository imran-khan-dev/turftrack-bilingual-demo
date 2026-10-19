/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import PublicBookingLinks from "@/components/modules/Dashboard/DashboardShared/Bookings/PublicBookingLink";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("player");
  return {
    title: t("bookingLinkMetadataTitle"),
    description: t("bookingLinkDescription"),
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
  const t = await getTranslations("player");
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "PLAYER"
  )
    return redirect("/login");

  const businesses = getAccessibleBusinesses(result.user);

  const links = businesses.map((b: any) => ({
    businessName: b.name,
    slug: b.slug,
    url: `https://turftrack.pro/book/${b.slug}`,
  }));

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("bookingLinkTitle")}
        description={t("bookingLinkDescription")}
      />

      <PublicBookingLinks links={links} playerView />
    </div>
  );
}
