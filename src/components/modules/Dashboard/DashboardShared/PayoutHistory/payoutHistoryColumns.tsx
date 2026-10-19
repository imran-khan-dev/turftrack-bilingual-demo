/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { Column } from "@/components/shared/ManagementTable";

export interface PayoutHistoryData {
  id: string;
  walletId: string;
  amount: string | number;
  status: "SUCCESS" | "PENDING" | "FAILED" | string;
  note: string;
  processedBy: string;
  reference: string;
  createdAt: string;
  paidAt: string;
  feeCleared: { id: string; amount: number } | null;
}

export const getPayoutHistoryColumns = (t: (key: string) => string): Column<PayoutHistoryData | any>[] => [
  {
    header: t("payoutId"),
    accessor: (payout) => (
      <span className="font-mono text-xs font-semibold text-slate-700">
        #{payout.id ? payout.id.slice(0, 8) : "—"}
      </span>
    ),
    sortKey: "id",
  },
  {
    header: t("amount"),
    accessor: (payout) => {
      const parsedAmount =
        typeof payout.amount === "string"
          ? parseFloat(payout.amount)
          : payout.amount;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
      }).format(parsedAmount || 0);

      return (
        <span className="text-sm font-bold text-slate-900 tracking-tight">
          {formatted.replace("BDT", "৳")}
        </span>
      );
    },
    sortKey: "amount",
  },
  {
    header: t("referenceDetails"),
    accessor: (payout) => (
      <div className="flex flex-col text-xs gap-0.5">
        <span className="font-medium text-slate-900">
          {payout.reference || t("noReference")}
        </span>
        {payout.note && (
          <span className="text-muted-foreground text-[11px] font-mono">
          {t("note")}: {payout.note}
          </span>
        )}
      </div>
    ),
    sortKey: "reference",
  },
  {
    header: t("feeCleared"),
    accessor: (payout) => {
      if (!payout.feeCleared) {
        return <span className="text-[11px] text-slate-400">—</span>;
      }

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
        minimumFractionDigits: 0,
      })
        .format(payout.feeCleared.amount || 0)
        .replace("BDT", "৳");

      return (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 font-medium bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
          {formatted}
        </span>
      );
    },
  },
  {
    header: t("status"),
    sortKey: "status",
    accessor: (payout) => {
      const status = payout.status?.toUpperCase();

      if (status === "SUCCESS") {
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide text-[10px]">
            {t("success")}
          </span>
        );
      }

      if (status === "FAILED") {
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 font-medium bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide text-[10px]">
            {t("failed")}
          </span>
        );
      }

      if (status === "PENDING") {
        return (
          <span className="inline-flex items-center rounded-full px-2 py-0.5 font-medium bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide text-[10px]">
            {t("pending")}
          </span>
        );
      }

      return (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 font-medium bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide text-[10px]">
          {status?.replace("_", " ") || t("unknown")}
        </span>
      );
    },
  },
  {
    header: t("walletReference"),
    accessor: (payout) => (
      <span className="font-mono text-[11px] text-muted-foreground">
        {payout.walletId ? `...${payout.walletId.slice(-8)}` : "—"}
      </span>
    ),
  },
  {
    header: t("processedAt"),
    accessor: (payout) => {
      const dateTarget = payout.paidAt || payout.createdAt;
      if (!dateTarget)
        return <span className="text-muted-foreground text-xs">—</span>;

      return <DateCell date={dateTarget} />;
    },
    sortKey: "paidAt",
  },
];
