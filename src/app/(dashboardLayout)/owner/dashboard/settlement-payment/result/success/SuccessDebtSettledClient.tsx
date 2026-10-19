"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Check, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  trnxId?: string;
}

export default function SuccessDebtSettled({ trnxId }: Props) {
  const t = useTranslations("owner.settlement");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!trnxId) return;
    navigator.clipboard.writeText(trnxId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex min-h-[85vh] flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/20 bg-card p-6 sm:p-8 text-card-foreground shadow-xl backdrop-blur-sm transition-all dark:border-emerald-500/30">
        {/* Status Icon Header */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-8 ring-emerald-500/5">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 animate-in zoom-in-50 duration-300" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("successTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("successDescription")}
          </p>
        </div>

        {/* Transaction ID Details Box */}
        {trnxId && (
          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-3.5 sm:p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("transactionReference")}
            </span>
            <div className="mt-1 flex items-center justify-between gap-2">
              <code className="font-mono text-sm font-semibold text-foreground">
                {trnxId}
              </code>
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background p-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                title={t("copyTransactionId")}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/owner/dashboard/wallet"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.98] transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t("backToWallet")}
          </Link>
        </div>
      </div>
    </main>
  );
}
