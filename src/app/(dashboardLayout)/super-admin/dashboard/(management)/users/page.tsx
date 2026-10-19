/* eslint-disable @typescript-eslint/no-explicit-any */
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Suspense } from "react";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import { getUsers } from "@/services/user/getUsers";
import UsersTable from "@/components/modules/Dashboard/DashboardShared/Users/UsersTable";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.usersManagement");
  return {
    title: t("metadataTitle"),
    description: "",
    openGraph: {
      images: [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SuperAdminUsersManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const result = await getUserInfo();

 if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "SUPER_ADMIN"
  )
    return redirect("/login");

  const searchParamsObj = await searchParams;

  const users = await getUsers(searchParamsObj);

  const usersData = users?.data?.data;

  const totalPages = Math.ceil(
    (users.data?.meta?.total || 1) / (users.data?.meta?.limit || 1),
  );

  const t = await getTranslations("admin.usersManagement");

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("title")}
        description={t("description")}
      />

      <FiltersToolbar
        showDateRange={false}
        showUserFilters={true}
        showClearFilters={true}
        showRefresh={true}
      />

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <UsersTable users={usersData || []} />

        <TablePagination
          currentPage={usersData?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
