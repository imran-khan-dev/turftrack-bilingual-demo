"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetClose, SheetTitle } from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard";
import { IAuthUser } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface DashboardMobileSidebarContentProps {
  userInfo: IAuthUser;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardMobileSidebar = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardMobileSidebarContentProps) => {
  const pathname = usePathname();
  const t = useTranslations("navigation");
  const common = useTranslations("common");
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
    <div className="flex h-full flex-col bg-white overflow-hidden">
      {/* HEADER */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
        <SheetClose asChild>
          <Link href={dashboardHome} className="flex flex-col">
            <span className="text-lg font-black italic uppercase tracking-tight text-slate-900">
              Turf Track
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {t("dashboard")}
            </span>
          </Link>
        </SheetClose>
      </div>

      <SheetTitle className="sr-only">{common("navigation.menu")}</SheetTitle>

      {/* NAVIGATION */}
      <ScrollArea className="flex-1 overflow-y-auto px-4 py-5">
        <nav className="space-y-6">
          {navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && (
                <h4 className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                  {playerNavLabel(section.title)}
                </h4>
              )}

              <div className="space-y-2">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <SheetClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all border",
                          isActive
                            ? "bg-green-50 border-green-200 text-slate-900"
                            : "bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            isActive ? "text-green-600" : "text-slate-400",
                          )}
                        />

                        <span className="flex-1">{playerNavLabel(item.title, item.href)}</span>

                        {item.badge && (
                          <span
                            className={cn(
                              "text-[10px] font-black px-2 py-0.5 rounded-full border",
                              isActive
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-slate-100 text-slate-500 border-slate-200",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>

              {sectionIdx < navItems.length - 1 && (
                <Separator className="my-5 bg-slate-100" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* USER SECTION */}
      <div className="border-t border-slate-100 p-5 bg-slate-50/40">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-11 w-11 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
            {/* <span className="text-sm font-black text-slate-700">
              {userInfo.fullName.charAt(0).toUpperCase()}
            </span> */}
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

          {/* Info */}
          <div className="flex flex-col leading-tight">
            <p className="text-sm font-black text-slate-900 truncate">
              {userInfo.fullName}
            </p>

            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {userInfo.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMobileSidebar;
