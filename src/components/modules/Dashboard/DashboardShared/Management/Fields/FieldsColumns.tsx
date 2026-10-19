/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Column } from "@/components/shared/ManagementTable";
import { cn } from "@/lib/utils";
import { Landmark } from "lucide-react";

export interface BookingStats {
  totalInPeriod: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  forReview: number;
  noShow: number;
  refund: number;
}

export interface FieldData {
  id: string;
  fieldName: string;
  businessName: string;
  businessId: string;
  businessSlug: string;
  isActive: boolean; // Added isActive status field
  bookingStats: BookingStats;
  dateRange: {
    startDate?: string;
    endDate?: string;
  };
}

export const getFieldsColumns = (t: (key: string, values?: Record<string, number>) => string): Column<FieldData | any>[] => [
  {
    header: t("fieldArena"),
    accessor: "fieldName",
    sortKey: "fieldName",
    className: "font-semibold text-slate-900",
  },
  {
    header: t("business"),
    accessor: (field) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium flex items-center gap-1">
          <Landmark size={12} className="text-slate-400 shrink-0" />
          {field.businessName}
        </span>
        <span className="text-muted-foreground text-[11px]">
          {field.businessSlug}
        </span>
      </div>
    ),
    sortKey: "businessName",
  },
  {
    header: t("status"),
    accessor: (field) => {
      const active = field.isActive === "ACTIVE";
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
            active
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-600 border-slate-200",
          )}
        >
          {active ? t("active") : t("inactive")}
        </span>
      );
    },
    sortKey: "isActive",
  },
  {
    header: t("bookingsPeriod"),
    accessor: (field) => {
      const stats: BookingStats = field.bookingStats || {};
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-slate-900">
            {t("totalCount", { count: stats.totalInPeriod ?? 0 })}
          </span>
        </div>
      );
    },
    sortKey: "bookingStats.totalInPeriod",
  },
  {
    header: t("statusBreakdown"),
    accessor: (field) => {
      const stats: BookingStats = field.bookingStats || {};

      const badges: Array<{
        label: string;
        value: number;
        className: string;
      }> = [
        {
          label: t("confirmed"),
          value: stats.confirmed || 0,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        {
          label: t("completed"),
          value: stats.completed || 0,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        },
        {
          label: t("pending"),
          value: stats.pending || 0,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        },
        {
          label: t("cancelled"),
          value: stats.cancelled || 0,
          className: "bg-rose-50 text-rose-700 border-rose-200",
        },
        {
          label: t("forReview"),
          value: stats.forReview || 0,
          className: "bg-amber-50 text-amber-700 border-amber-200",
        },
        {
          label: t("noShow"),
          value: stats.noShow || 0,
          className: "bg-slate-100 text-slate-600 border-slate-200",
        },
        {
          label: t("refund"),
          value: stats.refund || 0,
          className: "bg-purple-50 text-purple-700 border-purple-200",
        },
      ].filter((badge) => badge.value > 0);

      if (badges.length === 0) {
        return (
          <span className="text-[11px] text-slate-400 italic">{t("noActivity")}</span>
        );
      }

      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 font-medium border uppercase tracking-wide text-[10px]",
                badge.className,
              )}
            >
              {badge.label}: {badge.value}
            </span>
          ))}
        </div>
      );
    },
  },
];
