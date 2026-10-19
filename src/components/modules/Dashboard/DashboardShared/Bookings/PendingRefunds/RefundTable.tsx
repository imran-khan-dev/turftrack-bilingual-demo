/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatSlotTime } from "@/utils/formatSlotTime";
import { useTranslations } from "next-intl";
import { Calendar, User, Coins, Undo2, CheckCircle2 } from "lucide-react";

interface TableProps {
  bookings: any[];
  activeTab: "PENDING" | "HISTORY";
  businesses: any[];
  processingId: string | null;
  onSelectConfirm: (booking: any, refundType: "REGULAR" | "OVERPAID") => void;
  managerView?: boolean;
}

export default function RefundTable({
  bookings,
  activeTab,
  businesses,
  processingId,
  onSelectConfirm,
  managerView = false,
}: TableProps) {
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
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
            <th className="py-3 px-4">{managerView ? t("tracking") : "Tracking Key"}</th>
            <th className="py-3 px-4">{managerView ? t("allocation") : "Allocation Space"}</th>
            <th className="py-3 px-4">{managerView ? t("schedule") : "Schedule Detail"}</th>
            <th className="py-3 px-4">{managerView ? t("amount") : "Financial Sum"}</th>
            <th className="py-3 px-4 text-right">
              {managerView ? (activeTab === "PENDING" ? t("actions") : t("status")) : (activeTab === "PENDING" ? "Operational Actions" : "Status Flag")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
          {ledgerRows.map((row) => {
            const isOverpaidRow = row.ledgerType === "OVERPAID";

            const currentDisplayRefund = isOverpaidRow
              ? row.overPaidRefund
              : row.refundAmount;

            const refundPercent = Number(
              businesses.find((b) => b.id === row.businessId)?.refundPercent ||
                0,
            );

            let ledgerLabel = "";
            if (isOverpaidRow) {
              ledgerLabel =
                activeTab === "PENDING"
                  ? (managerView ? `${t("overpayment")}: ` : "Overpayment Balance: ")
                  : (managerView ? `${t("paidBack")}: ` : "Paid Back to Player: ");
            } else {
              ledgerLabel =
                activeTab === "PENDING"
                  ? (managerView ? `${t("pendingRefund")}: ` : "Pending Refund: ")
                  : (managerView ? `${t("issued")}: ` : "Refund Issued: ");
            }

            return (
              <tr
                key={row.virtualId}
                className={`transition-colors ${
                  isOverpaidRow
                    ? "bg-slate-50/60 hover:bg-slate-50"
                    : "bg-white hover:bg-slate-50/60"
                }`}
              >
                <td className="py-4 px-4">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    {row.reference_id}
                    {isOverpaidRow && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-md uppercase tracking-wide">
                        <Coins size={10} /> {managerView ? t("overpayment") : "Overpaid"}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <User size={10} /> {row.user?.fullName || (managerView ? t("guest") : "Guest Account")}
                  </div>
                </td>
                <td className="py-4 px-4 font-semibold text-slate-700">
                  {row.fieldName}
                </td>
                <td className="py-4 px-4">
                  <div className="font-semibold text-slate-700 flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" />
                    {new Date(row.startTime).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 pl-4">
                    {formatSlotTime(row.startTime, row.endTime)}
                  </div>
                </td>
                <td className="py-4 px-4 space-y-1">
                  {!isOverpaidRow ? (
                    <>
                      <div>
                        Paid Online:{" "}
                        <span className="text-slate-900 font-bold">
                          ৳{Number(row.paidOnline || 0).toLocaleString("en-BD")}
                        </span>
                      </div>
                      <div>
                        Refund Percent:{" "}
                        <span className="text-slate-700 font-bold">
                          {refundPercent}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded inline-block mb-1">
                      Type: Overpayment Balance
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 font-medium">
                      {ledgerLabel}
                    </span>
                    <span className="text-emerald-600 font-bold">
                      ৳
                      {Number(currentDisplayRefund || 0).toLocaleString(
                        "en-BD",
                      )}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4 text-right">
                  {activeTab === "PENDING" ? (
                    <button
                      onClick={() => onSelectConfirm(row, row.ledgerType)}
                      disabled={processingId !== null}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isOverpaidRow ? (
                        <Coins size={12} />
                      ) : (
                        <Undo2 size={12} />
                      )}
                      {managerView ? (isOverpaidRow ? t("settleOverpayment") : t("issueRefund")) : (isOverpaidRow ? "Settle Overpayment" : "Issue Refund")}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-xl select-none">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      Closed Ledger
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
