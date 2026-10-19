/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { Column } from "@/components/shared/ManagementTable";
import { cn } from "@/lib/utils";

export interface PromoCodeData {
  id: string;
  code: string;
  discountType: "FLAT" | "PERCENT";
  discountValue: number;
  scope: "FIELD" | "BUSINESS" | string;
  businessId: string;
  fieldId: string | null;
  validFrom: string;
  validUntil: string;
  maxUsage: number;
  maxUsagePerUser: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  business?: {
    name: string;
    slug: string;
  };
}

export const getDiscountsColumns = (t?: (key: string) => string): Column<PromoCodeData | any>[] => [
  {
    header: t?.("promoCode") || "Promo Code",
    accessor: "code",
    sortKey: "code",
    className:
      "font-mono font-bold text-slate-900 tracking-wider uppercase text-sm",
  },
  {
    header: t?.("valueType") || "Value / Type",
    accessor: (promo) => {
      const isFlat = promo.discountType === "FLAT";
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-900 text-sm">
            {isFlat ? `৳${promo.discountValue}` : `${promo.discountValue}%`}
          </span>
          <span className="text-muted-foreground text-[10px] uppercase tracking-wide font-medium">
            {t?.(promo.discountType === "FLAT" ? "flat" : "percent") || promo.discountType} {t?.("discountSuffix") || "Discount"}
          </span>
        </div>
      );
    },
    sortKey: "discountValue",
  },
  {
    header: t?.("scope") || "Scope",
    accessor: (promo) => (
      <div className="flex flex-col gap-0.5">
        <span
          className={cn(
            "inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium uppercase tracking-wide text-[10px] border",
            promo.scope === "FIELD"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : "bg-indigo-50 text-indigo-700 border-indigo-200",
          )}
        >
          {t?.(promo.scope === "FIELD" ? "field" : "business") || promo.scope}
        </span>
      </div>
    ),
    sortKey: "scope",
  },
  {
    header: t?.("usageLimits") || "Usage Limits",
    accessor: (promo) => (
      <div className="flex flex-col text-xs gap-0.5">
        <span className="text-slate-600">
          {t?.("maxAllocation") || "Max Allocation"}:{" "}
          <strong className="text-slate-900">{promo.maxUsage}</strong>
        </span>
        <span className="text-muted-foreground text-[11px]">
          {t?.("perCustomerLimit") || "Per Customer Limit"}: {promo.maxUsagePerUser}
        </span>
      </div>
    ),
  },
  {
    header: t?.("validity") || "Validity Window",
    accessor: (promo) => {
      const formatDate = (isoString: string) => {
        try {
          return new Date(isoString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        } catch {
          return t?.("notAvailable") || "N/A";
        }
      };

      const isExpired = new Date(promo.validUntil) < new Date();

      return (
        <div className="flex flex-col text-xs gap-0.5">
          <span className="text-slate-700 font-medium">
            {formatDate(promo.validFrom)} — {formatDate(promo.validUntil)}
          </span>
          {isExpired && (
            <span className="text-rose-600 font-semibold text-[10px] uppercase tracking-wide">
              {t?.("expired") || "Expired"}
            </span>
          )}
        </div>
      );
    },
    sortKey: "validUntil",
  },
  {
    header: t?.("status") || "Status",
    sortKey: "isActive",
    accessor: (promo) => {
      const active = promo.isActive;
      const isExpired = new Date(promo.validUntil) < new Date();
      const visuallyActive = active && !isExpired;

      return (
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "inline-flex w-max items-center rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide text-[10px] select-none border",
              visuallyActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-500 border-slate-200",
            )}
          >
            {visuallyActive
              ? t?.("active") || "Active"
              : active
                ? t?.("pausedExpired") || "Paused / Expired"
                : t?.("disabled") || "Disabled"}
          </span>
        </div>
      );
    },
  },
  {
    header: t?.("createdOn") || "Created On",
    accessor: (promo) => <DateCell date={promo.createdAt} />,
    sortKey: "createdAt",
  },
];
