import VerifyBusinessFormMaster from "@/components/modules/Business/Verify/VerifyBusinessFormMaster";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { normalizeBdPhone } from "@/utils/normalizeBDPhone";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verify Business Account | Turf Track",
  description:
    "Verify your business account to access bookings, matches, and all business features.",
  robots: {
    index: false,
    follow: false,
  },
};

const verifyBusinessPage = async () => {
  const result = await getUserInfo();

  const user =
    result.status !== "error" && result.status !== "unauthenticated"
      ? result.user
      : null;

  if (!user || !user.id) return redirect("/login");

  const business = user.businesses?.[0] || {};
  const businessId = business.id || "";

  const rawOwnerPhone = normalizeBdPhone((user.phone || "").trim());
  const rawBusinessPhone = normalizeBdPhone(
    (business.contactNumber || "").trim(),
  );
  const rawBkashPhone = normalizeBdPhone((business.bkashNumber || "").trim());

  const isPhoneVerified = !!user.isPhoneVerified;
  let isContactVerified = !!business.isContactVerified;
  let isBkashVerified = !!business.isBkashVerified;

  if (rawBusinessPhone === rawOwnerPhone) {
    if (isPhoneVerified) isContactVerified = true;
  }

  if (rawBkashPhone === rawOwnerPhone) {
    if (isPhoneVerified) isBkashVerified = true;
  }

  if (rawBkashPhone === rawBusinessPhone) {
    if (isContactVerified) isBkashVerified = true;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <VerifyBusinessFormMaster
        businessId={businessId}
        initialOwnerPhone={rawOwnerPhone}
        initialBusinessPhone={rawBusinessPhone}
        initialBkashPhone={rawBkashPhone}
        isPhoneVerified={isPhoneVerified}
        isContactVerified={isContactVerified}
        isBkashVerified={isBkashVerified}
      />
    </div>
  );
};

export default verifyBusinessPage;
