import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Suspense } from "react";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import ManagersManagementHeader from "@/components/modules/Dashboard/Owner/Management/Managers/ManagersManagementHeader";
import ManagersTable from "@/components/modules/Dashboard/Owner/Management/Managers/ManagersTable";
import { getStaffs } from "@/services/staff/getStaffs";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("owner.metadata");
  return {
    title: t("managersTitle"),
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

export default async function ManagersManagementPage({
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

  const staffsResult = await getStaffs(searchParamsObj);

  const managersData = staffsResult?.data;

  const totalPages = Math.ceil(
    (managersData?.meta?.total || 1) / (managersData?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <ManagersManagementHeader ownerView />

      <FiltersToolbar
        businesses={businesses}
        showDateRange={false}
        showSearchFilters={false}
        showClearFilters={true}
        showRefresh={true}
      />

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <ManagersTable managers={managersData.data || []} ownerView />
        <TablePagination
          currentPage={managersData?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
