/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { Column } from "@/components/shared/ManagementTable";
import { cn } from "@/lib/utils";

export interface StatementEntry {
  date: string;
  bookingId: string;
  description: string;
  referenceId?: string | number;
  type: "CHARGE" | "PAYMENT" | string;
  amount: number;
  note?: string;
  runningBalance: number;
  status: "CREDIT" | "DUE" | string;
}

const formatCurrency = (amount: number) =>
  `৳${Number(amount).toLocaleString("en-BD")}`;

export const getBusinessStatementColumns = (t?: (key: string, values?: { reference?: string | number }) => string): Column<StatementEntry | any>[] => [
  {
    header: t?.("date") || "Date",
    accessor: (entry) => <DateCell date={entry.date} />,
    sortKey: "date",
  },
  {
    header: t?.("description") || "Description",
    accessor: (entry) => (
      <div className="flex flex-col max-w-xs">
        <span className="text-sm font-medium text-slate-900 truncate">
          {entry.description}
        </span>
        {entry.type === "CHARGE" && entry.referenceId && (
          <span className="text-muted-foreground text-[11px]">
            {t?.("booking", { reference: entry.referenceId }) || `Booking #${entry.referenceId}`}
          </span>
        )}
        {entry.note && (
          <span className="text-muted-foreground text-[11px] italic truncate mt-0.5">
            {entry.note}
          </span>
        )}
      </div>
    ),
  },
  {
    header: t?.("type") || "Type",
    sortKey: "type",
    accessor: (entry) => {
      const type = entry.type;

      if (type === "PAYMENT") {
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide text-[10px]">
              {t?.("payment") || "Payment"}
            </span>
          </div>
        );
      }

      if (type === "CHARGE") {
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide text-[10px]">
              {t?.("charge") || "Charge"}
            </span>
          </div>
        );
      }

      // Default rendering block fallback
      return (
        <div className="flex flex-col gap-1">
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide text-[10px]">
            {type?.replace("_", " ")}
          </span>
        </div>
      );
    },
  },
  {
    header: t?.("amount") || "Amount",
    accessor: (entry) => (
      <span className="text-sm font-semibold text-slate-900">
        {formatCurrency(entry.amount)}
      </span>
    ),
    sortKey: "amount",
  },
  {
    header: t?.("balance") || "Running Balance",
    accessor: (entry) => (
      <span
        className={cn(
          "text-sm font-bold",
          entry.runningBalance < 0
            ? "text-emerald-600"
            : entry.runningBalance > 0
              ? "text-rose-600"
              : "text-slate-900",
        )}
      >
        {formatCurrency(entry.runningBalance)}
      </span>
    ),
    sortKey: "runningBalance",
  },
  {
    header: t?.("status") || "Status",
    sortKey: "status",
    accessor: (entry) => {
      const status = entry.status;

      if (status === "CREDIT") {
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide text-[10px]">
              {t?.("credit") || "Credit"}
            </span>
          </div>
        );
      }

      if (status === "DUE") {
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide text-[10px]">
              {t?.("due") || "Due"}
            </span>
          </div>
        );
      }

      // Default rendering block fallback
      return (
        <div className="flex flex-col gap-1">
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide text-[10px]">
            {status?.replace("_", " ")}
          </span>
        </div>
      );
    },
  },
];
