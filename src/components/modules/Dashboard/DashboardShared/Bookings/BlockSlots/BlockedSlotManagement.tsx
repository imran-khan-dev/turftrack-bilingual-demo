/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Ban,
  RefreshCw,
  Calendar as CalendarIcon,
  Layers,
  Building2,
} from "lucide-react";

import BlockSlotsForm from "./BlockSlotsForm";
import BlockedSlotsTable from "./BlockedSlotsTable";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import { getBusinessData } from "@/services/business/getBusinessData";
import { getBookings } from "@/services/booking/getBookings";
import { releaseBookingSlot } from "@/services/booking/releaseBookingSlot";
import { formatLocalDate } from "@/utils/formatLocalDate";

interface Props {
  managerView?: boolean;
  ownerView?: boolean;
  user: {
    businesses?: Array<{ id: string; name: string; slug: string }>;
    [key: string]: any;
  };
}

export default function BlockedSlotsManagement({ user, managerView = false, ownerView = false }: Props) {
  const t = useTranslations("manager.blockSlots");
  const translatedView = managerView || ownerView;
  const label = (key: string, fallback: string) => translatedView ? t(key as never) : fallback;
  const businessesList = useMemo(() => getAccessibleBusinesses(user), [user]);

  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState<string>(
    businessesList[0]?.slug || "",
  );
  const [fields, setFields] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [blockedBookings, setBlockedBookings] = useState<any[]>([]);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const formattedDateString = useMemo(() => {
    return formatLocalDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedBusinessSlug) return;
    setIsLoadingBusiness(true);
    const fetchBusinessData = async () => {
      const business = await getBusinessData(selectedBusinessSlug);
      if (business) {
        const bizFields = business.fields || [];
        setFields(bizFields);
        setSelectedFieldId(bizFields[0]?.id || "");
      }
    };
    fetchBusinessData();
    setIsLoadingBusiness(false);
  }, [selectedBusinessSlug]);

  const fetchBlockedSlots = useCallback(async () => {
    if (!selectedFieldId) return;

    try {
      setIsLoadingList(true);

      const json = await getBookings({
        dateField: "createdAt",
        limit: 1000,
        status: "BLOCKED",
      });

      if (json.success) {
        const bookingsData = json.data?.formattedData || json.data || [];

        setBlockedBookings(bookingsData);
      } else {
        console.error("Backend error:", json.message);
      }
    } catch (err) {
      console.error("Network or unexpected error:", err);
    } finally {
      setIsLoadingList(false);
    }
  }, [selectedFieldId]);

  useEffect(() => {
    fetchBlockedSlots();
  }, [fetchBlockedSlots]);

  const handleQuickRelease = async (id: string) => {
    try {
      setActionId(id);

      const result = await releaseBookingSlot(id);

      if (result.success) {
        toast.success(label("releaseSuccess", "Time slot released successfully."));

        setBlockedBookings((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Unexpected client-side hook failure:", err);
      toast.error(
        label("releaseError", "An unexpected error occurred while processing your request."),
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="w-full space-y-6 font-sans text-slate-700">
      {/* HEADER SECTION */}
      <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
        <div className="mb-5">
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Ban size={16} className="text-slate-400" /> {label("title", "Administrative Slot Management")}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 normalization-prose">
            {label("description", "Manually force block court schedules or perform rapid inline releases.")}
          </p>
        </div>

        {/* REUSABLE SELECTION CONTROLS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          {/* SELECT BUSINESS */}
          <div className="space-y-1.5 flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <Building2 size={13} className="text-slate-400" /> {label("selectBusiness", "Select Business")}
            </span>
            <Select
              value={selectedBusinessSlug}
              onValueChange={setSelectedBusinessSlug}
            >
              <SelectTrigger className="w-full h-10 px-3 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 font-medium transition-all focus:ring-1 focus:ring-emerald-500 outline-none">
                <SelectValue placeholder={label("selectBusiness", "Select business")} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 shadow-md rounded-xl">
                {businessesList.map((b) => (
                  <SelectItem
                    key={b.id}
                    value={b.slug}
                    className="text-xs py-2 font-semibold cursor-pointer focus:bg-slate-50 focus:text-emerald-700"
                  >
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SELECT FIELD / COURT */}
          <div className="space-y-1.5 flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <Layers size={13} className="text-slate-400" /> {label("selectField", "Select Court / Field")}
            </span>
            <Select
              value={selectedFieldId}
              disabled={isLoadingBusiness || fields.length === 0}
              onValueChange={setSelectedFieldId}
            >
              <SelectTrigger className="w-full h-10 px-3 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 font-medium transition-all focus:ring-1 focus:ring-emerald-500 outline-none disabled:opacity-50">
                <SelectValue
                  placeholder={
                    isLoadingBusiness ? label("loadingFields", "Loading fields...") : label("selectField", "Select field")
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 shadow-md rounded-xl">
                {fields.map((f) => (
                  <SelectItem
                    key={f.id}
                    value={f.id}
                    className="text-xs font-semibold py-2 cursor-pointer focus:bg-slate-50 focus:text-emerald-700"
                  >
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* SELECT TARGET DATE */}
          <div className="space-y-1.5 flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
              <CalendarIcon size={13} className="text-slate-400" /> {label("targetDate", "Select Target Date")}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full h-10 px-3 flex items-center justify-between text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 font-medium transition-all focus:ring-1 focus:ring-emerald-500 outline-none text-left cursor-pointer"
                >
                  <span>
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <CalendarIcon size={14} className="text-slate-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border bg-white border-slate-200 shadow-md rounded-xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* LOWER PANEL WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <BlockSlotsForm
            selectedFieldId={selectedFieldId}
            formattedDate={formattedDateString}
            onBlockSuccess={fetchBlockedSlots}
            managerView={translatedView}
          />
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {label("tracker", "Live Blocked Slots Tracker")}
            </span>
            <button
              onClick={fetchBlockedSlots}
              disabled={isLoadingList}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={isLoadingList ? "animate-spin" : ""}
              />
            </button>
          </div>

          <BlockedSlotsTable
            blockedBookings={blockedBookings || []}
            isLoadingList={isLoadingList}
            actionId={actionId}
            onRelease={handleQuickRelease}
            managerView={translatedView}
          />
        </div>
      </div>
    </div>
  );
}
