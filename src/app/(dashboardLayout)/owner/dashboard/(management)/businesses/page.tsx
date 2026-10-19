import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAllBusinesses } from "@/services/business/getAllBusinesses";
import { Suspense } from "react";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import BusinessTable from "@/components/modules/Dashboard/DashboardShared/Management/Business/BusinessTable";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("owner.metadata");
  return {
    title: t("businessesTitle"),
    description: ``,
    openGraph: {
      images: [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function BusinessManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations("owner.management");
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "OWNER"
  )
    return redirect("/login");

  const searchParamsObj = await searchParams;

  const response = await getAllBusinesses(searchParamsObj);

  const businesses = response?.data;

  const totalPages = Math.ceil(
    (businesses?.meta?.total || 1) / (businesses?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("businessesTitle")}
        description={t("businessesDescription")}
      />

      <Suspense fallback={<TableSkeleton columns={7} rows={10} />}>
        <BusinessTable businesses={businesses?.data || []} role="OWNER" />
        <TablePagination
          currentPage={businesses?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
