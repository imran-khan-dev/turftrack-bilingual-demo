import { UserRole } from "@/types/user";

type RouteConfig = {
  exact: string[];
  patterns: RegExp[];
};

// PUBLIC AUTH PAGES

export const publicAuthRoutes: RouteConfig = {
  exact: [
    "/login",
    "/user/player/register",
    "/business/onboard",
    "/forgot-password",
    "/reset-password",
    // "/business/verify",
    // "/user/verify",
  ],

  patterns: [],
};

// BOOKING AUTH PROTECTED ROUTES

export const bookingProtectedRoutes: RouteConfig =
{
  exact: [],

  patterns: [
    /^\/book\/[^/]+\/confirm$/,

    /^\/book\/[^/]+\/result(\/.*)?$/,
  ],
};

// COMMON PROTECTED ROUTES

export const commonProtectedRoutes: RouteConfig =
{
  exact: [
    "/my-profile",
    "/settings",
    "/change-password",
  ],

  patterns: [],
};

// OWNER ROUTES

export const ownerProtectedRoutes: RouteConfig =
{
  exact: [],

  patterns: [/^\/owner(\/.*)?$/],
};

// MANAGER ROUTES

export const managerProtectedRoutes: RouteConfig =
{
  exact: [],

  patterns: [/^\/manager(\/.*)?$/],
};

// ADMIN ROUTES

export const adminProtectedRoutes: RouteConfig =
{
  exact: [],

  patterns: [/^\/admin(\/.*)?$/],
};

// SUPER ADMIN ROUTES

export const superAdminProtectedRoutes: RouteConfig =
{
  exact: [],

  patterns: [/^\/super-admin(\/.*)?$/],
};

// PLAYER ROUTES

export const playerProtectedRoutes: RouteConfig =
{
  exact: [],

  patterns: [/^\/player(\/.*)?$/],
};

// GENERIC ROUTE MATCHER

export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig,
): boolean => {
  if (routes.exact.includes(pathname)) {
    return true;
  }

  return routes.patterns.some((pattern) =>
    pattern.test(pathname),
  );
};

// PUBLIC AUTH PAGE CHECK

export const isPublicAuthPage = (
  pathname: string,
): boolean => {
  return isRouteMatches(
    pathname,
    publicAuthRoutes,
  );
};

// BOOKING PROTECTED CHECK

export const isBookingProtectedRoute = (
  pathname: string,
): boolean => {
  return isRouteMatches(
    pathname,
    bookingProtectedRoutes,
  );
};

// ROUTE OWNER DETECTION

export const getRouteOwner = (
  pathname: string,
):
  | "OWNER"
  | "MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN"
  | "PLAYER"
  | "COMMON"
  | null => {
  if (
    isRouteMatches(
      pathname,
      superAdminProtectedRoutes,
    )
  ) {
    return "SUPER_ADMIN";
  }

  if (
    isRouteMatches(
      pathname,
      adminProtectedRoutes,
    )
  ) {
    return "ADMIN";
  }

  if (
    isRouteMatches(
      pathname,
      ownerProtectedRoutes,
    )
  ) {
    return "OWNER";
  }

  if (
    isRouteMatches(
      pathname,
      managerProtectedRoutes,
    )
  ) {
    return "MANAGER";
  }

  if (
    isRouteMatches(
      pathname,
      playerProtectedRoutes,
    )
  ) {
    return "PLAYER";
  }

  if (
    isRouteMatches(
      pathname,
      commonProtectedRoutes,
    )
  ) {
    return "COMMON";
  }

  return null;
};

// DEFAULT DASHBOARD
export const getDefaultDashboardRoute = (
  role: UserRole,
): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";

    case "OWNER":
      return "/owner/dashboard";

    case "MANAGER":
      return "/manager/dashboard";

    case "ADMIN":
      return "/admin/dashboard";

    case "PLAYER":
      return "/player/dashboard";

    default:
      return "/";
  }
};

// REDIRECT VALIDATION

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
): boolean => {
  const routeOwner =
    getRouteOwner(redirectPath);

  if (
    routeOwner === null ||
    routeOwner === "COMMON"
  ) {
    return true;
  }

  return routeOwner === role;
};