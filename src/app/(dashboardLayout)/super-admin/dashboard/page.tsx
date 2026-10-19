import { SuperAdminEarningsChart } from "@/components/modules/Dashboard/SuperAdmin/SuperAdminEarningsChart";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getPlatformEarnings } from "@/services/finance/getPlatformEarnings";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getTranslations("admin.dashboard");
  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function SuperAdminDashboardPage({
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

  const earnings = await getPlatformEarnings(searchParamsObj);

  return (
    <div className="space-y-8">
      <SuperAdminEarningsChart data={earnings.data} />
    </div>
  );
}
