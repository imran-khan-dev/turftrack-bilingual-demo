"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface ClearFiltersButtonProps {
  preserveParams?: string[];
  excludeFromCount?: string[];
  onBeforeClear?: () => boolean | void;
  onAfterClear?: () => void;
  variant?: "ghost" | "outline" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  showCount?: boolean;
}

const ClearFiltersButton = ({
  preserveParams = [],
  excludeFromCount = ["page", "limit", "sortBy", "sortOrder"],
  onBeforeClear,
  onAfterClear,
  variant = "outline", // Switched default to outline for an explicit structure boundary
  size = "sm",
  className = "",
  label = "Clear Filters",
  showCount = true,
}: ClearFiltersButtonProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Count active filters (excluding preserved params and excluded from count params)
  const activeFiltersCount = Array.from(searchParams.keys()).filter(
    (key) => !preserveParams.includes(key) && !excludeFromCount.includes(key),
  ).length;

  const handleClear = () => {
    if (onBeforeClear) {
      const shouldProceed = onBeforeClear();
      if (shouldProceed === false) return;
    }

    const params = new URLSearchParams();

    // Preserve specified params
    preserveParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        params.set(param, value);
      }
    });

    startTransition(() => {
      if (params.toString()) {
        router.push(`?${params.toString()}`);
      } else {
        router.push(window.location.pathname);
      }
    });

    onAfterClear?.();
  };

  // Don't render if no active filters are selected
  if (activeFiltersCount === 0) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClear}
      disabled={isPending}
      className={`h-9 px-3 text-xs font-bold border-slate-200 hover:border-red-200 bg-white hover:bg-red-50/50 text-slate-600 hover:text-red-600 rounded-xl transition-all shadow-sm flex items-center gap-1.5 ${className}`}
    >
      <X className="h-3.5 w-3.5 stroke-[2.5]" />
      <span>{label}</span>

      {showCount && (
        <span className="inline-flex items-center justify-center bg-green-50 text-green-700 font-extrabold px-1.5 py-0.5 rounded-md text-[10px] border border-green-200 min-w-[18px] h-4 ml-0.5">
          {activeFiltersCount}
        </span>
      )}
    </Button>
  );
};

export default ClearFiltersButton;
