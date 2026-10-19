"use client";

import Link from "next/link";
import {
  XCircle,
  RotateCcw,
  HelpCircle,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  trnxId?: string;
  message?: string;
}

export default function FailedBookingClient({ trnxId, message }: Props) {
  const t = useTranslations("owner.settlement");
  return (
    <main className="flex min-h-[85vh] flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-rose-500/20 bg-card p-6 sm:p-8 text-card-foreground shadow-xl backdrop-blur-sm transition-all dark:border-rose-500/30">
        {/* Status Icon Header */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 ring-8 ring-rose-500/5">
          <XCircle className="h-10 w-10 text-rose-500 animate-in zoom-in-50 duration-300" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("failedTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("failedDescription")}
          </p>
        </div>

        {/* Failure Message Notice */}
        {message && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-left text-xs text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
            <div>
              <span className="font-semibold">{t("reason")}</span> {message}
            </div>
          </div>
        )}

        {/* Transaction Reference */}
        {trnxId && (
          <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3 text-center">
            <span className="text-xs text-muted-foreground">
              {t("reference")} {" "}
            </span>
            <code className="font-mono text-xs font-semibold text-foreground">
              {trnxId}
            </code>
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="mt-8 flex flex-col gap-3">
          {/* Primary Action: Try Again */}
          <Link
            href="/owner/dashboard/wallet"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 active:scale-[0.98] transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            {t("tryAgain")}
          </Link>

          {/* Secondary Action: Contact Support */}
          <Link
            href="/contact"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent active:scale-[0.98] transition-all"
          >
            <HelpCircle className="h-4 w-4" />
            {t("contactSupport")}
          </Link>

          {/* Tertiary Action: Return to Wallet */}
          <Link
            href="/owner/dashboard/wallet"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent active:scale-[0.98] transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t("returnWallet")}
          </Link>
        </div>
      </div>
    </main>
  );
}
