"use client";

import ClearFiltersButton from "@/components/shared/CearFiltersButton";
import DateRangeFilter from "@/components/shared/DateRangeFilter";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { useTranslations } from "next-intl";

const RefundsFilter = ({
  businesses,
  fields,
}: {
  businesses: { id: string; name: string; slug: string }[] | undefined;
  fields: { id: string; name: string }[] | undefined;
}) => {
  const t = useTranslations("player");
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 w-full overflow-hidden">
      {/* Row 1: Primary Search and Refresh */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 min-w-0">
          <SearchFilter
            paramName="searchTerm"
            placeholder={t("refundsSearch")}
            className="w-full max-w-md"
          />
        </div>
        <div className="flex-shrink-0">
          <RefreshButton />
        </div>
      </div>

      {/* Row 2: Backend Filterable Fields */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Date Range Filter (Handled cleanly inside standard flex flow) */}
        <div className="w-full sm:w-auto">
          <DateRangeFilter from="from" to="to" />
        </div>

        {/* Dynamic Responsive Subgrids for mobile view consistency */}
        <div className="grid grid-cols-1 gap-2 w-full sm:flex sm:flex-wrap sm:w-auto sm:items-center">
          <SelectFilter
            paramName="businessId"
            placeholder={t("venue")}
            options={(businesses || []).map((b) => ({
              label: b.name,
              value: b.id,
            }))}
          />

          <SelectFilter
            paramName="fieldId"
            placeholder={t("field")}
            options={(fields || []).map((f) => ({
              label: f.name,
              value: f.id,
            }))}
          />

          {/* CHANGED: removed the implicit "show all" state — only two options now,
              and defaultValue ensures "Due Refund" (false) is always set,
              so isOverPaidRefunded is always present in the URL/query params. */}
          {/* <SelectFilter
            paramName="isOverPaidRefunded"
            placeholder="Refund Status"
            defaultValue="false"
            options={[
              { label: "Due Refund", value: "false" },
              { label: "Refunded", value: "true" },
            ]}
          /> */}
        </div>

        {/* Clear All Filters */}
        <div className="w-full sm:w-auto sm:ml-auto pt-2 sm:pt-0">
          <ClearFiltersButton />
        </div>
      </div>
    </div>
  );
};

export default RefundsFilter;
