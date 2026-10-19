"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface SuccessOverlayProps {
  referenceId: string;
  onReset: () => void;
  managerView?: boolean;
}

export default function SuccessOverlay({
  referenceId,
  onReset,
  managerView = false,
}: SuccessOverlayProps) {
  const t = useTranslations("manager.manualBooking");
  return (
    <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
        <Check size={26} className="stroke-[3]" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {managerView ? t("successTitle") : "Booking Confirmed Successfully"}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          {managerView ? t("successDescription") : "The time slot reservation was validated and saved securely in your system ledger."}
        </p>
      </div>

      <div className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-1 font-mono text-xs">
        <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider block">
          {managerView ? t("bookingReference") : "Booking Reference ID"}
        </span>
        <span className="text-base font-bold text-zinc-800 dark:text-zinc-100 select-all tracking-wide">
          {referenceId}
        </span>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="px-5 h-10 bg-zinc-900 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer uppercase tracking-wider"
      >
        {managerView ? t("createAnother") : "Create Another Booking"}
      </button>
    </div>
  );
}
