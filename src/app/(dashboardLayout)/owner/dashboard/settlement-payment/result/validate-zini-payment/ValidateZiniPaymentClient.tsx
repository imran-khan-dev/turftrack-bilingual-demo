/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { validateZiniPay } from "@/services/payment/validateZiniPayment";
import { useTranslations } from "next-intl";

interface Props {
  invoiceId: string;
}

export default function ValidateZiniDebtSettlementClient({ invoiceId }: Props) {
  const t = useTranslations("owner.settlement");
  const hasValidated = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasValidated.current) return;

    if (!invoiceId) {
      setError(t("invalidPaymentReference"));
      setLoading(false);
      return;
    }

    hasValidated.current = true;

    const validatePayment = async () => {
      try {
        const result = await validateZiniPay(invoiceId);

        /**
         * BACKEND VALIDATION FAILED
         */
        if (!result.success) {
          setError(
            result.error || t("couldNotVerifyPayment"),
          );

          setLoading(false);
          return;
        }

        /**
         * BACKEND VALIDATION SUCCESS
         *
         * Backend returns the final frontend redirect.
         */
        const redirect = result.data?.redirect;

        if (!redirect) {
          throw new Error(
            t("verifiedWithoutRedirect"),
          );
        }

        window.location.replace(redirect);
      } catch (error: any) {
        console.error("ZiniPay settlement validation error:", error);

        setError(error?.message || t("unableToVerifyPayment"));

        setLoading(false);
      }
    };

    validatePayment();
  }, [invoiceId, t]);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || "8801XXXXXXXXX";

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  // Show refund/support section only for amount mismatch errors
  const isAmountMismatch =
    error?.toLowerCase().includes("underpayment") ||
    error?.toLowerCase().includes("overpayment");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container flex items-center justify-center min-h-[85vh] mx-auto px-6 py-12">
        <Card className="max-w-lg w-full rounded-[3rem] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
          {/* TOP ACCENT */}
          <div
            className={`h-2 bg-linear-to-r ${
              error
                ? "from-amber-400 via-amber-500 to-rose-500"
                : "from-blue-400 via-emerald-400 to-green-500"
            }`}
          />

          <div className="p-10 text-center">
            {/* ICON */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {loading && !error ? (
                  <>
                    <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full animate-pulse" />

                    <div className="relative h-28 w-28 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Loader2
                        size={48}
                        className="text-slate-700 animate-spin"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />

                    <div className="relative h-28 w-28 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center">
                      <AlertCircle size={54} className="text-amber-500" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* PROCESSING */}
            {loading && !error ? (
              <>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-3">
                  {t("verifyingTitle")}
                </h1>

                <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-8">
                  {t("verifyingDescription")}
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-2 text-slate-400">
                  <ShieldCheck size={16} className="text-slate-400" />

                  <span className="text-[10px] font-black uppercase tracking-[0.15em] font-mono">
                    {t("paymentReference", { reference: invoiceId.split("-")[0].toUpperCase() })}
                  </span>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-3">
                  {t("verificationIssue")}
                </h1>

                <p className="text-slate-500 text-sm font-semibold leading-relaxed max-w-sm mx-auto mb-6">
                  {error}
                </p>

                {/* REFUND / SUPPORT */}
                {isAmountMismatch && (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 mb-6">
                    <div className="flex justify-center mb-2">
                      <MessageCircle size={20} className="text-amber-600" />
                    </div>

                    <p className="text-sm font-bold text-slate-700 mb-2">
                      {t("deductedHelp")}
                    </p>

                    <p className="text-xs leading-relaxed text-slate-500 mb-4">
                      {t("whatsappHelp")}
                    </p>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full h-12 cursor-pointer rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold">
                        <MessageCircle size={18} className="mr-2" />
                        {t("contactWhatsApp")}
                      </Button>
                    </a>

                    <p className="text-[11px] text-slate-400 mt-3">
                      {t("whatsapp", { phone: `+${whatsappNumber}` })}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
