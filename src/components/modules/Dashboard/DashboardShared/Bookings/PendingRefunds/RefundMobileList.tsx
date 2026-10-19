/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { formatSlotTime } from "@/utils/formatSlotTime";
import { useTranslations } from "next-intl";
import { User, Coins, Undo2, CheckCircle2 } from "lucide-react";

interface MobileListProps {
  bookings: any[];
  activeTab: "PENDING" | "HISTORY";
  businesses: any[];
  processingId: string | null;
  onSelectConfirm: (booking: any, refundType: "REGULAR" | "OVERPAID") => void;
  managerView?: boolean;
}

export default function RefundMobileList({
  bookings,
  activeTab,
  businesses,
  processingId,
  onSelectConfirm,
  managerView = false,
}: MobileListProps) {
  const t = useTranslations("manager.refunds");
  // 1. Deduplicate base elements by main unique ID
  const uniqueBookingsMap = new Map<string, any>();
  (bookings || []).forEach((b) => {
    if (b && b.id) {
      uniqueBookingsMap.set(b.id, b);
    }
  });
  const uniqueBookings = Array.from(uniqueBookingsMap.values());

  // 2. Map and filter items intelligently into their respective tabs
  const ledgerRows = uniqueBookings.flatMap((booking) => {
    const items = [];

    const hasRegular = Number(booking.refundAmount || 0) > 0;
    const hasOverpaid = Number(booking.overPaidRefund || 0) > 0;

    const isRegularSettled =
      booking.refundCompletedAt !== null || booking.status !== "FOR_REFUND";
    const isOverpaidSettled = booking.isOverPaidRefunded === true;

    if (activeTab === "PENDING") {
      if (hasRegular && !isRegularSettled) {
        items.push({
          ...booking,
          ledgerType: "REGULAR",
          virtualId: `${booking.id}-regular`,
        });
      }
      if (hasOverpaid && !isOverpaidSettled) {
        items.push({
          ...booking,
          ledgerType: "OVERPAID",
          virtualId: `${booking.id}-overpaid`,
        });
      }
    } else {
      if (hasRegular && isRegularSettled) {
        items.push({
          ...booking,
          ledgerType: "REGULAR",
          virtualId: `${booking.id}-regular`,
        });
      }
      if (hasOverpaid && isOverpaidSettled) {
        items.push({
          ...booking,
          ledgerType: "OVERPAID",
          virtualId: `${booking.id}-overpaid`,
        });
      }
    }

    return items;
  });

  return (
    <div className="block sm:hidden divide-y divide-slate-100 -mx-5 -mb-5">
      {ledgerRows.map((row) => {
        const isOverpaidRow = row.ledgerType === "OVERPAID";
        const currentDisplayRefund = isOverpaidRow
          ? row.overPaidRefund
          : row.refundAmount;

        const refundPercent = Number(
          businesses.find((b) => b.id === row.businessId)?.refundPercent || 0,
        );

        let ledgerLabel = "";
        if (isOverpaidRow) {
          ledgerLabel =
            activeTab === "PENDING" ? (managerView ? t("overpayment") : "Overpayment: ") : (managerView ? t("paidBack") : "Paid Back: ");
        } else {
          ledgerLabel = activeTab === "PENDING" ? (managerView ? t("pendingRefund") : "Pending: ") : (managerView ? t("issued") : "Issued: ");
        }

        return (
          <div
            key={row.virtualId}
            className={`p-4 space-y-3 transition-colors ${
              isOverpaidRow
                ? "bg-slate-50/60 hover:bg-slate-50"
                : "bg-white hover:bg-slate-50/40"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-bold text-slate-800 text-xs flex flex-wrap items-center gap-1.5">
                  {row.reference_id}
                  {isOverpaidRow && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md uppercase tracking-wide">
                      <Coins size={10} /> {managerView ? t("overpayment") : "Overpaid"}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <User size={10} /> {row.user?.fullName || (managerView ? t("guest") : "Guest Account")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
              <div className="col-span-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Allocation Space
                </span>
                <span className="font-semibold text-slate-700">
                  {row.fieldName}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Schedule Detail
                </span>
                <span className="font-semibold text-slate-700 block">
                  {new Date(row.startTime).toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </span>
                <span className="text-slate-400 block text-[10px]">
                  {formatSlotTime(row.startTime, row.endTime)}
                </span>
              </div>
              <div className="space-y-0.5 pl-2 border-l border-slate-200">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  Financial Metrics
                </span>

                {!isOverpaidRow ? (
                  <>
                    <div className="text-[10px] text-slate-500">
                      Paid:{" "}
                      <span className="font-bold text-slate-800">
                        ৳{Number(row.paidOnline || 0).toLocaleString("en-BD")}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Rate:{" "}
                      <span className="font-bold text-slate-700">
                        {refundPercent}%
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-[9px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-1 py-0.5 rounded inline-block mb-0.5">
                    Overpayment Balance
                  </div>
                )}

                <div className="text-[10px] text-slate-500">
                  {ledgerLabel}
                  <span className="text-emerald-600 font-bold">
                    ৳{Number(currentDisplayRefund || 0).toLocaleString("en-BD")}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-1">
              {activeTab === "PENDING" ? (
                <button
                  onClick={() => onSelectConfirm(row, row.ledgerType)}
                  disabled={processingId !== null}
                  className="w-full flex items-center justify-center gap-1 h-8 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isOverpaidRow ? <Coins size={12} /> : <Undo2 size={12} />}
                  {managerView ? (isOverpaidRow ? t("settleOverpayment") : t("issueRefund")) : (isOverpaidRow ? "Settle Overpayment" : "Issue Refund")}
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-1 h-8 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-xl select-none">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  Closed Ledger
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
