/* eslint-disable @typescript-eslint/no-explicit-any */
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Suspense } from "react";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import RefundsTable from "@/components/modules/Dashboard/Player/Refunds/RefundsTable";
import RefundsFilter from "@/components/modules/Dashboard/Player/Refunds/RefundsFilter";
import { getRefundBookings } from "@/services/booking/getRefundBookings";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("player");
  return {
    title: t("refundsMetadataTitle"),
    description: t("refundsDescription"),
    openGraph: {
      images: [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

const ALLOWED_REFUND_FILTER_KEYS = [
  "page",
  "from",
  "to",
  "businessId",
  "fieldId",
  "limit",
  "isOverPaidRefunded",
] as const;

export default async function PlayerRefundsPage({
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

  // reject request if any param outside the allow list
  const incomingKeys = Object.keys(searchParamsObj);

  const hasForbiddenParam = incomingKeys.some(
    (key) => !ALLOWED_REFUND_FILTER_KEYS.includes(key as any),
  );

  if (hasForbiddenParam) {
    redirect("/player/dashboard/refunds");
  }

  const safeSearchParams: Record<string, string | string[] | undefined> = {};

  for (const key of ALLOWED_REFUND_FILTER_KEYS) {
    if (searchParamsObj[key] !== undefined) {
      safeSearchParams[key] = searchParamsObj[key];
    }
  }

  const refundsResult = await getRefundBookings(safeSearchParams);

  const refundsData = refundsResult?.data;

  const totalPages = Math.ceil(
    (refundsData?.meta?.total || 1) / (refundsData?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("refundsInformation")}
        description={t("refundsDescription")}
      />

      {/* Search, Filters */}
      <RefundsFilter businesses={businesses} fields={fields} />

      <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
        <RefundsTable bookings={refundsData?.formattedData || []} />
        <TablePagination
          currentPage={refundsData?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
