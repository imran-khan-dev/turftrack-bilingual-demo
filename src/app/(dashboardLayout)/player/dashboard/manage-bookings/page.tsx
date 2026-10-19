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
import { getTranslations } from "@/i18n/server";
import BookingsFilter from "@/components/modules/Dashboard/DashboardShared/Bookings/ManageBookings/BookingsFilter";
import BookingsTable from "@/components/modules/Dashboard/DashboardShared/Bookings/ManageBookings/BookingsTable";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("player");
  return {
    title: t("bookingsMetadataTitle"),
    description: t("manageBookingsDescription"),
    openGraph: {
      images: [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PlayerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations("player");
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "PLAYER"
  )
    return redirect("/login");

  const businesses = getAccessibleBusinesses(result.user);

  const fields = businesses.flatMap((b: any) =>
    b.fields.map((f: any) => ({
      id: f.id,
      name: f.name,
    })),
  );

  const searchParamsObj = await searchParams;

  const bookingsResult = await getBookings(searchParamsObj);

  const bookingsData = bookingsResult?.data;

  const totalPages = Math.ceil(
    (bookingsData?.meta?.total || 1) / (bookingsData?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("bookingsManagementTitle")}
        description={t("manageBookingsDescription")}
      />

      {/* Search, Filters */}
      <BookingsFilter
        businesses={businesses}
        fields={fields}
        role={result.user.role}
      />

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <BookingsTable bookings={bookingsResult?.data?.formattedData || []} playerView />
        <TablePagination
          currentPage={bookingsData?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
