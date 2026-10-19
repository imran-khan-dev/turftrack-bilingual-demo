import PayoutHistory from "@/components/modules/Dashboard/DashboardShared/PayoutHistory/PayoutHistory";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getTranslations("owner.metadata");
  return { title: t("payoutsTitle"), description: t("payoutsDescription"), robots: { index: false, follow: false } };
}

export default async function OwnerPayoutSummaryPage({
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
  const t = await getTranslations("owner.finance");

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
    `/finance/payout-summary${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
          {t("payoutError")}
        </div>
      </div>
    );
  }

  const payoutSummary = await response.json();

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("payoutTitle")}
        description={t("payoutDescription")}
      />

      <FiltersToolbar
        businesses={businesses}
        showBusinessFilter={true}
        showSearchFilters={false}
      />

      <PayoutHistory data={payoutSummary.data} />
    </div>
  );
}
