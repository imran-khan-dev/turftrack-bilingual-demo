/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Column } from "@/components/shared/ManagementTable";
import { cn } from "@/lib/utils";
import { BadgeCheck } from "lucide-react";

export interface BusinessData {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  location: string;
  contactNumber: string;
  isContactVerified: boolean;
  isActive: string;
  logo: string | null;
  totalCompletedBookings: number;
  currentDebt: string | number;
  createdAt?: string;
}

export const getBusinessColumns = (t?: (key: string) => string): Column<BusinessData | any>[] => [
  {
    header: t?.("business") || "Business",
    accessor: (business) => (
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-slate-900">
          {business.name}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {business.slug}
        </span>
      </div>
    ),
    sortKey: "name",
  },
  {
    header: t?.("location") || "Location",
    accessor: (business) => (
      <span className="text-xs font-medium text-slate-700">
        {business.location || t?.("notAvailable") || "N/A"}
      </span>
    ),
  },
  {
    header: t?.("contact") || "Contact",
    accessor: (business) => (
      <div className="flex flex-col text-xs">
        <span className="font-medium text-slate-700">
          {business.contactNumber || t?.("notAvailable") || "N/A"}
        </span>
        {business.isContactVerified && (
          <span className="inline-flex w-max items-center gap-1 text-[10px] font-medium text-emerald-600">
            <BadgeCheck className="w-3 h-3" />
            {t?.("verified") || "Verified"}
          </span>
        )}
      </div>
    ),
  },
  {
    header: t?.("status") || "Status",
    sortKey: "isActive",
    accessor: (business) => {
      const status = business.isActive;

      if (status === "ACTIVE") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide text-[10px]">
            {t?.("active") || "Active"}
          </span>
        );
      }

      return (
        <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide text-[10px]">
          {t?.("inactive") || "Inactive"}
        </span>
      );
    },
  },
  {
    header: t?.("bookingsCompleted") || "Bookings Completed",
    sortKey: "totalCompletedBookings",
    accessor: (business) => (
      <span className="text-sm font-semibold text-slate-900">
        {business.totalCompletedBookings ?? 0}
      </span>
    ),
  },
  {
    header: t?.("currentDebt") || "Current Debt",
    sortKey: "currentDebt",
    accessor: (business) => {
      const debt = Number(business.currentDebt) || 0;

      return (
        <span
          className={cn(
            "text-sm font-semibold",
            debt > 0 ? "text-rose-600" : "text-slate-500",
          )}
        >
          ৳{debt}
        </span>
      );
    },
  },
];
