/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { Column } from "@/components/shared/ManagementTable";
import { cn } from "@/lib/utils";

export interface WalletData {
  walletId: string;
  businessId: string;
  business: {
    name: string;
    location: string;
  };
  balances: {
    eligibleWithdrawal: number;
    currentBalance: number;
    currentDebt: number;
    netEarningsFromOnlinePaid: number;
  };
  stats: {
    totalGrossOnlineRevenue: number;
    lifetimeFeesPaid: number;
    totalWithdrawn: number;
  };
  updatedAt: string;
}

export const getWalletColumns = (
  t: (key: string) => string,
  walletT: (key: string) => string,
): Column<WalletData | any>[] => [
  {
    header: t("businessTurf"),
    accessor: (wallet) => (
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-900">
          {wallet.business?.name || walletT("notAvailable")}
        </span>
        <span className="text-xs text-slate-500">
          {wallet.business?.location || walletT("notAvailable")}
        </span>
      </div>
    ),
    sortKey: "business.name",
  },
  {
    header: walletT("currentBalance"),
    accessor: (wallet) => (
      <span className="font-semibold text-emerald-600 text-sm">
        ৳{wallet.balances?.currentBalance ?? 0}
      </span>
    ),
    sortKey: "balances.currentBalance",
  },
  {
    header: walletT("currentDebtLabel"),
    accessor: (wallet) => {
      const debt = wallet.balances?.currentDebt ?? 0;
      const hasDebt = debt > 0;

      return (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-medium text-xs",
              hasDebt ? "text-rose-600 font-semibold" : "text-slate-500",
            )}
          >
            ৳{debt}
          </span>
          {hasDebt && (
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">
              {t("unsettled")}
            </span>
          )}
        </div>
      );
    },
    sortKey: "balances.currentDebt",
  },
  {
    header: t("eligibleWithdrawal"),
    accessor: (wallet) => (
      <span className="font-semibold text-emerald-600 text-sm">
        ৳{wallet.balances?.eligibleWithdrawal ?? 0}
      </span>
    ),
    sortKey: "balances.eligibleWithdrawal",
  },
  {
    header: t("grossRevenue"),
    accessor: (wallet) => (
      <span className="text-xs font-medium text-slate-900">
        ৳{wallet.stats?.totalGrossOnlineRevenue ?? 0}
      </span>
    ),
    sortKey: "stats.totalGrossOnlineRevenue",
  },
  {
    header: t("platformFeesLifetime"),
    accessor: (wallet) => (
      <span className="text-xs text-slate-500">
        ৳{wallet.stats?.lifetimeFeesPaid ?? 0}
      </span>
    ),
    sortKey: "stats.lifetimeFeesPaid",
  },
  {
    header: t("totalWithdrawnLifetime"),
    accessor: (wallet) => (
      <span className="text-xs text-slate-500">
        ৳{wallet.stats?.totalWithdrawn ?? 0}
      </span>
    ),
    sortKey: "stats.totalWithdrawn",
  },
  {
    header: t("lastUpdated"),
    accessor: (wallet) => <DateCell date={wallet.updatedAt} />,
    sortKey: "updatedAt",
  },
];
