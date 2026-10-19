import PerformanceDashboard from "@/components/modules/Dashboard/DashboardShared/BusinessPerformance/PerformanceDashboard";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getAllBusinesses } from "@/services/business/getAllBusinesses";
import { Business } from "@/types/business";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getTranslations("finance");
  return {
    title: t("superAdminPerformanceMetadataTitle"),
    description: t("superAdminPerformanceMetadataDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function SuperAdminBusinessPerformancePage({
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
    `/finance/business-performance${queryString ? `?${queryString}` : ""}`,
  );

  if (!response.ok) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
          {t("performanceError")}
        </div>
      </div>
    );
  }

  const businessesTrimmed = {
    data: businesses.data.data.map((business: Business) => ({
      id: business.id,
      name: business.name,
    })),
  };

  const businessPerformance = await response.json();

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("performanceTitle")}
        description={t("performanceDescription")}
      />

      <FiltersToolbar
        businesses={businessesTrimmed.data}
        businessPlaceholder={financeT("selectBusiness")}
        showBusinessFilter={true}
        showSearchFilters={false}
      />

      <PerformanceDashboard data={businessPerformance.data} />
    </div>
  );
}
