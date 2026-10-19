/* eslint-disable @typescript-eslint/no-explicit-any */
import { Barlow, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../../../global.css";
import { Toaster } from "sonner";
import React from "react";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { BusinessNavbar } from "@/components/modules/Business/Navbar/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Business } from "@/types/business";
import { BusinessFooter } from "@/components/modules/Business/Footer/BusinessFooter";
import { getBusinessData } from "@/services/business/getBusinessData";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "@/i18n/server";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

export const dynamic = "force-dynamic";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

const proximaNova = localFont({
  src: [
    {
      path: "../../../../../public/fonts/Proxima Nova Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../../public/fonts/Proxima Nova Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../../public/fonts/Proxima Nova Extrabold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-proxima",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function BookingLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  const { slug } = await params;
  const t = await getTranslations("booking");

  const [result, business] = await Promise.all([
    getUserInfo(),
    getBusinessData(slug),
  ]);
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  const isLoggedIn =
    result.status !== "error" &&
    result.status !== "unauthenticated" &&
    result.user &&
    result.user.id !== undefined;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlow.variable} ${proximaNova.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
        {!business ? (
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
        ) : (
          <>
            <LanguageSwitcher />
            {/* Global Toaster */}
            <Toaster
              position="top-center"
              richColors
              closeButton
              toastOptions={{
                style: {
                  zIndex: 99999,
                },
              }}
            />
            <BusinessNavbar
              businessInfo={business as Business}
              user={isLoggedIn ? result.user : null}
            />
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
              <main className="grow">{children}</main>
              <BusinessFooter businessInfo={business} />
            </div>
          </>
        )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
