"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  LayoutDashboard,
  CalendarDays,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { logoutUser } from "@/services/auth/logout";
import { IAuthUser } from "@/types/user";
import { useTranslations } from "next-intl";

interface Props {
  businessInfo: {
    name: string;
    logo?: string;
    slug: string;
  };

  user: IAuthUser | null;
}

export function BusinessNavbar({ businessInfo, user }: Props) {
  const t = useTranslations("navigation");
  const authT = useTranslations("auth");
  const pathname = usePathname();

  const isCheckout = pathname.includes("confirm");
  const isResult = pathname.includes("result");

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const userRole =
    user?.role?.toLowerCase() === "super_admin"
      ? "super-admin"
      : user?.role?.toLowerCase();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const getDashboardRoute = () => {
    switch (user?.role) {
      case "SUPER_ADMIN":
        return "/super-admin/dashboard";
      case "ADMIN":
        return "/admin/dashboard";

      case "OWNER":
        return "/owner/dashboard";

      case "MANAGER":
        return "/manager/dashboard";

      case "PLAYER":
        return "/player/dashboard";

      default:
        return "/";
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* LOGO */}

        <Link
          href={`/book/${businessInfo.slug}`}
          className="flex items-center gap-3 shrink-0"
        >
          {businessInfo.logo && (
            <Image
              src={businessInfo.logo}
              alt={businessInfo.name}
              width={42}
              height={42}
              className="rounded-full object-cover border"
            />
          )}

          <div className="leading-none">
            <p className="text-lg font-black tracking-tight text-slate-900 uppercase">
              {businessInfo.name}
            </p>

            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Turf Booking
            </p>
          </div>
        </Link>

        {/* BOOKING PROGRESS */}

        <div className="hidden lg:flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
          {/* STEP 1 */}
          <div
            className={`flex items-center gap-2 ${
              !isCheckout && !isResult ? "text-green-600" : "text-slate-400"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                !isCheckout && !isResult
                  ? "border-green-600 bg-green-50"
                  : "border-slate-200"
              }`}
            >
              1
            </span>
            CREATE BOOKING
          </div>

          <ChevronRight size={14} className="text-slate-300" />

          {/* STEP 2 */}
          <div
            className={`flex items-center gap-2 ${
              isCheckout ? "text-green-600" : "text-slate-400"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isCheckout ? "border-green-600 bg-green-50" : "border-slate-200"
              }`}
            >
              2
            </span>
            CONFIRM & PAY
          </div>

          <ChevronRight size={14} className="text-slate-300" />

          {/* STEP 3 */}
          <div
            className={`flex items-center gap-2 ${
              isResult ? "text-green-600" : "text-slate-400"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isResult ? "border-green-600 bg-green-50" : "border-slate-200"
              }`}
            >
              3
            </span>
            RESULT
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="relative" ref={dropdownRef}>
          {user ? (
            <>
              {/* USER BUTTON */}
              <button
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="group flex items-center cursor-pointer gap-3 rounded-full border border-slate-200/80 bg-white px-2 py-1.5 hover:border-slate-300 hover:shadow-sm transition-all duration-300"
              >
                {/* AVATAR */}
                <div className="relative">
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center text-white text-xs font-black uppercase">
                    {user.photo ? (
                      <Image
                        src={user.photo}
                        alt={user.fullName}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.fullName?.charAt(0)
                    )}
                  </div>

                  {/* ONLINE DOT */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white" />
                </div>

                {/* INFO */}
                <div className="hidden sm:block text-left leading-none">
                  <p className="text-sm font-bold tracking-tight text-slate-900">
                    {user.fullName}
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 mt-1">
                    {userRole}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform duration-300 ${
                    openDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DROPDOWN */}
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-[280px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-200">
                  {/* USER TOP */}
                  <div className="px-5 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center text-white font-black uppercase">
                        {user.photo ? (
                          <Image
                            src={user.photo}
                            alt={user.fullName}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          user.fullName?.charAt(0)
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {user.fullName}
                        </p>

                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* MENU */}
                  <div className="p-2">
                    <Link
                      href={getDashboardRoute()}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-slate-100 transition-colors"
                    >
                      <LayoutDashboard size={17} className="text-slate-500" />

                      <span className="font-medium text-sm text-slate-700">
                        {t("dashboard")}
                      </span>
                    </Link>

                    {userRole !== "admin" && userRole !== "super-admin" && (
                      <Link
                        href={`/${userRole}/dashboard/manage-bookings`}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-slate-100 transition-colors"
                      >
                        <CalendarDays size={17} className="text-slate-500" />

                        <span className="font-medium text-sm text-slate-700">
                          Bookings
                        </span>
                      </Link>
                    )}

                    <Link
                      href={`/${userRole}/dashboard/my-profile`}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-slate-100 transition-colors"
                    >
                      <User size={17} className="text-slate-500" />

                      <span className="font-medium text-sm text-slate-700">
                        Profile
                      </span>
                    </Link>

                    <div className="h-px bg-slate-100 my-2" />

                    <button
                      onClick={() => logoutUser()}
                      className="w-full flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 hover:bg-red-50 transition-colors text-red-500"
                    >
                      <LogOut size={17} />

                      <span className="font-medium text-sm">{authT("logout")}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={`/login?redirect=/book/${businessInfo.slug}`}>
                <button className="h-11 px-5 cursor-pointer rounded-full border border-slate-200 bg-white hover:border-slate-300 text-sm font-bold transition-all">
                  Login
                </button>
              </Link>

              <Link
                href={`/user/player/register?redirect=/book/${businessInfo.name}`}
              >
                <button className="h-11 px-5 cursor-pointer rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
