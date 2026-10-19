import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Suspense } from "react";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import { getUsers } from "@/services/user/getUsers";
import PlayersTable from "@/components/modules/Dashboard/DashboardShared/Management/Players/PlayersTable";
import PlayersManagementHeader from "@/components/modules/Dashboard/DashboardShared/Management/Players/PlayersManagementHeader";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("owner.metadata");
  return {
    title: t("playersTitle"),
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

export default async function OwnerPlayersManagementPage({
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

  const players = await getUsers(searchParamsObj);

  const playersData = players?.data;

  const totalPages = Math.ceil(
    (playersData?.meta?.total || 1) / (playersData?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <PlayersManagementHeader businesses={businesses} ownerView />

      <FiltersToolbar
        businesses={businesses}
        showDateRange={false}
        showBusinessFilter={true}
        showClearFilters={true}
        showRefresh={true}
      />

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <PlayersTable
          players={playersData.data || []}
          businesses={businesses}
          ownerView
        />

        <TablePagination
          currentPage={playersData?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
