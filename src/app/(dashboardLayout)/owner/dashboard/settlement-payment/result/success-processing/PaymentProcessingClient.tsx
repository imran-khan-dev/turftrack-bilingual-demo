/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface Props {
  cartId: string;
  type: string;
  slug: string;
}

const MAX_RETRY = 10;
const INTERVAL = 3000;

export default function PaymentProcessingClient({ cartId, type, slug }: Props) {
  const t = useTranslations("owner.settlement");
  const router = useRouter();
  const retryRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cartId) {
      setError(t("invalidCartReference"));
      setLoading(false);
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "";
        const res = await fetch(
          `${baseUrl}/payment/${cartId}/payment-status?type=${type}`,
        );
        const data = await res.json();
        const status = data?.paymentStatus;

        if (status === "PAID") {
          router.replace(`/book/${cartId}/success?cartId=${cartId}`);
          return;
        }

        if (status === "FAILED") {
          router.replace(`/book/${cartId}/failed?cartId=${cartId}`);
          return;
        }

        retryRef.current += 1;

        if (retryRef.current >= MAX_RETRY) {
          setLoading(false);
          setError(
            t("processingDelayed"),
          );
        }
      } catch (err) {
        console.error("Network verification fallback error:", err);
        retryRef.current += 1;

        if (retryRef.current >= MAX_RETRY) {
          setLoading(false);
          setError(
            t("networkVerificationFailed"),
          );
        }
      }
    };

    // Immediate initial check invocation
    checkPaymentStatus();

    const interval = setInterval(() => {
      if (retryRef.current < MAX_RETRY) {
        checkPaymentStatus();
      }
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [cartId, type, router, t]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container flex justify-center items-center min-h-[85vh] mx-auto px-6 py-12">
        <Card className="max-w-lg w-full rounded-[3rem] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
          {/* TOP ACCENT GLOW */}
          <div
            className={`h-2 bg-linear-to-r ${
              error
                ? "from-amber-400 via-amber-500 to-rose-500"
                : "from-blue-400 via-emerald-400 to-green-500"
            }`}
          />

          <div className="p-10 text-center">
            {/* INTERACTIVE RADAR ANIMATION / LOADER INDICATOR */}
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

            {/* MESSAGING TARGETS BLOCK */}
            {loading && !error ? (
              <>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-3">
                  {t("verifyingPayment")}
                </h1>
                <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-8">
                  {t("paymentProviderVerificationDescription")}
                </p>

                {/* SECURE SUB-ACCENT BANNER */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center gap-2 text-slate-400">
                  <ShieldCheck size={16} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] font-mono">
                    {t("sessionReference", { reference: cartId.split("-")[0].toUpperCase() })}
                  </span>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-3">
                  {t("verificationDelayed")}
                </h1>
                <p className="text-slate-500 text-sm font-semibold leading-relaxed max-w-sm mx-auto mb-8">
                  {error}
                </p>

                {/* VISUAL DASHBOARD FALLBACK SYSTEM ACTION CARD */}
                <div className="space-y-3">
                  <Link href="/dashboard/my-bookings">
                    <Button className="w-full h-14 cursor-pointer rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black italic uppercase tracking-widest text-sm shadow-md">
                      {t("goToBookings")}
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </Link>

                  <Link
                    href={`/book/${slug}`}
                    className="block pt-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {t("returnToBooking")}
                  </Link>
                </div>
              </>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
