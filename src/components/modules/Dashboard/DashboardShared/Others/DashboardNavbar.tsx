import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import DashboardNavbarContent from "./DashboardNavbarContent";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { redirect } from "next/navigation";

const DashboardNavbar = async () => {
  const result = await getUserInfo();

  if (
    !result ||
    result.status === "error" ||
    result.status === "unauthenticated"
  )
    return redirect("/login");

  const navItems = await getNavItemsByRole(result.user.role);
  const dashboardHome = getDefaultDashboardRoute(result.user.role);

  return (
    <DashboardNavbarContent
      userInfo={result.user}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardNavbar;
