import { Metadata } from "next";
import ConfirmBookingClient from "./ConfirmBookingClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { checkUserBusinessAccess } from "@/utils/checkUserBusinessAccess";
import { getBusinessData } from "@/services/business/getBusinessData";
import { getTranslations } from "@/i18n/server";

const BASE_DATA = {
  cartId: "cart-expired",
  sumUpTotalAmount: 0,
  finalDiscount: 0,
  payableAmount: 0,
  slotPricingDetails: [],
  partialPaymentTier: [0],
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    cartId?: string | null;
    newBookingId?: string | null;
    from?: string | null;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessData(slug);
  const t = await getTranslations("booking");

  if (!business) {
    return { title: t("turf.not.found") };
  }

  return {
    title: t("confirmPageTitle", { businessName: business.name.toUpperCase() || "Turf Business" }),
    description:
      business.aboutDesc ||
      t("confirmPageDescription", { businessName: business.name }),
    openGraph: {
      images: business.heroImage ? [business.heroImage] : [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ConfirmBookingPage({
  params,
  searchParams,
}: PageProps) {
  const t = await getTranslations("booking");
  const { slug } = await params;
  const { cartId, newBookingId } = await searchParams;
  const result = await getUserInfo();

  const user =
    result.status !== "error" && result.status !== "unauthenticated"
      ? result.user
      : null;

  const business = await getBusinessData(slug);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          {t("user.not.found")}
        </h1>
        <p className="text-gray-600 mb-6">
          {t("we.could.not.find.the.authenticated.user")}
        </p>
        <Link href="/">
          <Button className="bg-[#1A80E3] hover:bg-blue-700 text-white">
            {t("goBackHome")}
          </Button>
        </Link>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          {t("turf.not.found")}
        </h1>
        <p className="text-gray-600 mb-6">
          {t("we.could.not.find.the.turf.business.you.were.looking.for")}
        </p>
        <Link href="/">
          <Button className="bg-[#1A80E3] hover:bg-blue-700 text-white">
            {t("goBackHome")}
          </Button>
        </Link>
      </div>
    );
  }

  if (!cartId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          {t("cart.not.found")}
        </h1>
        <p className="text-gray-600 mb-6">
          {t("we.could.not.find.the.cart.associated.with.the.booking")}
        </p>
        <Link href="/">
          <Button className="bg-[#1A80E3] hover:bg-blue-700 text-white">
            {t("goBackHome")}
          </Button>
        </Link>
      </div>
    );
  }

  const userBusinessAccess = checkUserBusinessAccess(user, business?.id);

  if (userBusinessAccess.status !== "ACTIVE") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">{t("access.denied")}</h1>
        <p className="text-gray-600 mb-6">
          {t("you.are.restricted.from.accessing.this.turf.business")}
        </p>
        <Link href="/">
          <Button className="bg-[#1A80E3] hover:bg-blue-700 text-white">
            {t("goBackHome")}
          </Button>
        </Link>
      </div>
    );
  }

  const USER_DATA = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    photo: user.photo,
    playerBusinessAccesses: user.playerBusinessAccesses,
    isSpecial: userBusinessAccess.isSpecial,
  };

  const businessInfo = {
    id: business?.id,
    name: business?.name,
    slug: business?.slug,
    logo: business?.logo,
  };

  const configuredPaymentMethod = process.env.PAYMENT_METHOD;
  const paymentMethod: "bkash" | "ssl" | "ziniPay" =
    configuredPaymentMethod === "bkash" ||
    configuredPaymentMethod === "ssl" ||
    configuredPaymentMethod === "ziniPay"
      ? configuredPaymentMethod
      : "ziniPay";

  return (
    <ConfirmBookingClient
      businessInfo={businessInfo}
      initialData={BASE_DATA}
      user={USER_DATA}
      oneBookingId={newBookingId || null}
      cartId={cartId || null}
      paymentMethod={paymentMethod}
    />
  );
}
