/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Column } from "@/components/shared/ManagementTable";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface PlayerData {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  role: string;
  photo: string | null;
  clubName: string;
  createdAt: string;
  isSpecialInScope: boolean;
}

export const createPlayersColumns = (translate?: (key: string) => string): Column<PlayerData | any>[] => {
const label = (key: string, fallback: string) => translate ? translate(key) : fallback;
return [
  {
    header: label("player", "Player"),
    accessor: (player) => (
      <UserInfoCell
        name={player.fullName}
        email={player.email || player.phone}
        photo={player.photo || ""}
      />
    ),
    sortKey: "fullName",
  },
  {
    header: label("phone", "Phone"),
    accessor: (player) => player.phone || label("notAvailable", "N/A"),
    className: "text-sm text-slate-600",
  },
  {
    header: label("club", "Club"),
    accessor: (player) => (
      <span className="text-xs font-medium text-slate-900">
        {player.clubName || label("notAvailable", "N/A")}
      </span>
    ),
    sortKey: "clubName",
  },
  {
    header: label("special", "Special"),
    sortKey: "isSpecialInScope",
    accessor: (player) => {
      const isSpecial = player.isSpecialInScope;

      return (
        <span
          className={cn(
            "inline-flex w-max items-center gap-1 rounded-full px-2 py-0.5 font-medium uppercase tracking-wide text-[10px] border",
            isSpecial
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-slate-100 text-slate-500 border-slate-200",
          )}
        >
          {isSpecial && <Sparkles className="w-3 h-3" />}
          {isSpecial ? label("special", "Special") : label("notSpecial", "Not Special")}
        </span>
      );
    },
  },
  {
    header: label("joinedOn", "Joined On"),
    accessor: (player) => <DateCell date={player.createdAt} />,
    sortKey: "createdAt",
  },
];
};

export const playersColumns: Column<PlayerData | any>[] = createPlayersColumns();
