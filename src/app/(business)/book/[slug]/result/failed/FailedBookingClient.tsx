/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, PhoneCall, RefreshCw, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

type Props = {
  businessData: {
    id?: string;
    name?: string;
    slug?: string;
    logo?: string;
  };
};

export default function FailedBookingClient({ businessData }: Props) {
  const t = useTranslations("booking");
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[550px] w-[550px] bg-red-500/5 blur-3xl rounded-full" />
      </div>

      <main className="container flex justify-center mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="relative w-full max-w-xl"
        >
          <Card className="rounded-[3.5rem] border-none bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] overflow-hidden">
            {/* TOP STRIP */}
            <div className="h-3 bg-gradient-to-r from-red-500 via-orange-400 to-amber-400" />

            <div className="p-10 md:p-14 text-center">
              {/* ICON */}
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.1,
                  duration: 0.4,
                }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-125" />

                  <div className="relative bg-red-50 border border-red-100 h-32 w-32 rounded-full flex items-center justify-center">
                    <AlertTriangle size={70} className="text-red-500" />
                  </div>
                </div>
              </motion.div>

              {/* TITLE */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15,
                }}
              >
                <p className="text-[11px] tracking-[0.35em] font-black uppercase text-red-500 mb-3">
                  {t("paymentFailedLabel")}
                </p>

                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                  {t("transaction")}
                  <br />
                  {t("unsuccessful")}
                </h1>
              </motion.div>

              {/* DESCRIPTION */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.22,
                }}
                className="mt-6 text-slate-500 font-medium leading-7 text-sm md:text-base max-w-md mx-auto"
              >
                {t("paymentFailedDescription", { businessName: businessData.name || "" })}
              </motion.p>

              {/* INFO BOX */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.28,
                }}
                className="mt-8 bg-slate-50 border border-slate-100 rounded-[2rem] p-5 flex items-start gap-4 text-left"
              >
                <div className="h-11 w-11 rounded-full bg-white border border-slate-100 flex items-center justify-center flex-shrink-0">
                  <Wallet size={18} className="text-slate-500" />
                </div>

                <div>
                  <p className="font-black uppercase text-xs tracking-wide text-slate-900">
                    {t("possibleReasons")}
                  </p>

                  <ul className="mt-2 space-y-2 text-sm text-slate-500 leading-6">
                    <li className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      {t("insufficientBalance")}
                    </li>

                    <li className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      {t("paymentGatewayInterruption")}
                    </li>

                    <li className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      {t("transactionTimeoutRejection")}
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.38,
                }}
                className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <Link href={`/book/${businessData.slug}`}>
                  <Button className="w-full h-16 rounded-2xl bg-green-500 hover:bg-green-400 text-slate-900 font-black italic uppercase tracking-wide shadow-[0_0_25px_rgba(34,197,94,0.2)] hover:shadow-[0_0_35px_rgba(34,197,94,0.35)] transition-all cursor-pointer">
                    {t("bookAgain")}
                    <RefreshCw size={17} className="ml-2" />
                  </Button>
                </Link>

                <Link href={`/support`}>
                  <Button
                    variant="outline"
                    className="w-full h-16 rounded-2xl border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-black italic uppercase tracking-wide cursor-pointer"
                  >
                    {t("contactSupport")}
                    <PhoneCall size={17} className="ml-2" />
                  </Button>
                </Link>
              </motion.div>

              {/* FOOTER NOTE */}
              <p className="mt-8 text-[11px] uppercase tracking-[0.25em] text-slate-300 font-black">
                {t("securePaymentGateway")}
              </p>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
