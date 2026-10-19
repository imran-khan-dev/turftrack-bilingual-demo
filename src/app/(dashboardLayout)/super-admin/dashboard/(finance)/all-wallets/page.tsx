import WalletsTable from "@/components/modules/Dashboard/SuperAdmin/AllWallets/WalletsTable";
import FiltersToolbar from "@/components/shared/FiltersToolbar";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import TablePagination from "@/components/shared/TablePagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getAllBusinesses } from "@/services/business/getAllBusinesses";
import { getAllWallets } from "@/services/finance/getAllWallets";
import { Business } from "@/types/business";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("admin.wallets");
  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function AllWalletsPage({
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

  const businesses = await getAllBusinesses();

  const businessesData = businesses?.data?.data.map((b: Business) => {
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
    };
  });

  const searchParamsObj = await searchParams;

  const wallets = await getAllWallets(searchParamsObj);
  const walletsData = wallets?.data;
  const t = await getTranslations("admin.wallets");

  const totalPages = Math.ceil(
    (walletsData?.meta?.total || 1) / (walletsData?.meta?.limit || 1),
  );

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title={t("title")}
        description={t("description")}
      />

      {/* Instructions */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">
                {t("eligibleWithdrawal")}
              </span>{" "}— {t("eligibleWithdrawalHelp")}
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">
                {t("availableWithdrawal")}
              </span>{" "}
              — {t("availableWithdrawalHelp")}
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">{t("difference")}</span>{" "}
              {t("differenceHelp")}
            </p>
          </div>
        </div>
      </div>

      <FiltersToolbar
        showDateRange={false}
        businesses={businessesData}
        showBusinessFilter={true}
        businessPlaceholder={t("businessFilterPlaceholder")}
        showSearchFilters={false}
        showUserFilters={false}
        showClearFilters={true}
      />

      <Suspense fallback={<TableSkeleton columns={9} rows={10} />}>
        <WalletsTable wallets={walletsData.data || []} />

        <TablePagination
          currentPage={walletsData?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
}
