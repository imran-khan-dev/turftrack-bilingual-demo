import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CreateBookingClient from "./CreateBookingClient";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { PublicBusiness } from "@/types/business";
import { getBusinessData } from "@/services/business/getBusinessData";
import { Building2, Home } from "lucide-react";
import { getTranslations } from "@/i18n/server";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessData(slug);
  const t = await getTranslations("booking");

  if (!business) {
    return { title: t("turf.business.not.found") };
  }

  const businessName = (business.name || "Turf Business").toUpperCase();

  return {
    title: t("createPageTitle", { businessName }),
    description:
      business.aboutDesc ||
      t("createPageDescription", { businessName: business.name || "this turf" }),
    openGraph: {
      images: business.heroImage ? [business.heroImage] : [],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CreateBookingPage({ params }: PageProps) {
  const t = await getTranslations("booking");
  const { slug } = await params;

  const business = await getBusinessData(slug);

  const result = await getUserInfo();

  const user =
    result.status !== "error" && result.status !== "unauthenticated"
      ? result.user
      : null;

  const isAuthority = business?.isManager || business?.isOwner;

  if (!business || business.isActive === "INACTIVE") {
    return (
      <div className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-[#FBFCFD] px-4 py-12 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center">
          {/* Soft Icon Badge */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100/80 border border-slate-200/60 text-slate-500 shadow-sm">
            <Building2 className="h-10 w-10 stroke-[1.5]" />
          </div>

          {/* Heading */}
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t("turf.business.not.found")}
          </h1>

          {/* Description */}
          <p className="mb-8 text-sm sm:text-base font-normal leading-relaxed text-slate-600">
            {t("we.couldn.t.find.the.turf.business.you.were.looking.for.or.i")}
          </p>

          {/* Action Button */}
          <Link href="/">
            <Button className="h-10 px-5 text-sm font-medium bg-[#1D293D] hover:bg-[#0f172a] text-white shadow-sm transition-all flex items-center gap-2 rounded-md border border-slate-800">
              <Home className="h-4 w-4" />
              {t("goBackHome")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const fields = business?.fields || [];

  return (
    <CreateBookingClient
      business={business as PublicBusiness}
      fields={fields}
      user={user}
      isAuthority={isAuthority}
    />
  );
}
