import CancelBookingClient from "./ZiniCancelBookingClient";
import Link from "next/link";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { getTranslations } from "@/i18n/server";
import { getBusinessData } from "@/services/business/getBusinessData";
import { getBookingCheck } from "@/services/booking/getBookingCheck";
import { cancelPendingBooking } from "@/services/booking/cancelPendingBooking";

interface CancelPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    cartId?: string | null;
  }>;
}

export async function generateMetadata({
  params,
}: CancelPageProps): Promise<Metadata> {
  const t = await getTranslations("booking");
  const { slug } = await params;
  const business = await getBusinessData(slug);

  if (!business) {
    return { title: t("turf.business.not.found") };
  }

  return {
    title: t("pageTitleCancelled", { businessName: business.name.toUpperCase() || "Turf Track" }),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ZiniCancelPage({
  params,
  searchParams,
}: CancelPageProps) {
  const t = await getTranslations("booking");
  const { slug } = await params;
  const { cartId } = await searchParams;
  const result = await getUserInfo();

  const user =
    result.status !== "error" && result.status !== "unauthenticated"
      ? result.user
      : null;

  if (!cartId) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
        <div className="w-full max-w-2xl bg-white border border-slate-100 shadow-xl rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-52 h-52 bg-green-500/5 rounded-full blur-3xl -mr-24 -mt-24" />

          <p className="text-[10px] uppercase tracking-[0.35em] font-black text-green-500">
            {t("session.error")}
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black italic tracking-tight text-slate-900">
            {t("cart.not.found")}
          </h1>

          <p className="mt-5 text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
            {t("your.booking.cart.could.not.be.located.the.reservation.sessi")}
          </p>

          <Link href="/">
            <Button className="mt-10 h-14 px-10 cursor-pointer rounded-2xl bg-green-500 hover:bg-green-400 text-slate-900 font-black uppercase tracking-[0.15em] shadow-lg">
              {t("goBackHome")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
        <div className="w-full max-w-2xl bg-white border border-slate-100 shadow-xl rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-52 h-52 bg-yellow-500/5 rounded-full blur-3xl -mr-24 -mt-24" />

          <p className="text-[10px] uppercase tracking-[0.35em] font-black text-yellow-500">
            {t("authentication.error")}
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black italic tracking-tight text-slate-900">
            {t("user.not.found")}
          </h1>

          <p className="mt-5 text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
            {t("we.could.not.verify.the.authenticated.user.session.please.lo")}
          </p>

          <Link href="/">
            <Button className="mt-10 h-14 px-10 cursor-pointer rounded-2xl bg-green-500 hover:bg-green-400 text-slate-900 font-black uppercase tracking-[0.15em] shadow-lg">
              {t("goBackHome")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const business = await getBusinessData(slug);

  if (!business) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
        <div className="w-full max-w-2xl bg-white border border-slate-100 shadow-xl rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-52 h-52 bg-red-500/5 rounded-full blur-3xl -mr-24 -mt-24" />

          <p className="text-[10px] uppercase tracking-[0.35em] font-black text-red-500">
            {t("booking.error")}
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black italic tracking-tight text-slate-900">
            {t("turf.not.found")}
          </h1>

          <p className="mt-5 text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
            {t("we.could.not.locate.the.turf.business.you.were.looking.for.t")}
          </p>

          <Link href="/">
            <Button className="mt-10 h-14 px-10 cursor-pointer rounded-2xl bg-green-500 hover:bg-green-400 text-slate-900 font-black uppercase tracking-[0.15em] shadow-lg">
              {t("goBackHome")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const bookingData = cartId ? await getBookingCheck(cartId) : null;

  let isValidBooking = false;

  if (bookingData.length !== 0 && bookingData[0]?.status === "PENDING") {
    await cancelPendingBooking(cartId);

    isValidBooking = true;
  } else if (bookingData[0]?.status === "CANCELLED") {
    isValidBooking = true;
  }

  if (!isValidBooking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
        <div className="w-full max-w-2xl bg-white border border-slate-100 shadow-xl rounded-[3rem] p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-52 h-52 bg-red-500/5 rounded-full blur-3xl -mr-24 -mt-24" />

          <p className="text-[10px] uppercase tracking-[0.35em] font-black text-red-500">
            {t("booking.error")}
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-black italic tracking-tight text-slate-900">
            {t("invalid.booking.cart.id")}
          </h1>

          <p className="mt-5 text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
            {t("the.booking.cart.id.provided.is.invalid.or.the.booking.has.n.variant2")}
          </p>

          <Link href={`/book/${business?.slug}`}>
            <Button className="mt-10 h-14 px-10 cursor-pointer rounded-2xl bg-green-500 hover:bg-green-400 text-slate-900 font-black uppercase tracking-[0.15em] shadow-lg">
              {t("goBackHome")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CancelBookingClient
      businessName={business?.name}
      retryUrl={`/book/${business?.slug}`}
      homeUrl="/"
    />
  );
}
