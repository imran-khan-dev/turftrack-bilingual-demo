/* eslint-disable @typescript-eslint/no-explicit-any */
import { Barlow, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../../app/global.css";
import { Toaster } from "sonner";
import React from "react";
import PublicNavbar from "@/components/shared/PublicNavbar";
import PublicFooter from "@/components/shared/PublicFooter";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "@/i18n/server";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

const proximaNova = localFont({
  src: [
    {
      path: "../../../public/fonts/Proxima Nova Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Proxima Nova Semibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Proxima Nova Extrabold.ttf",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await getUserInfo();
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

        <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
          <LanguageSwitcher />
          <PublicNavbar user={isLoggedIn ? result.user : null} />

          <main className="grow">{children}</main>

          <PublicFooter />
        </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
