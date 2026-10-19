/* eslint-disable @typescript-eslint/no-explicit-any */
import { Barlow, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "../../app/global.css";
import { Toaster } from "sonner";
import React from "react";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardShared/Others/DashboardSidebar";
import DashboardNavbar from "@/components/modules/Dashboard/DashboardShared/Others/DashboardNavbar";
import GlobalTopLoader from "@/components/modules/Dashboard/DashboardShared/Others/GlobalTopLoader";
import ServerError from "@/components/modules/ServerError";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "@/i18n/server";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
});

export const dynamic = "force-dynamic";

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

  return (
      <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${barlow.variable} ${proximaNova.variable} antialiased`}
      >
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{ style: { zIndex: 99999 } }}
        />

        <NextIntlClientProvider locale={locale} messages={messages}>
        {result.status === "error" ? (
          <ServerError />
        ) : result.status === "unauthenticated" ? (
          redirect("/login")
        ) : (
          <NotificationsProvider userId={result.user.id} playerView={result.user.role === "PLAYER"}>
            <div className="min-h-screen bg-[#F8FAFC] flex">
              <DashboardSidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <LanguageSwitcher />
                <DashboardNavbar />
                <GlobalTopLoader />
                <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
                  <div className="">{children}</div>
                </main>
              </div>
            </div>
          </NotificationsProvider>
        )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
