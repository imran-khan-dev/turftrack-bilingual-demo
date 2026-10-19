/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Building2, RotateCw, History } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  businesses: any[];
  selectedBusinessId: string;
  setSelectedBusinessId: (id: string) => void;
  activeTab: "PENDING" | "HISTORY";
  setActiveTab: (tab: "PENDING" | "HISTORY") => void;
  pendingCount: number;
  loading: boolean;
  onRefresh: () => void;
  managerView?: boolean;
}

export default function RefundFilters({
  businesses,
  selectedBusinessId,
  setSelectedBusinessId,
  activeTab,
  setActiveTab,
  pendingCount,
  loading,
  onRefresh,
  managerView = false,
}: FiltersProps) {
  const t = useTranslations("manager.refunds");
  const handleValueChange = (value: string) => {
    setSelectedBusinessId(value === "ALL_VENUES" ? "" : value);
  };

  const currentSelectValue = selectedBusinessId || "ALL_VENUES";

  return (
    <>
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {managerView ? t("controlPanel") : "Refund Control Panel"}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {managerView ? t("description") : "Process incoming cancellations and settle outstanding credit overrides."}
          </p>
        </div>

        {/* BUSINESS SELECT DROPDOWN */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-0.5 shadow-sm">
            <Building2 size={13} className="text-slate-400 shrink-0" />
            <Select value={currentSelectValue} onValueChange={handleValueChange}>
              <SelectTrigger className="h-8 border-0 bg-transparent p-0 pr-2 text-xs font-semibold text-slate-700 shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none w-[180px] cursor-pointer">
                <SelectValue placeholder={managerView ? t("allBusinesses") : "All Venues / Businesses"} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 rounded-xl shadow-md">
                <SelectItem 
                  value="ALL_VENUES" 
                  className="text-xs font-medium text-slate-700 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700"
                >
                  All Venues / Businesses
                </SelectItem>
                {businesses.map((business) => (
                  <SelectItem 
                    key={business.id} 
                    value={business.id}
                    className="text-xs font-medium text-slate-700 cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700"
                  >
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <RotateCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-px">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all px-1 cursor-pointer ${
            activeTab === "PENDING"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <span>{managerView ? t("pending") : "Pending Approvals"}</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 text-[10px] bg-emerald-50 border border-emerald-100 rounded-full font-bold">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all px-1 cursor-pointer ${
            activeTab === "HISTORY"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <History size={13} />
          <span>{managerView ? t("history") : "Settled Ledger"}</span>
        </button>
      </div>
    </>
  );
}
