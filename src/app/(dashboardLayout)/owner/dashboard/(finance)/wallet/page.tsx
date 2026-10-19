import MyWallet from "@/components/modules/Dashboard/Owner/MyWallet/MyWallet";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { serverFetch } from "@/lib/server-fetch";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import { redirect } from "next/navigation";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata() {
  const t = await getTranslations("wallet");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function OwnerWalletPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const t = await getTranslations("wallet");
  const result = await getUserInfo();

  if (
    result.status === "error" ||
    result.status === "unauthenticated" ||
    result.user.role !== "OWNER"
  )
    return redirect("/login");

  const businesses = getAccessibleBusinesses(result.user);

  const searchParamsObj = await searchParams;

  const businessId = searchParamsObj.businessId;

  const endpoint = businessId
    ? `/finance/${businessId}/my-wallet`
    : `/finance/${businesses[0].id}/my-wallet`;

  const response = await serverFetch.get(endpoint);

  if (!response.ok) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-sm">
          {t("loadFailed")}
        </div>
      </div>
    );
  }

  const myWallet = await response.json();
  const paymentMethod = process.env.PAYMENT_METHOD;

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("pageHeading")}
        description={t("pageDescription")}
      />
      <MyWallet
        data={myWallet.data}
        businesses={businesses}
        selectedBusinessId={businessId}
        paymentMethod={paymentMethod}
      />
    </div>
  );
}
