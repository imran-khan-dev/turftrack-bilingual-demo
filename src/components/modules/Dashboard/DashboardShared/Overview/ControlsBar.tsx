/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LayoutGrid, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO, addDays, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface Business {
  id: string;
  name: string;
}

interface ControlsBarProps {
  businesses: Business[];
  selectedBusiness: string;
  setSelectedBusiness: (v: string) => void;
  preset: string;
  handlePresetChange: (v: string) => void;
  from: string;
  to: string;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  setPreset: (v: string) => void;
  today: string;
  yesterday: string; // Added to interface safely
  managerView?: boolean;
}

const MAX_RANGE_DAYS = 90;

export default function ControlsBar({
  businesses,
  selectedBusiness,
  setSelectedBusiness,
  preset,
  handlePresetChange,
  from,
  to,
  setFrom,
  setTo,
  setPreset,
  today,
  yesterday,
  managerView = false,
}: ControlsBarProps) {
  const t = useTranslations("manager.overview");
  const label = (key: string, fallback: string) => managerView ? t(key as never) : fallback;
  const fromDate = from ? parseISO(from) : undefined;
  const toDate = to ? parseISO(to) : undefined;
  const todayDate = parseISO(today);

  const formatToISOString = (date: Date) => format(date, "yyyy-MM-dd");

  // Local wrapper to intercept selection and safely update states
  const onPresetValueChange = (value: string) => {
    if (value === "yesterday") {
      setFrom(yesterday);
      setTo(yesterday);
      setPreset("yesterday");
    } else {
      handlePresetChange(value);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Business Dropdown */}
        <div className="relative flex items-center w-full sm:w-auto">
          <LayoutGrid
            size={14}
            className="absolute left-3.5 text-slate-400 pointer-events-none z-10"
          />
          <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
            <SelectTrigger className="h-10 pl-10 pr-4 w-full sm:w-[200px] text-xs font-bold text-slate-700 bg-slate-50 border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer">
              <SelectValue placeholder={label("selectBusiness", "Select Venue")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white border-slate-200 shadow-md">
              <SelectItem
                value="all"
                className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
              >
                {label("allBusinesses", "All Venues Combined")}
              </SelectItem>
              {businesses.map((b) => (
                <SelectItem
                  key={b.id}
                  value={b.id}
                  className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
                >
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Range Presets Dropdown */}
        <div className="relative flex items-center w-full sm:w-auto">
          <CalendarIcon
            size={14}
            className="absolute left-3.5 text-slate-400 pointer-events-none z-10"
          />
          {/* Linked value system to use local abstraction wrapper */}
          <Select value={preset} onValueChange={onPresetValueChange}>
            <SelectTrigger className="h-10 pl-10 pr-4 w-full sm:w-[160px] text-xs font-bold text-slate-700 bg-slate-50 border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer">
              <SelectValue placeholder={label("selectRange", "Select Range")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white border-slate-200 shadow-md">
              <SelectItem
                value="today"
                className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
              >
                {label("today", "Today")}
              </SelectItem>
              <SelectItem
                value="yesterday"
                className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
              >
                {label("yesterday", "Yesterday")}
              </SelectItem>
              <SelectItem
                value="7"
                className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
              >
                {label("last7", "Last 7 Days")}
              </SelectItem>
              <SelectItem
                value="15"
                className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
              >
                {label("last15", "Last 15 Days")}
              </SelectItem>
              <SelectItem
                value="30"
                className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
              >
                {label("last30", "Last 30 Days")}
              </SelectItem>
              <SelectItem
                value="90"
                className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
              >
                {label("last90", "Last 90 Days")}
              </SelectItem>
              <SelectItem
                value="custom"
                className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
              >
                {label("customRange", "Custom Range")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date-picker Section */}
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 p-1 rounded-xl self-start md:self-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-start px-2.5 py-0.5 h-auto hover:bg-slate-100/70 font-normal rounded-lg",
              )}
            >
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                {label("startDate", "Start Date")}
              </span>
              <span className="text-[11px] font-bold text-slate-600 mt-0.5">
                {fromDate ? format(fromDate, "LLL dd, yyyy") : label("pickDate", "Pick date")}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-white w-auto p-0 rounded-xl border-slate-200 shadow-md"
            align="start"
          >
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                if (date) {
                  setFrom(formatToISOString(date));
                  setPreset("custom");
                }
              }}
              disabled={(date) =>
                (toDate ? isAfter(date, toDate) : false) ||
                (toDate
                  ? isBefore(date, addDays(toDate, -MAX_RANGE_DAYS))
                  : false) ||
                isAfter(date, todayDate)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-slate-300 font-bold text-xs self-end mb-2 select-none">
          →
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-start px-2.5 py-0.5 h-auto hover:bg-slate-100/70 font-normal rounded-lg",
              )}
            >
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                {label("endDate", "End Date")}
              </span>
              <span className="text-[11px] font-bold text-slate-600 mt-0.5">
                {toDate ? format(toDate, "LLL dd, yyyy") : label("pickDate", "Pick date")}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="bg-white w-auto p-0 rounded-xl border-slate-200 shadow-md"
            align="end"
          >
            <Calendar
              mode="single"
              className="rounded-xs"
              selected={toDate}
              onSelect={(date) => {
                if (date) {
                  setTo(formatToISOString(date));
                  setPreset("custom");
                }
              }}
              disabled={(date) =>
                (fromDate ? isBefore(date, fromDate) : false) ||
                (fromDate
                  ? isAfter(date, addDays(fromDate, MAX_RANGE_DAYS))
                  : false) ||
                isAfter(date, todayDate)
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
