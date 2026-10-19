"use client";

import LogoutButton from "@/components/shared/LogoutButton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/services/auth/logout";
import { IAuthUser } from "@/types/user";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface UserDropdownProps {
  userInfo: IAuthUser;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const adminT = useTranslations("admin.users.roles");
  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <DropdownMenu>
      {/* TRIGGER */}
      <DropdownMenuTrigger asChild>
        <Button className="h-11 w-11 p-0 overflow-hidden shrink-0 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black uppercase">
          {userInfo.photo ? (
            <Image
              src={userInfo.photo}
              alt={userInfo.fullName}
              className="h-full w-full object-cover rounded-2xl"
              width={44}
              height={44}
            />
          ) : (
            userInfo.fullName.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* CONTENT */}
      <DropdownMenuContent
        align="end"
        className="w-64 p-0 rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-5 border-b border-slate-100">
          <p className="text-sm font-black uppercase tracking-tight text-slate-900">
            {userInfo.fullName}
          </p>

          {userInfo.email && (
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
              {userInfo.email}
            </p>
          )}

          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
            {userInfo.phone}
          </p>

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mt-2">
            {userInfo.role === "SUPER_ADMIN" ? adminT("superAdmin") : userInfo.role?.toLowerCase()}
          </p>
        </div>

        <DropdownMenuSeparator />

        {/* LOGOUT */}
        <div className="p-2">
          <DropdownMenuItem
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl text-sm font-black uppercase tracking-wide text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <LogoutButton />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
