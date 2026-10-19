import PromoDiscountsTable from "@/components/modules/Dashboard/DashboardShared/Discounts/ManagePromoDiscounts/PromoDiscountsTable";
import PromoManagementHeader from "@/components/modules/Dashboard/DashboardShared/Discounts/ManagePromoDiscounts/PromoManagementHeader";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getTranslations("owner.metadata");
  return { title: t("promosTitle"), description: t("promosDescription"), robots: { index: false, follow: false } };
}

export default async function PromoDiscountsPage({
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

  const t = await getTranslations("owner.promo");

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

  const response = await serverFetch.get(
    `/discount/promo-codes${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok)
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
          {t("loadFailed")}
        </div>
      </div>
    );
  const promoCodes = await response.json();

  return (
    <div className="space-y-6">
      <PromoManagementHeader />
      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <PromoDiscountsTable promoCodes={promoCodes.data.data || []} />
        <TablePagination
          currentPage={promoCodes?.meta?.page || 1}
          totalPages={promoCodes?.meta?.total || 1}
        />
      </Suspense>
    </div>
  );
}
