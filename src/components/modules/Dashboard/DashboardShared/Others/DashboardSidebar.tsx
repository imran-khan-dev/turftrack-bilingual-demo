import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import DashboardSidebarContent from "./DashboardSidebarContent";
import { NavSection } from "@/types/dashboard";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { redirect } from "next/navigation";

const DashboardSidebar = async () => {
  const result = await getUserInfo();

  if (
    !result ||
    result.status === "error" ||
    result.status === "unauthenticated"
  )
    return redirect("/login");

  const navItems: NavSection[] = await getNavItemsByRole(result.user.role);
  const dashboardHome = getDefaultDashboardRoute(result.user.role);

  return (
    <DashboardSidebarContent
      userInfo={result.user}
      navItems={navItems}
      dashboardHome={dashboardHome}
      // isMobile={false}
    />
  );
};

export default DashboardSidebar;
