/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DateCell } from "@/components/shared/cell/DateCell";
import { Column } from "@/components/shared/ManagementTable";
import { useTranslations } from "next-intl";

export interface RefundData {
  id: string;
  reference_id: string;
  fieldName: string;
  startTime: string;
  endTime: string;
  status: string;

  overPaidRefund: string | number;
  isOverPaidRefunded: boolean;
  overPaidRefundCompletedAt?: string | null;

  refundAmount: string | number;
  refundCompletedAt?: string | null;

  field?: {
    name: string;
  };
}


const getRefundType = (booking: RefundData): "OVERPAID" | "REGULAR" | null => {
  const hasOverpaid = Number(booking.overPaidRefund) > 0;
  const hasRegular = Number(booking.refundAmount) > 0;

  if (hasOverpaid) return "OVERPAID";
  if (hasRegular) return "REGULAR";
  return null;
};

export const useRefundColumns = (): Column<RefundData | any>[] => {
  const t = useTranslations("player.refundsTable");
  const displayStatus = (status: string) => {
    const key = ({ NO_SHOW: "noShow", PENDING_GAME: "pending" } as Record<string, string>)[status.toUpperCase()] || status.toLowerCase();
    return t.has(key) ? t(key) : status.replace(/_/g, " ");
  };

  return [
  {
    header: t("trackingKey"),
    accessor: "reference_id",
    sortKey: "reference_id",
    className: "font-semibold text-slate-900",
  },
  {
    header: t("type"),
    accessor: (booking) => {
      const refundType = getRefundType(booking);

      if (refundType === "OVERPAID") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-violet-50 text-violet-700 border border-violet-200 uppercase tracking-wide text-[10px]">
            {t("overpaid")}
          </span>
        );
      }

      if (refundType === "REGULAR") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase tracking-wide text-[10px]">
            {t("cancellation")}
          </span>
        );
      }

      return (
        <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wide text-[10px]">
          {t("notAvailable")}
        </span>
      );
    },
  },
  {
    header: t("allocationSpace"),
    accessor: (booking) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {booking.field?.name || booking.fieldName}
        </span>
      </div>
    ),
  },
  {
    header: t("scheduleDetail"),
    accessor: (booking) => {
      const formatTime = (isoString: string) => {
        try {
          return new Date(isoString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        } catch {
          return "N/A";
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
    header: t("financialSum"),
    // ADDED: picks the correct amount field based on refund type
    accessor: (booking) => {
      const refundType = getRefundType(booking);
      const amount =
        refundType === "OVERPAID"
          ? booking.overPaidRefund
          : refundType === "REGULAR"
            ? booking.refundAmount
            : 0;

      return (
        <span className="text-sm font-semibold text-slate-900">
          ৳{amount}
        </span>
      );
    },
  },
  {
    header: t("bookingStatus"),
    sortKey: "status",
    accessor: (booking) => {
      const status = booking.status;

      if (status === "CONFIRMED") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide text-[10px]">
            {t("confirmed")}
          </span>
        );
      }

      if (status === "CANCELLED") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide text-[10px]">
            {t("cancelled")}
          </span>
        );
      }

      if (status === "COMPLETED") {
        return (
          <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide text-[10px]">
            {t("completed")}
          </span>
        );
      }

      return (
        <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide text-[10px]">
          {displayStatus(status || "")}
        </span>
      );
    },
  },
  {
    header: "Refunded",
    // ADDED: branches entirely on refund type now, since each type has its own
    // "is refunded" flag/date and its own completion rule
    accessor: (booking) => {
      const refundType = getRefundType(booking);
      const status = booking.status;

      if (refundType === "OVERPAID") {
        // Overpaid refunds require the booking to be COMPLETED first
        if (status !== "COMPLETED") {
          return (
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide text-[10px]">
              {t("waitingToComplete")}
            </span>
          );
        }

        if (!booking.isOverPaidRefunded) {
          return (
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide text-[10px]">
              {t("notRefundedYet")}
            </span>
          );
        }

        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide text-[10px]">
              {t("refunded")}
            </span>
            {booking.overPaidRefundCompletedAt ? (
              <DateCell date={booking.overPaidRefundCompletedAt} />
            ) : (
              <span className="text-[10px] text-muted-foreground">
                {t("dateUnavailable")}
              </span>
            )}
          </div>
        );
      }

      if (refundType === "REGULAR") {
        // Regular (cancellation) refunds — no "waiting to complete" state;
        // the booking is already CANCELLED by definition when this applies
        if (!booking.refundCompletedAt) {
          return (
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide text-[10px]">
              {t("notRefundedYet")}
            </span>
          );
        }

        return (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide text-[10px]">
              {t("refunded")}
            </span>
            <DateCell date={booking.refundCompletedAt} />
          </div>
        );
      }

      return (
        <span className="inline-flex w-max items-center rounded-full px-2 py-0.5 font-medium bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wide text-[10px]">
          {t("notAvailable")}
        </span>
      );
    },
  },
  ];
};
