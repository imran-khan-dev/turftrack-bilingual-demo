/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import { Column } from "@/components/shared/ManagementTable";
import { cn } from "@/lib/utils";

export interface BookingData {
  id: string;
  reference_id: string;
  fieldName: string;
  startTime: string;
  endTime: string;
  totalAmount: string | number;
  paidOnline: string | number;
  paidOnlineFormatted?: string;
  netAmount?: string | number;
  status: string;
  paymentStatus?: string; // ADDED
  createdAt: string;
  isManualEntry: boolean;
  user?: {
    fullName: string;
    phone: string;
  };
  field?: {
    name: string;
  };
  nextBookings?: Array<{
    id: string;
    reference_id: string | null;
    startTime: string;
    status: string;
  }>;
}

export const createBookingsColumns = (translate?: (key: string) => string): Column<BookingData | any>[] => {
  const label = (key: string, fallback: string) => translate ? translate(key) : fallback;
  const statusKey: Record<string, string> = {
    PAID: "paid", COMPLETED: "completed", PARTIAL: "partial", PARTIALLY_PAID: "partial",
    REFUNDED: "refunded", FAILED: "failed", UNPAID: "unpaid", PENDING: "pending",
    CONFIRMED: "confirmed", CANCELLED: "cancelled", RESCHEDULED: "rescheduled",
    PENDING_GAME: "pendingGame", NO_SHOW: "noShow",
  };
  return [
  {
    header: label("referenceId", "Reference ID"),
    accessor: "reference_id",
    sortKey: "reference_id",
    className: "font-semibold text-slate-900",
  },
  {
    header: label("customer", "Customer"),
    accessor: (booking) => (
      <UserInfoCell
        name={booking.user?.fullName || label("guestUser", "Guest User")}
        email={booking.user?.phone || label("notAvailable", "N/A")}
        photo=""
      />
    ),
    sortKey: "userId",
  },
  {
    header: label("fieldArena", "Field / Arena"),
    accessor: (booking) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {booking.field?.name || booking.fieldName}
        </span>
      </div>
    ),
  },
  {
    header: label("schedule", "Schedule"),
    accessor: (booking) => {
      const formatTime = (isoString: string) => {
        try {
          return new Date(isoString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        } catch {
          return label("notAvailable", "N/A");
        }
      };

      return (
        <div className="flex flex-col text-xs gap-0.5">
          <span className="font-medium">
            {new Date(booking.startTime).toLocaleDateString("en-US", {
              dateStyle: "medium",
            })}
          </span>
          <span className="text-muted-foreground text-[11px]">
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </span>
        </div>
      );
    },
    sortKey: "startTime",
  },
  {
    header: label("amount", "Amount"),
    accessor: (booking) => (
      <div className="flex flex-col text-xs">
        <span className="text-slate-500">
          {label("total", "Total:")}{" "}
          <strong className="text-slate-900">
            ৳{booking.netAmount ?? booking.totalAmount}
          </strong>
        </span>
        <span className="text-muted-foreground text-[11px]">
          {label("paidOnline", "Paid Online:")} ৳{booking.paidOnlineFormatted ?? booking.paidOnline}
        </span>
      </div>
    ),
  },
  {
    header: label("paymentStatus", "Payment Status"),
    sortKey: "paymentStatus",
    accessor: (booking) => {
      const payStatus = (
        booking.paymentStatus ||
        booking.payment_status ||
        "PENDING"
      ).toUpperCase();

      if (payStatus === "PAID" || payStatus === "COMPLETED") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide text-[10px]">
            {label("paid", "Paid")}
          </span>
        );
      }

      if (payStatus === "PARTIAL" || payStatus === "PARTIALLY_PAID") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide text-[10px]">
            {label("partial", "Partial")}
          </span>
        );
      }

      if (payStatus === "REFUNDED") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-semibold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wide text-[10px]">
            {label("refunded", "Refunded")}
          </span>
        );
      }

      if (payStatus === "FAILED") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-semibold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide text-[10px]">
            {label("failed", "Failed")}
          </span>
        );
      }

      // Default (PENDING or UNPAID)
      return (
        <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide text-[10px]">
          {label(statusKey[payStatus] || payStatus.toLowerCase(), payStatus.replace(/_/g, " "))}
        </span>
      );
    },
  },
  {
    header: label("bookingStatus", "Status"),
    sortKey: "status",
    accessor: (booking) => {
      const status = booking.status;

      if (status === "RESCHEDULED") {
        const nextBooking = booking.rescheduledTo;

        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="inline-flex items-center rounded-full px-2 py-0.5 font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide text-[10px]">
              {label("rescheduled", "Rescheduled")}
            </span>
            {nextBooking && (
              <span className="text-[10px] font-bold text-blue-600 tracking-wide flex items-center gap-0.5 hover:underline decoration-blue-400">
                {label("to", "To:")} #{nextBooking.reference_id || nextBooking.id.slice(0, 8)}
              </span>
            )}
          </div>
        );
      }

      if (status === "CONFIRMED") {
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide text-[10px]">
              {label("confirmed", "Confirmed")}
            </span>
          </div>
        );
      }

      if (status === "CANCELLED") {
        return (
          <div className="flex flex-col gap-1">
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide text-[10px]">
              {label("cancelled", "Cancelled")}
            </span>
          </div>
        );
      }

      // Default rendering block fallback
      return (
        <div className="flex flex-col gap-1">
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide text-[10px]">
          {label(statusKey[status] || status?.toLowerCase() || "", status?.replace(/_/g, " ") || "")}
          </span>
        </div>
      );
    },
  },
  {
    header: label("source", "Source"),
    sortKey: "isManualEntry",
    accessor: (booking) => {
      const isManual = booking.isManualEntry;
      return (
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "inline-flex w-max items-center rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide text-[10px] select-none border",
              isManual
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-blue-50 text-blue-700 border-blue-200",
            )}
          >
            {isManual ? label("manual", "Manual") : label("regular", "Regular")}
          </span>
        </div>
      );
    },
  },
  {
    header: label("bookedOn", "Booked On"),
    accessor: (booking) => <DateCell date={booking.createdAt} />,
    sortKey: "createdAt",
  },
  ];
};
