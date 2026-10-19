import PerformanceDashboard from "@/components/modules/Dashboard/DashboardShared/BusinessPerformance/PerformanceDashboard";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getTranslations("owner.metadata");
  return { title: t("businessPerformanceTitle"), description: t("businessPerformanceDescription"), robots: { index: false, follow: false } };
}

export default async function OwnerBusinessPerformancePage({
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

  const businessPerformance = await response.json();

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("performanceTitle")}
        description={t("performanceDescription")}
      />

      <FiltersToolbar showBusinessFilter={false} />

      <PerformanceDashboard data={businessPerformance.data} />
    </div>
  );
}
