"use client";

import ClearFiltersButton from "@/components/shared/CearFiltersButton";
import DateRangeFilter from "@/components/shared/DateRangeFilter";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { useTranslations } from "next-intl";

type UserRole = "SUPER_ADMIN" | "ADMIN" | "OWNER" | "MANAGER" | "PLAYER";

const BookingsFilter = ({
  businesses,
  fields,
  role,
}: {
  businesses: { id: string; name: string; slug: string }[] | undefined;
  fields: { id: string; name: string }[] | undefined;
  role: UserRole;
}) => {
  const playerT = useTranslations("player.bookingsList");
  // Derive admin status directly from role — no separate prop needed
  const isAdmin = role === "SUPER_ADMIN" || role === "ADMIN";
  const isPlayer = role === "PLAYER";
  const playerLabel = (key: "confirmed" | "cancelled" | "completed" | "pendingGame" | "noShow" | "refunded" | "rescheduled" | "unpaid" | "partial" | "paid" | "failed" | "app" | "manual", fallback: string) => isPlayer ? playerT(key) : fallback;

  // Base status options
  const allStatusOptions = [
    { label: playerLabel("confirmed", "Confirmed"), value: "CONFIRMED" },
    { label: playerLabel("cancelled", "Cancelled"), value: "CANCELLED" },
    { label: playerLabel("completed", "Completed"), value: "COMPLETED" },
    { label: playerLabel("pendingGame", "Pending Game"), value: "PENDING_GAME" },
    { label: playerLabel("noShow", "No Show"), value: "NO_SHOW" },
    { label: playerLabel("refunded", "Refunded"), value: "REFUNDED" },
    { label: playerLabel("rescheduled", "Rescheduled"), value: "RESCHEDULED" },
    { label: "For Review", value: "FOR_REVIEW" },
    { label: "For Refund", value: "FOR_REFUND" },
  ];

  // "For Review" and "For Refund" are internal-facing statuses.
  // Hide them only for PLAYER; OWNER/MANAGER/ADMIN/SUPER_ADMIN can still see them.
  const statusOptions = isPlayer
    ? allStatusOptions.filter(
        (option) =>
          option.value !== "FOR_REVIEW" && option.value !== "FOR_REFUND",
      )
    : allStatusOptions;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 w-full overflow-hidden">
      {/* Row 1: Primary Search and Refresh */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 min-w-0">
          <SearchFilter
            paramName="searchTerm"
            placeholder={isPlayer ? playerT("search") : "Search Reference, Phone, Trx ID..."}
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
            placeholder={isPlayer ? playerT("venue") : "Venue"}
            options={(businesses || []).map((b) => ({
              label: b.name,
              value: b.id,
            }))}
          />

          <SelectFilter
            paramName="fieldId"
            placeholder={isPlayer ? playerT("field") : "Field"}
            options={(fields || []).map((f) => ({
              label: f.name,
              value: f.id,
            }))}
          />

          {/* Show only to Admin and Super Admin roles */}
          {isAdmin && (
            <SelectFilter
              paramName="dateField"
              placeholder="Date Field"
              options={[
                { label: "Created", value: "createdAt" },
                { label: "Cancelled", value: "cancelledAt" },
                { label: "Completed", value: "completedAt" },
                { label: "Game Start", value: "startTime" },
                { label: "Online Payment", value: "onlinePaidAt" },
                { label: "Cash Collected", value: "cashCollectedAt" },
                { label: "Owner Settled", value: "ownerSettledAt" },
                { label: "Fee Settled", value: "feeSettledAt" },
                { label: "Expires", value: "expiresAt" },
                { label: "Waived", value: "waivedAt" },
              ]}
            />
          )}

          <SelectFilter
            paramName="status"
            placeholder={isPlayer ? playerT("bookingStatus") : "Booking Status"}
            options={statusOptions}
          />

          <SelectFilter
            paramName="paymentStatus"
            placeholder={isPlayer ? playerT("paymentStatus") : "Payment Status"}
            options={[
              { label: playerLabel("unpaid", "Unpaid"), value: "UNPAID" },
              { label: playerLabel("partial", "Partial"), value: "PARTIAL" },
              { label: playerLabel("paid", "Paid"), value: "PAID" },
              { label: playerLabel("refunded", "Refunded"), value: "REFUNDED" },
              { label: playerLabel("failed", "Failed"), value: "FAILED" },
              { label: playerLabel("cancelled", "Cancelled"), value: "CANCELLED" },
            ]}
          />

          <SelectFilter
            paramName="source"
            placeholder={isPlayer ? playerT("source") : "Source"}
            options={[
              { label: playerLabel("app", "App"), value: "APP" },
              { label: playerLabel("manual", "Manual"), value: "MANUAL" },
            ]}
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

export default BookingsFilter;
