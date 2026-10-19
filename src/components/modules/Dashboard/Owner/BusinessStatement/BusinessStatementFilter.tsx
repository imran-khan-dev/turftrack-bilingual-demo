"use client";

import ClearFiltersButton from "@/components/shared/CearFiltersButton";
import DateRangeFilter from "@/components/shared/DateRangeFilter";
import RefreshButton from "@/components/shared/RefreshButton";
import SelectFilter from "@/components/shared/SelectFilter";
import { useTranslations } from "next-intl";

export interface AccessibleBusiness {
  id: string;
  name: string;
  slug: string;
  refundAllowed: boolean;
  refundPercent: string | number;
}

interface BusinessStatementFilterProps {
  businesses: AccessibleBusiness[];
}

const BusinessStatementFilter = ({
  businesses,
}: BusinessStatementFilterProps) => {
  const t = useTranslations("owner.finance");
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 w-full overflow-hidden">
      {/* Row 1: Primary Search and Refresh */}
      <div className="flex items-center gap-2 w-full">
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
        </div>

        {/* Clear All Filters */}
        <div className="w-full sm:w-auto sm:ml-auto pt-2 sm:pt-0">
          <ClearFiltersButton />
        </div>
      </div>
    </div>
  );
};

export default BusinessStatementFilter;
