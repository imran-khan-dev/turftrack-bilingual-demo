import VerifyPlayer from "@/components/modules/Player/Verify/VerifyPlayer";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify Account | Turf Track",
  description:
    "Verify your account to access bookings, matches, and all player features.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function PlayerVerifyPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) {
  const params = (await searchParams) || {};
  const result = await getUserInfo();

  if (result.status === "error" || result.status === "unauthenticated")
    return redirect("/login");

  const user = result.user;

  if (user.isVerified) {
   
    const userRole =
      user?.role?.toLowerCase() === "super_admin"
        ? "super-admin"
        : user?.role?.toLowerCase();

    if (!userRole) return redirect("/login");

    return redirect(`/${userRole}/dashboard`);
  }

  return (
    <>
      <VerifyPlayer user={user} redirect={params.redirect} />
    </>
  );
}
