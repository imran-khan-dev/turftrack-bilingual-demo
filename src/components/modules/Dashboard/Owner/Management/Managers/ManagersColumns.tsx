/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Column } from "@/components/shared/ManagementTable";
import { cn } from "@/lib/utils";
import { BadgeCheck, ShieldAlert } from "lucide-react";

export interface StaffData {
  id: string;
  role: string;
  isActive: string; // "ACTIVE" | "INACTIVE"
  isRemoved: boolean;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    photo: string | null;
    isVerified: boolean;
  };
  business: {
    id: string;
    name: string;
  };
}

export const getManagersColumns = (t?: (key: string) => string): Column<StaffData | any>[] => [
  {
    header: t?.("manager") || "Manager",
    accessor: (staff) => (
      <UserInfoCell
        name={staff.user?.fullName}
        email={staff.user?.email || staff.user?.phone}
        photo={staff.user?.photo || ""}
      />
    ),
    sortKey: "fullName",
  },
  {
    header: t?.("phone") || "Phone",
    accessor: (staff) => staff.user?.phone || t?.("notAvailable") || "N/A",
    className: "text-sm text-slate-600",
  },
  {
    header: t?.("business") || "Business",
    accessor: (staff) => (
      <span className="text-xs font-medium text-slate-900">
        {staff.business?.name || t?.("notAvailable") || "N/A"}
      </span>
    ),
    sortKey: "businessName",
  },
  {
    header: t?.("verification") || "Verification",
    sortKey: "isVerified",
    accessor: (staff) => {
      const isVerified = staff.user?.isVerified;

      return (
        <span
          className={cn(
            "inline-flex w-max items-center gap-1 rounded-full px-2 py-0.5 font-medium uppercase tracking-wide text-[10px] border",
            isVerified
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-100 text-slate-600 border-slate-200",
          )}
        >
          {isVerified ? (
            <BadgeCheck className="w-3 h-3" />
          ) : (
            <ShieldAlert className="w-3 h-3" />
          )}
          {isVerified ? t?.("verified") || "Verified" : t?.("unverified") || "Unverified"}
        </span>
      );
    },
  },
  {
    header: t?.("status") || "Status",
    sortKey: "isActive",
    accessor: (staff) => {
      const status = staff.isActive;

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
    header: t?.("joinedOn") || "Joined On",
    accessor: (staff) => <DateCell date={staff.createdAt} />,
    sortKey: "createdAt",
  },
];
