"use client";

import { cn } from "@/lib/utils";
import { Wallet, TrendingUp, ArrowDownToLine } from "lucide-react";
import ManagementTable from "@/components/shared/ManagementTable";
import { getPayoutHistoryColumns } from "./payoutHistoryColumns";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import TablePagination from "@/components/shared/TablePagination";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

interface Payout {
  id: string;
  walletId: string;
  amount: string | number;
  status: "SUCCESS" | "PENDING" | "FAILED" | string;
  note?: string | null;
  processedBy?: string | null;
  reference?: string | null;
  createdAt: string;
  paidAt?: string | null;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

interface PayoutHistoryData {
  meta?: PaginationMeta;
  dateRange?: { from: string; to: string };
  payoutHistory: Payout[];
  totalPayoutInRange: number;
  totalPaid: number;
  totalAvailable: number;
}

interface PayoutHistoryProps {
  data: PayoutHistoryData;
}

const formatCurrency = (amount: string | number) =>
  `৳${Number(amount).toLocaleString("en-BD")}`;

function StatCard({
  icon,
  label,
  value,
  valueClassName = "text-slate-900",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={cn("text-xl font-bold", valueClassName)}>{value}</p>
    </div>
  );
}

export default function PayoutHistory({ data }: PayoutHistoryProps) {
  const t = useTranslations("owner.finance");
  const { payoutHistory, totalPayoutInRange, totalPaid, totalAvailable } = data;

  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(
    (data?.meta?.total || 1) / (data?.meta?.limit || 1),
  );

  return (
    <div className="w-full space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<TrendingUp size={14} className="text-blue-500" />}
          label={t("totalPayoutInRange")}
          value={formatCurrency(totalPayoutInRange)}
        />
        <StatCard
          icon={<ArrowDownToLine size={14} className="text-emerald-500" />}
          label={t("totalPaid")}
          value={formatCurrency(totalPaid)}
          valueClassName="text-emerald-600"
        />
        <StatCard
          icon={<Wallet size={14} className="text-slate-400" />}
          label={t("totalAvailable")}
          value={formatCurrency(totalAvailable)}
        />
      </div>

      {/* Payout History List */}
      <div>
        {payoutHistory.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs font-medium text-slate-400">
              {t("noPayoutsRange")}
            </p>
          </div>
        ) : (
          <>
            <Suspense fallback={<TableSkeleton columns={6} rows={10} />}>
              <ManagementTable
                data={payoutHistory}
                columns={getPayoutHistoryColumns(t)}
                getRowKey={(data) => data.id}
                isRefreshing={isPending}
                isBookings={false}
              />
              <TablePagination
                currentPage={data?.meta?.page || 1}
                totalPages={totalPages || 1}
              />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
