import BusinessStatementTable from "@/components/modules/Dashboard/Owner/BusinessStatement/BusinessStatementTable";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getAllBusinesses } from "@/services/business/getAllBusinesses";
import { Business } from "@/types/business";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getTranslations("finance");
  return {
    title: t("superAdminStatementsMetadataTitle"),
    description: t("superAdminStatementsMetadataDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function SuperAdminBusinessStatementPage({
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

  const t = await getTranslations("owner.finance");
  const financeT = await getTranslations("finance");

  const businesses = await getAllBusinesses();

  const businessesTrimmed = {
    data: businesses.data.data.map((business: Business) => ({
      id: business.id,
      name: business.name,
    })),
  };

  const searchParamsObj = await searchParams;

  const searchParamsNew = new URLSearchParams();
  Object.entries(searchParamsObj).forEach(([key, value]) => {
    if (key === "page" && value === "1") return;
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== undefined && v !== null && v !== "") {
          searchParamsNew.append(key, v);
        }
      });
    } else {
      searchParamsNew.append(key, value);
    }
  });

  const queryString = searchParamsNew.toString();

  const rawBusinessId = searchParamsObj.businessId;
  const businessId = Array.isArray(rawBusinessId)
    ? rawBusinessId[0]
    : rawBusinessId;

  const endpoint = businessId
    ? `/finance/${businessId}/statement`
    : `/finance/${businessesTrimmed.data[0].id}/statement`;

  const response = await serverFetch.get(
    `${endpoint}${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
          {t("statementError")}
        </div>
      </div>
    );
  }

  const statement = await response.json();
  const totalPages = Math.ceil(
    (statement?.data?.meta?.total || 1) / (statement?.data?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("statementsTitle")}
        description={financeT("superAdminStatementsDescription")}
      />

      <FiltersToolbar
        businesses={businessesTrimmed.data}
        businessPlaceholder={financeT("selectBusiness")}
        showDateRange={true}
        showClearFilters={true}
        showRefresh={true}
      />
      <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
        <BusinessStatementTable data={statement?.data.statement || []} />
        <TablePagination
          currentPage={statement?.data?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
