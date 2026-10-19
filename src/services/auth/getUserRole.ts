"use server";

import { getCookie } from "./tokenHandlers";

// getUserRole.ts
export type UserRole = "owner" | "manager" | "turfUser" | "admin" | null;

export async function getLoggedInRole(): Promise<UserRole> {
  // detect cookies or whatever
  const owner = await getCookie("ownerAccess");
  if (owner) return "owner";

  const manager = await getCookie("managerAccess");
  if (manager) return "manager";

  const admin = await getCookie("adminAccess");
  if (admin) return "admin";

  const turf = await getCookie("turfUserAccess");
  if (turf) return "turfUser";

  return null;
}
