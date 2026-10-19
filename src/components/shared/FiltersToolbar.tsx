"use client";

import ClearFiltersButton from "@/components/shared/CearFiltersButton";
import DateRangeFilter from "@/components/shared/DateRangeFilter";
import RefreshButton from "@/components/shared/RefreshButton";
import BusinessFilter, {
  AccessibleBusiness,
} from "@/components/shared/BusinessFilter";
import SearchFilter from "./SearchFilter";
import UsersFilter from "./UserFilters";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface FiltersToolbarProps {
  businesses?: AccessibleBusiness[];
  showDateRange?: boolean;
  showBusinessFilter?: boolean;
  showClearFilters?: boolean;
  showSearchFilters?: boolean;
  showUserFilters?: boolean;
  showRefresh?: boolean;
  dateFrom?: string;
  dateTo?: string;
  businessParamKey?: string;
  businessPlaceholder?: string;
}

const FiltersToolbar = ({
  businesses,
  showDateRange = true,
  showBusinessFilter = true,
  showClearFilters = true,
  showSearchFilters = true,
  showUserFilters = false,
  showRefresh = true,
  dateFrom = "from",
  dateTo = "to",
  businessParamKey = "businessId",
  businessPlaceholder,
}: FiltersToolbarProps) => {
  const router = useRouter();
  const t = useTranslations("common");

  // Business filter needs actual businesses to render — even if the caller
  // asked for it, there's nothing useful to show without data.

  const shouldShowBusinessFilter =
    showBusinessFilter && businesses && businesses.length > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 w-full overflow-hidden">
      <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center">
        {showDateRange && (
          <div className="w-full sm:w-auto">
            <DateRangeFilter from={dateFrom} to={dateTo} />
          </div>
        )}

        {shouldShowBusinessFilter && (
          <div className="grid grid-cols-1 gap-2 w-full sm:grid-cols-2 md:flex md:flex-wrap md:w-auto md:items-center">
            <BusinessFilter
              businesses={businesses!}
              paramKey={businessParamKey}
              placeholder={businessPlaceholder}
            />
          </div>
        )}

        {showUserFilters && (
          <div className="w-full sm:w-auto">
            <UsersFilter />
          </div>
        )}

        {showSearchFilters && (
          <div className="w-full sm:w-auto">
            <SearchFilter
              paramName="searchTerm"
              placeholder={t("search.reference.phone.trx.id")}
              className="w-full max-w-md"
            />
          </div>
        )}

        {showClearFilters && (
          <div className="w-full md:w-auto md:ml-auto pt-1 md:pt-0">
            <ClearFiltersButton onAfterClear={() => router.refresh()} />
          </div>
        )}

        {showRefresh && (
          <div className="flex-shrink-0">
            <RefreshButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersToolbar;
