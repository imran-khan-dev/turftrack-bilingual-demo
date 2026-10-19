"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import UserDropdown from "./UserDropdown";
import { IAuthUser } from "@/types/user";
import { NavSection } from "@/types/dashboard";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import { useTranslations } from "next-intl";

interface DashboardNavbarContentProps {
  userInfo: IAuthUser;
  navItems?: NavSection[];
  dashboardHome?: string;
}

const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavbarContentProps) => {
  const adminT = useTranslations("admin.users.roles");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkSmallerScreen();
    window.addEventListener("resize", checkSmallerScreen);

    return () => {
      window.removeEventListener("resize", checkSmallerScreen);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="h-20 px-6 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <Sheet open={isMobile && isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                size="icon"
                className="rounded-lg bg-green-500
    hover:bg-green-600
    text-white
    shadow-none
    transition-all
    active:scale-[0.98] px-6! h-11!"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-72 p-0
    h-full
    flex flex-col
    bg-white
    border-r border-slate-100
    overflow-hidden"
            >
              <DashboardMobileSidebar
                userInfo={userInfo}
                navItems={navItems || []}
                dashboardHome={dashboardHome || ""}
              />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="flex flex-col leading-tight">
              <p className="text-sm font-black text-slate-900">
                {userInfo.fullName}
              </p>

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {userInfo.role === "SUPER_ADMIN" ? adminT("superAdmin") : userInfo.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <NotificationDropdown userInfo={userInfo} />
          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbarContent;
