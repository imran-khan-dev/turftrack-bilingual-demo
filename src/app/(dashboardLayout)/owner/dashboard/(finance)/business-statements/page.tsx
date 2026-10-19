import BusinessStatementTable from "@/components/modules/Dashboard/Owner/BusinessStatement/BusinessStatementTable";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getTranslations("owner.metadata");
  return { title: t("businessStatementsTitle"), description: t("businessStatementsDescription"), robots: { index: false, follow: false } };
}

export default async function OwnerBusinessStatementPage({
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

  const searchParamsObj = await searchParams;
  const businesses = getAccessibleBusinesses(result.user);
  const t = await getTranslations("owner.finance");

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
    : `/finance/${businesses[0].id}/statement`;

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
        description={t("statementsDescription")}
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
