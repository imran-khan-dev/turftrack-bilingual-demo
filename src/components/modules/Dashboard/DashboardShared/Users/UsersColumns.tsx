/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Column } from "@/components/shared/ManagementTable";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";
import { CheckCircle2, XCircle } from "lucide-react";

function StatusDot({
  label,
  tone,
}: {
  label: string;
  tone: "emerald" | "rose" | "slate" | "amber";
}) {
  const toneClasses = {
    emerald: "text-emerald-700",
    rose: "text-rose-700",
    slate: "text-slate-500",
    amber: "text-amber-700",
  };
  const dotClasses = {
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    slate: "bg-slate-400",
    amber: "bg-amber-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-semibold",
        toneClasses[tone],
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotClasses[tone])}
      />
      {label}
    </span>
  );
}

export const getUsersColumns = (t: (key: string) => string): Column<User | any>[] => [
  {
    header: t("user"),
    accessor: (user) => (
      <UserInfoCell
        name={user.fullName || t("notAvailable")}
        email={user.email || user.phone}
        photo={user.photo || ""}
      />
    ),
    sortKey: "fullName",
  },
  {
    header: t("phone"),
    accessor: (user) => (
      <span className="text-xs font-medium text-slate-700">
        {user.phone || t("notAvailable")}
      </span>
    ),
    sortKey: "phone",
  },
  {
    header: t("address"),
    accessor: (user) => (
      <span className="text-xs text-slate-600 truncate max-w-[140px] block">
        {user.address || t("notAvailable")}
      </span>
    ),
    sortKey: "address",
  },
  {
    header: t("role"),
    accessor: (user) => (
      <span className="text-[11px] font-semibold text-slate-600">
        {getTranslatedRole(user.role, t)}
      </span>
    ),
    sortKey: "role",
  },
  {
    header: t("status"),
    accessor: (user) => {
      const isActive = user.isActive === "ACTIVE";
      return (
        <StatusDot
          label={isActive ? t("active") : t("inactive")}
          tone={isActive ? "emerald" : "rose"}
        />
      );
    },
    sortKey: "isActive",
  },
  {
    header: t("verified"),
    accessor: (user) => (
      <div className="flex items-center gap-1">
        {user.isVerified ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <XCircle className="w-3.5 h-3.5 text-slate-300" />
        )}
        <span className="text-[11px] text-slate-600 font-medium">
          {user.isVerified ? t("verified") : t("unverified")}
        </span>
      </div>
    ),
    sortKey: "isVerified",
  },
  {
    header: t("account"),
    accessor: (user) => {
      const isDeleted = !!user.isDeleted;
      return (
        <StatusDot
          label={isDeleted ? t("deleted") : t("retained")}
          tone={isDeleted ? "rose" : "slate"}
        />
      );
    },
    sortKey: "isDeleted",
  },
  {
    header: t("joinedOn"),
    accessor: (user) => <DateCell date={user.createdAt} />,
    sortKey: "createdAt",
  },
];

function getTranslatedRole(role: string | undefined, t: (key: string) => string) {
  switch (role) {
    case "SUPER_ADMIN": return t("roles.superAdmin");
    case "ADMIN": return t("roles.admin");
    case "OWNER": return t("roles.owner");
    case "MANAGER": return t("roles.manager");
    case "PLAYER": return t("roles.player");
    default: return role?.replace("_", " ") || t("notAvailable");
  }
}
