/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import { getNewAccessToken } from "./services/auth/getNewAccessToken";
import {
  deleteCookie,
  getCookie,
} from "./services/auth/tokenHandlers";

import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isBookingProtectedRoute,
  isPublicAuthPage,
} from "./lib/auth-utils";
import { UserRole } from "./types/user";

export async function proxy(
  request: NextRequest,
) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // PHASE 1: TOKEN REFRESH
  const hasTokenRefreshedParam =
    url.searchParams.has("tokenRefreshed");

  if (hasTokenRefreshedParam) {
    const newUrl = url.clone();

    newUrl.searchParams.delete(
      "tokenRefreshed",
    );

    return NextResponse.redirect(newUrl);
  }

  const tokenRefreshResult =
    await getNewAccessToken();

  if (tokenRefreshResult?.tokenRefreshed) {
    const newUrl = url.clone();

    newUrl.searchParams.set(
      "tokenRefreshed",
      "true",
    );

    return NextResponse.redirect(newUrl);
  }

  // PHASE 2: AUTH CHECK

  const accessToken =
    (await getCookie("accessToken")) || null;

  let userRole: UserRole = null;
  let tokenData: JwtPayload | null = null;

  if (accessToken) {
    try {
      const verifiedToken = jwt.verify(
        accessToken,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;

      userRole =
        (verifiedToken.role as UserRole) || null;
      tokenData = verifiedToken;
    } catch (error) {
      console.error(error);

      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");

      return NextResponse.redirect(
        new URL("/login", request.url),
      );
    }
  }

  // ROUTE ANALYSIS

  const routeOwner =
    getRouteOwner(pathname);

  const isPublicAuth =
    isPublicAuthPage(pathname);

  const isBookingProtected =
    isBookingProtectedRoute(pathname);

  // PHASE 3: VERIFICATION STEER CONTROLS
  const isVisitingBusinessVerify = pathname.startsWith("/business/verify");
  const isVisitingUserVerify = pathname.startsWith("/user/verify");

  // When User is not verified but try to access a protected route, redirect to verify screen
  if (accessToken && tokenData && !isVisitingBusinessVerify && !isVisitingUserVerify) {
    const isPhoneVerified = tokenData.isPhoneVerified;
    const isBusinessContactVerified = tokenData.isBusinessContactVerified;
    const isBkashVerified = tokenData.isBkashVerified;

    if (userRole === "OWNER") {
      // Rule 1: OWNER phone verification fallback
      if (!isPhoneVerified) {
        return NextResponse.redirect(new URL("/business/verify", request.url));
      }
      // Case 2: OWNER business channels (Contact info or bKash ledger verification failures)
      if (isBusinessContactVerified === false || isBkashVerified === false) {
        return NextResponse.redirect(new URL("/business/verify", request.url));
      }
    } else {
      // Rule 3: Non-OWNER role validation phone verification redirect target

      if (!isPhoneVerified) {
        return NextResponse.redirect(new URL("/user/verify", request.url));
      }
    }
  }

  // RULE 1:
  // Logged in users should not access login/register

  if (accessToken && isPublicAuth) {
    return NextResponse.redirect(
      new URL(
        getDefaultDashboardRoute(userRole),
        request.url,
      ),
    );
  }

  // RULE 2:
  // Booking protected routes require auth

  if (
    isBookingProtected &&
    !accessToken
  ) {
    const loginUrl = new URL(
      "/login",
      request.url,
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  // RULE 3:
  // Role/Common protected routes require auth

  if (
    routeOwner !== null &&
    !accessToken
  ) {
    const loginUrl = new URL(
      "/login",
      request.url,
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  // RULE 4:
  // Role validation

  if (
    routeOwner &&
    routeOwner !== "COMMON"
  ) {
    if (userRole !== routeOwner) {
      return NextResponse.redirect(
        new URL(
          getDefaultDashboardRoute(
            userRole,
          ),
          request.url,
        ),
      );
    }
  }

  // PUBLIC ROUTE

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};