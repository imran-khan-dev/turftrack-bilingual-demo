import { Metadata } from "next";
import { getTranslations } from "@/i18n/server";
import Link from "next/link";

import { getUserInfo } from "@/services/auth/getUserFromToken";
import { Button } from "@/components/ui/button";
import { getBusinessData } from "@/services/business/getBusinessData";

import ZiniValidationProcessingClient from "./ZiniValidationProcessingClient";

interface Props {
  params: Promise<{
    slug: string;
    type: string;
  }>;

  searchParams: Promise<{
    transactionId?: string | null;
    invoiceId?: string | null;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations("booking");
  const { slug } = await params;

  const business = await getBusinessData(slug);

  if (!business) {
    return {
      title: t("turf.business.not.found"),
    };
  }

  return {
    title: t("paymentValidationProcessingTitle", { businessName: business.name.toUpperCase() || "Turf Track" }),
    openGraph: {
      images: business.heroImage ? [business.heroImage] : [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ValidateZiniPaymentPage({
  params,
  searchParams,
}: Props) {
  const t = await getTranslations("booking");
  const { slug } = await params;

  const { invoiceId } = await searchParams;

  const result = await getUserInfo();

  const user =
    result.status !== "error" && result.status !== "unauthenticated"
      ? result.user
      : null;

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-800">
          {t("user.not.found")}
        </h1>

        <p className="mb-6 text-gray-600">
          {t("we.could.not.find.the.authenticated.user")}
        </p>

        <Link href="/">
          <Button className="bg-[#1A80E3] text-white hover:bg-blue-700">
            {t("goBackHome")}
          </Button>
        </Link>
      </div>
    );
  }

  const business = await getBusinessData(slug);

  if (!business) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-800">
          {t("turf.business.not.found")}
        </h1>

        <p className="mb-6 text-gray-600">
          {t("we.could.not.find.the.turf.business.variant2")}
        </p>

        <Link href="/">
          <Button className="bg-[#1A80E3] text-white hover:bg-blue-700">
            {t("goBackHome")}
          </Button>
        </Link>
      </div>
    );
  }

  /**
   * ZiniPay redirects with invoiceId.
   * This is required to verify the payment.
   */
  if (!invoiceId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 text-center shadow-xl md:p-14">
          <div className="absolute right-0 top-0 -mr-24 -mt-24 h-52 w-52 rounded-full bg-amber-500/5 blur-3xl" />

          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-amber-500">
            {t("payment.error")}
          </p>

          <h1 className="mt-4 text-4xl font-black italic tracking-tight text-slate-900 md:text-6xl">
            {t("invoice.not.found")}
          </h1>

          <p className="mx-auto mt-5 max-w-lg font-medium leading-relaxed text-slate-500">
            {t("we.could.not.find.the.payment.invoice.required.to.verify.you")}
          </p>

          <Link href={`/book/${slug}`}>
            <Button className="mt-10 h-14 cursor-pointer rounded-2xl bg-green-500 px-10 font-black uppercase tracking-[0.15em] text-slate-900 shadow-lg hover:bg-green-400">
              {t("return")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
      <ZiniValidationProcessingClient invoiceId={invoiceId} slug={slug} />
    </div>
  );
}
