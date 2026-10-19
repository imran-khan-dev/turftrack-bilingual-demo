"use client";

import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

interface RefreshButtonProps {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  showLabel?: boolean;
}

const RefreshButton = ({
  size = "default",
  variant = "outline", // Swapped default variant to outline for a clean control feel
  showLabel = true,
}: RefreshButtonProps) => {
  const router = useRouter();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.push(window.location.pathname + window.location.search);
    });
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleRefresh}
      disabled={isPending}
      className="h-9 px-3 text-xs cursor-pointer font-bold bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl focus-visible:ring-1 focus-visible:ring-green-400 focus-visible:border-green-400 transition-all shadow-sm flex items-center gap-1.5 shrink-0"
    >
      <RefreshCcw
        className={`h-3.5 w-3.5 stroke-[2.5] text-slate-500 transition-transform ${
          isPending ? "animate-spin text-green-600" : ""
        }`}
      />
      {showLabel && <span>{t("refresh")}</span>}
    </Button>
  );
};

export default RefreshButton;
