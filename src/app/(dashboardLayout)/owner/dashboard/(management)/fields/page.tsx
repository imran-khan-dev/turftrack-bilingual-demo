import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Suspense } from "react";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import { getAllFields } from "@/services/fields/getAllFields";
import FieldsManagementHeader from "@/components/modules/Dashboard/DashboardShared/Management/Fields/FieldsManagementHeader";
import FieldsTable from "@/components/modules/Dashboard/DashboardShared/Management/Fields/FieldsTable";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("owner.metadata");
  return {
    title: t("fieldsTitle"),
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

export default async function OwnerFieldsManagementPage({
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

  const businesses = getAccessibleBusinesses(result.user);

  const searchParamsObj = await searchParams;

  const fieldsResult = await getAllFields(searchParamsObj);

  const fieldsData = fieldsResult?.data;

  const totalPages = Math.ceil(
    (fieldsData?.meta?.total || 1) / (fieldsData?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <FieldsManagementHeader businesses={businesses} ownerView />

      <FiltersToolbar
        businesses={businesses}
        showDateRange={true}
        showSearchFilters={false}
        showClearFilters={true}
        showRefresh={true}
      />

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <FieldsTable fields={fieldsData || []} />
        <TablePagination
          currentPage={fieldsData?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
