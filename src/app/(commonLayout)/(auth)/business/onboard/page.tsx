import BusinessOnboardingMaster from "@/components/modules/Business/Onboard/BusinessOnboardingMaster";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Metadata } from "next";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Onboard Business Account | Turf Track",
  description:
    "Create your business account to access bookings, matches, and all business features.",
  robots: {
    index: true,
    follow: true,
  },
};

const BusinessOnboardPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const redirectPath =
    typeof params.redirect === "string" ? params.redirect : "/owner/dashboard";

  const result = await getUserInfo();
  const user =
    result.status !== "error" && result.status !== "unauthenticated"
      ? result.user
      : null;

  if (user && user.role === "OWNER" && user.isVerified) {
    redirect(redirectPath);
  }

  return (
    <>
      <BusinessOnboardingMaster />
    </>
  );
};

export default BusinessOnboardPage;
