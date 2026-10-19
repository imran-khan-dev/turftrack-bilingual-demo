"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format, parseISO, subDays, startOfMonth, startOfYear } from "date-fns";
import {
  Calendar as CalendarIcon,
  X,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

interface DateRangeFilterProps {
  from?: string;
  to?: string;
  fromPlaceholder?: string;
  toPlaceholder?: string;
}

export default function DateRangeFilter({
  from = "from",
  to = "to",
  fromPlaceholder = "From Date",
  toPlaceholder = "To Date",
}: DateRangeFilterProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const fromVal = searchParams.get(from);
  const toVal = searchParams.get(to);

  const fromDate = fromVal ? parseISO(fromVal) : undefined;
  const toDate = toVal ? parseISO(toVal) : undefined;

  const handleApplyPreset = (
    fromDateObj: Date | null,
    toDateObj: Date | null,
  ) => {
    if (isPending) return;
    const params = new URLSearchParams(searchParams.toString());

    if (fromDateObj) params.set(from, format(fromDateObj, "yyyy-MM-dd"));
    else params.delete(from);

    if (toDateObj) params.set(to, format(toDateObj, "yyyy-MM-dd"));
    else params.delete(to);

    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const updateParam = (key: string, value: Date | undefined) => {
    if (isPending) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, format(value, "yyyy-MM-dd"));
      params.set("page", "1");
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const clearParam = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    if (isPending) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const presets = [
    { label: "Today", getRange: () => ({ from: new Date(), to: new Date() }) },
    {
      label: "Yesterday",
      getRange: () => ({
        from: subDays(new Date(), 1),
        to: subDays(new Date(), 1),
      }),
    },
    {
      label: "Last 7 Days",
      getRange: () => ({ from: subDays(new Date(), 6), to: new Date() }),
    },
    {
      label: "Last 15 Days",
      getRange: () => ({ from: subDays(new Date(), 14), to: new Date() }),
    },
    {
      label: "Last 30 Days",
      getRange: () => ({ from: subDays(new Date(), 29), to: new Date() }),
    },
    {
      label: "This Month",
      getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }),
    },
    {
      label: "This Year",
      getRange: () => ({ from: startOfYear(new Date()), to: new Date() }),
    },
  ];

  const hasActiveFilter = fromDate || toDate;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-1.5 sm:w-auto transition-opacity duration-200",
        isPending && "opacity-70 pointer-events-none",
      )}
    >
      {/* Container for Preset Trigger + From Input to sit side-by-side on mobile */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto">
        {/* Preset Quick Selection Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={isPending}
              className={cn(
                "h-9 px-2.5 rounded-xl border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 transition-colors flex-shrink-0",
                hasActiveFilter &&
                  "border-green-200 text-green-600 bg-white hover:bg-green-50/20",
              )}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
              ) : (
                <SlidersHorizontal className="h-3.5 w-3.5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="rounded-xl border-slate-200 shadow-md bg-white min-w-[140px] p-1"
          >
            {presets.map((preset) => (
              <DropdownMenuItem
                key={preset.label}
                disabled={isPending}
                onClick={() => {
                  const { from: f, to: t } = preset.getRange();
                  handleApplyPreset(f, t);
                }}
                className="text-xs text-slate-700 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900 px-2 py-1.5"
              >
                {preset.label}
              </DropdownMenuItem>
            ))}
            {hasActiveFilter && (
              <>
                <div className="h-px bg-slate-100 my-1" />
                <DropdownMenuItem
                  disabled={isPending}
                  onClick={() => handleApplyPreset(null, null)}
                  className="text-xs text-red-600 font-semibold rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-700 px-2 py-1.5"
                >
                  {t("clear.all.filters")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 1. From Date Selector Component */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={isPending}
              className={cn(
                "h-9 text-xs font-semibold bg-slate-50 border-slate-200 text-slate-700 rounded-xl px-3 hover:bg-slate-100/50 transition-colors flex items-center gap-2 flex-1 sm:flex-initial w-full sm:w-[135px] justify-between",
                fromDate && "border-green-200 bg-white",
              )}
            >
              <div className="flex items-center gap-2 truncate">
                <CalendarIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {fromDate
                    ? format(fromDate, "MMM dd, yyyy")
                    : fromPlaceholder}
                </span>
              </div>
              {fromDate && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={(e) => clearParam(e, from)}
                  className="p-0.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors shrink-0"
                >
                  <X className="h-3 w-3 stroke-[2.5]" />
                </button>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white border-slate-200 rounded-xl shadow-md"
            align="start"
          >
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => updateParam(from, date)}
              disabled={(date) => (toDate ? date > toDate : false)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Decorative arrow: visible on desktop, hidden on mobile */}
      <span className="hidden sm:inline text-slate-300 font-bold text-xs select-none">
        →
      </span>

      {/* 2. To Date Selector Component */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={isPending}
            className={cn(
              "h-9 text-xs font-semibold bg-slate-50 border-slate-200 text-slate-700 rounded-xl px-3 hover:bg-slate-100/50 transition-colors flex items-center gap-2 w-full sm:w-[135px] justify-between",
              toDate && "border-green-200 bg-white",
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {toDate ? format(toDate, "MMM dd, yyyy") : toPlaceholder}
              </span>
            </div>
            {toDate && (
              <button
                type="button"
                disabled={isPending}
                onClick={(e) => clearParam(e, to)}
                className="p-0.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md transition-colors shrink-0"
              >
                <X className="h-3 w-3 stroke-[2.5]" />
              </button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white border-slate-200 rounded-xl shadow-md"
          align="start"
        >
          <Calendar
            mode="single"
            selected={toDate}
            onSelect={(date) => updateParam(to, date)}
            disabled={(date) => (fromDate ? date < fromDate : false)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
