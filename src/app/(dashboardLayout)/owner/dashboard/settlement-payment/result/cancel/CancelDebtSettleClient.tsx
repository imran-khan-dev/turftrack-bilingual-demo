"use client";

import Link from "next/link";
import { AlertCircle, LayoutDashboard, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  trnxId?: string;
}

export default function CancelClientView({ trnxId }: Props) {
  const t = useTranslations("owner.settlement");
  return (
    <main className="flex min-h-[85vh] flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/20 bg-card p-6 sm:p-8 text-card-foreground shadow-xl backdrop-blur-sm transition-all dark:border-amber-500/30">
        {/* Status Icon Header */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 ring-8 ring-amber-500/5">
          <AlertCircle className="h-10 w-10 text-amber-500 animate-in zoom-in-50 duration-300" />
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("cancelledTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("cancelledDescription")}
          </p>
        </div>

        {/* Transaction Reference */}
        {trnxId && (
          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-3.5 text-center">
            <span className="text-xs text-muted-foreground">
              {t("cancelledSession")} {" "}
            </span>
            <code className="font-mono text-xs font-semibold text-foreground">
              {trnxId}
            </code>
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="mt-8 flex flex-col gap-3">
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
