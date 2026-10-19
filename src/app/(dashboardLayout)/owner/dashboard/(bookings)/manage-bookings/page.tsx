/* eslint-disable @typescript-eslint/no-explicit-any */
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Suspense } from "react";
import { getBookings } from "@/services/booking/getBookings";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import BookingsFilter from "@/components/modules/Dashboard/DashboardShared/Bookings/ManageBookings/BookingsFilter";
import BookingsTable from "@/components/modules/Dashboard/DashboardShared/Bookings/ManageBookings/BookingsTable";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("owner.metadata");
  return {
    title: t("bookingsTitle"),
    description: t("bookingDescription"),
    openGraph: {
      images: [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function OwnerBookingsManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "OWNER"
  )
    return redirect("/login");

  const fields = result.user.businesses.flatMap((b: any) =>
    b.fields.map((f: any) => ({
      id: f.id,
      name: f.name,
    })),
  );

  const businesses = getAccessibleBusinesses(result.user);

  const searchParamsObj = await searchParams;

  const bookingsResult = await getBookings(searchParamsObj);

  const bookingsData = bookingsResult?.data;
  const t = await getTranslations("booking.pages");

  const totalPages = Math.ceil(
    (bookingsData?.meta?.total || 1) / (bookingsData?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("bookingsTitle")}
        description={t("bookingsDescription")}
      />

      {/* Search, Filters */}
      <BookingsFilter
        role={result.user.role}
        businesses={businesses}
        fields={fields}
      />

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <BookingsTable bookings={bookingsResult?.data?.formattedData || []} ownerView />
        <TablePagination
          currentPage={bookingsData?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
