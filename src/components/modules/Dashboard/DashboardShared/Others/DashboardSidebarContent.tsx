"use client";

import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard";
import { IAuthUser } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface DashboardSidebarContentProps {
  userInfo: IAuthUser;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const playerT = useTranslations("player.navigation");
  const managerT = useTranslations("manager.navigation");
  const adminT = useTranslations("admin.navigation");
  const playerNavLabel = (title: string, href?: string) => {
    if (userInfo.role === "MANAGER") {
      if (href === dashboardHome) return t("dashboard");
      if (href?.endsWith("/public-booking")) return managerT("publicBooking");
      if (href?.endsWith("/create-booking")) return managerT("quickBooking");
      if (href?.endsWith("/manage-bookings")) return managerT("manageBookings");
      if (href?.endsWith("/block-slots")) return managerT("blockSlots");
      if (href?.endsWith("/finalize-bookings")) return managerT("finalizeBookings");
      if (href?.endsWith("/pending-refunds")) return managerT("pendingRefunds");
      if (href?.endsWith("/popular-hours")) return managerT("popularHours");
      if (href?.endsWith("/utilization")) return managerT("utilization");
      if (href?.endsWith("/players")) return managerT("players");
      if (href?.endsWith("/my-profile")) return managerT("myProfile");
      if (href?.endsWith("/change-password")) return managerT("changePassword");
      if (title === "Bookings") return managerT("bookings");
      if (title === "Management") return managerT("management");
      if (title === "Profile") return managerT("profile");
      if (title === "Settings") return managerT("settings");
      return title;
    }
    if (userInfo.role === "SUPER_ADMIN") {
      if (href === dashboardHome) return t("dashboard");
      if (href?.endsWith("/users")) return adminT("users");
      if (href?.endsWith("/businesses")) return adminT("businesses");
      if (href?.endsWith("/payout-summary")) return adminT("payoutSummary");
      if (href?.endsWith("/business-performance")) return adminT("businessPerformance");
      if (href?.endsWith("/business-statements")) return adminT("businessStatements");
      if (href?.endsWith("/all-wallets")) return adminT("allWallets");
      if (href?.endsWith("/my-profile")) return adminT("myProfile");
      if (href?.endsWith("/change-password")) return adminT("changePassword");
      if (title === "Management") return adminT("management");
      if (title === "Finance") return adminT("finance");
      if (title === "Profile") return adminT("profile");
      if (title === "Settings") return adminT("settings");
      return title;
    }
    if (userInfo.role !== "PLAYER") return title;
    if (href === dashboardHome) return t("dashboard");
    if (href?.endsWith("/booking-link")) return playerT("bookingLink");
    if (href?.endsWith("/manage-bookings")) return playerT("myBookings");
    if (href?.endsWith("/refunds")) return playerT("refunds");
    if (href?.endsWith("/my-profile")) return playerT("myProfile");
    if (href?.endsWith("/change-password")) return playerT("changePassword");
    if (title === "Bookings") return playerT("bookings");
    if (title === "Finance") return playerT("finance");
    if (title === "Profile") return playerT("profile");
    if (title === "Settings") return playerT("settings");
    return title;
  };

  return (
    <div className="hidden md:flex h-screen w-72 flex-col border-r border-slate-200 bg-white sticky top-0 left-0 overflow-hidden">
      <div className="h-20 px-6 flex items-center border-b border-slate-200 shrink-0">
        <Link href={dashboardHome}>
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tight text-slate-900">
              Turf Track
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {t("dashboard")}
            </p>
          </div>
        </Link>
      </div>

      {/* NAVIGATION (Independently Scrollable Container) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        <nav className="space-y-6">
          {navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
                  {section.title && (
                    <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                  {playerNavLabel(section.title)}
                </p>
              )}

              <div className="space-y-2">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200",
                          isActive
                            ? "bg-green-100 border-green-200 text-slate-900"
                            : "hover:bg-slate-100 text-slate-500 hover:text-slate-900",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 transition-colors",
                            isActive
                              ? "text-green-600"
                              : "text-slate-400 group-hover:text-slate-700",
                          )}
                        />

                        <span
                          className={cn(
                            "flex-1 text-sm uppercase tracking-wide",
                            isActive ? "font-black" : "font-bold",
                          )}
                        >
                          {playerNavLabel(item.title, item.href)}
                        </span>

                        {item.badge && (
                          <span
                            className={cn(
                              "min-w-6 h-6 px-2 rounded-full flex items-center justify-center text-[10px] font-black",
                              isActive
                                ? "bg-slate-900 text-white"
                                : "bg-slate-200 text-slate-600",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                  );
                })}
              </div>

              {sectionIdx < navItems.length - 1 && (
                <div className="my-6 border-t border-slate-100" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* USER PROFILE (Pinned Bottom) */}
      <div className="border-t border-slate-200 p-5 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
            {userInfo.photo ? (
              <Image
                src={userInfo.photo}
                alt={userInfo.fullName}
                className="h-full w-full object-cover"
                width={48}
                height={48}
              />
            ) : (
              <span className="text-lg font-black text-green-700">
                {userInfo.fullName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black uppercase text-slate-900">
              {userInfo.fullName}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
              {userInfo.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebarContent;
