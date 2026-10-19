/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Receipt,
  Phone,
  MapPin,
  AlertTriangle,
  User,
  CreditCard,
  Calendar,
  Layers,
  ArrowRightLeft,
  Coins,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookingInvoice } from "@/services/booking/getBookingInvoice";
import { useTranslations } from "next-intl";

interface InvoiceModalProps {
  bookingId: string | null;
  isOpen: boolean;
  onClose: () => void;
  playerView?: boolean;
  managerView?: boolean;
  ownerView?: boolean;
}

export default function InvoiceModal({
  bookingId,
  isOpen,
  onClose,
  playerView = false,
  managerView = false,
  ownerView = false,
}: InvoiceModalProps) {
  const translated = playerView || managerView || ownerView;
  const t = useTranslations("player.invoice");
  const statusText = (status: string) => {
    const key = `statusLabels.${status}`;
    return t.has(key) ? t(key) : status;
  };
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !bookingId) return;

    const fetchInvoice = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBookingInvoice(bookingId);

        if (!result.success) {
          throw new Error(result.message);
        }

        setInvoice(result.data);
      } catch (err: any) {
        setError(err.message || (translated ? t("error") : "Something went wrong"));
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm mb-0">
      {/* Modal Card Box */}
      <div className="relative w-full max-w-4xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-slate-100 flex flex-col h-[85vh] sm:h-auto max-h-[90vh] overflow-hidden animate-in fade-in-50 slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Header Block */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Receipt className="h-5 w-5 text-green-600 shrink-0" />
            <h3 className="text-sm font-bold text-slate-800 truncate">
              {loading
                ? (translated ? t("loading") : "Loading Invoice...")
                : invoice?.invoiceNumber || (translated ? t("title") : "Booking Invoice")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Inner Body Window */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <div className="h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500 text-center px-4">
                {translated ? t("loadingDetails") : "Retrieving multi-slot card registry data..."}
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-red-50/50 border border-red-100 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && invoice && (
            <>
              {/* Top Meta Details Matrix */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-xl text-xs font-semibold text-slate-600">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                    {translated ? t("dateIssued") : "Date Issued"}
                  </span>
                  <span className="text-slate-800 text-[11px] sm:text-xs">
                    {new Date(invoice.date).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                    {translated ? t("dueDate") : "Due Date"}
                  </span>
                  <span className="text-slate-800 text-[11px] sm:text-xs">
                    {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                    {translated ? t("paymentStatus") : "Overall Payment Status"}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide border uppercase",
                      invoice.status === "PAID"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200",
                    )}
                  >
                    {translated ? statusText(invoice.status) : invoice.status}
                  </span>
                </div>
              </div>

              {/* Merchant vs Book For vs Buyer Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-xs border-b border-slate-100 pb-5 sm:pb-6">
                {/* 1. Merchant Arena Details */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    {translated ? t("merchant") : "Merchant / Arena Details"}
                  </h4>
                  <p className="text-sm font-bold text-slate-800">
                    {invoice.seller.name}
                  </p>
                  <p className="flex items-start gap-1.5 text-slate-600">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400 mt-0.5" />
                    <span>{invoice.seller.address}</span>
                  </p>
                  {invoice.seller.contact && (
                    <p className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{invoice.seller.contact}</span>
                    </p>
                  )}
                </div>

                {/* 2. Booked For / Player Details */}
                <div className="space-y-1.5 border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-slate-100">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <User className="h-3 w-3 text-slate-400 shrink-0" /> {translated ? t("bookedFor") : "Booked For / Player"}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">
                      {invoice.bookFor?.name || (translated ? t("notAvailable") : "N/A")}
                    </p>
                    {invoice.bookFor?.role && (
                      <span className="text-[9px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 uppercase tracking-wide">
                        {invoice.bookFor.role}
                      </span>
                    )}
                  </div>
                  {invoice.bookFor?.contact && (
                    <p className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{invoice.bookFor.contact}</span>
                    </p>
                  )}
                  {invoice.bookFor?.email &&
                    invoice.bookFor.email !== "N/A" && (
                      <p className="text-slate-500 font-medium pl-5 break-all">
                        {invoice.bookFor.email}
                      </p>
                    )}
                </div>

                {/* 3. Buyer / Payer Details */}
                <div className="space-y-1.5 border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-slate-100">
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-slate-400 shrink-0" />{" "}
                    {translated ? t("buyer") : "Buyer / Purchaser"}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">
                      {invoice.buyer?.name || invoice.bookFor?.name || (translated ? t("notAvailable") : "N/A")}
                    </p>
                    {invoice.buyer?.role && (
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 uppercase tracking-wide">
                        {invoice.buyer.role}
                      </span>
                    )}
                  </div>
                  {invoice.buyer?.contact && (
                    <p className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span>{invoice.buyer.contact}</span>
                    </p>
                  )}
                  {invoice.buyer?.email && invoice.buyer.email !== "N/A" && (
                    <p className="text-slate-500 font-medium pl-5 break-all">
                      {invoice.buyer.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Cart Group Multi Line Items Listing */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Layers className="h-3 w-3 text-slate-400" /> {translated ? t("bookedSlots") : "Booked Slots Container (Cart Bundle)"}
                </h4>

                {/* Desktop View Table */}
                <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                        <th className="p-3">{translated ? t("description") : "Description"}</th>
                        <th className="p-3">{translated ? t("schedule") : "Schedule Time Slot"}</th>
                        <th className="p-3 text-center">{translated ? t("status") : "Status Indicators"}</th>
                        <th className="p-3 text-right">{translated ? t("amount") : "Amount"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoice.items.map((item: any) => (
                        <tr
                          key={item.bookingId}
                          className={cn(
                            "transition-colors",
                            item.isTargetBooking
                              ? "bg-green-50/60 font-bold text-slate-900 border-l-4 border-l-green-500"
                              : "text-slate-600 font-semibold",
                          )}
                        >
                          <td className="p-3 max-w-[240px]">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span>{item.description}</span>
                              {item.isTargetBooking && (
                                <span className="text-[9px] bg-green-600 text-white font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-md shrink-0">
                                  {translated ? t("selected") : "Selected"}
                                </span>
                              )}
                            </div>
                            {item.referenceId && (
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {translated ? t("reference") : "Ref"}: #{item.referenceId.toUpperCase()}
                              </p>
                            )}

                            {/* Desktop Reschedule Context Node */}
                            {item.rescheduleHistory?.from && (
                              <div className="flex items-center gap-1 text-[10px] text-amber-600 font-medium mt-1">
                                <ArrowRightLeft className="h-2.5 w-2.5" />
                                <span>
                                  {translated ? t("rescheduledFrom", { reference: item.rescheduleHistory.from.referenceId?.toUpperCase() || "" }) : `Rescheduled from #${item.rescheduleHistory.from.referenceId?.toUpperCase() || ""}`}
                                </span>
                              </div>
                            )}
                            {item.rescheduleHistory?.to && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-1">
                                <ArrowRightLeft className="h-2.5 w-2.5" />
                                <span>
                                  {translated ? t("movedToSlot", { reference: item.rescheduleHistory.to.referenceId?.toUpperCase() || "" }) : `Moved to slot #${item.rescheduleHistory.to.referenceId?.toUpperCase() || ""}`}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-slate-600 font-medium">
                            {item.timeSlot}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className={cn(
                                  "white-space-nowrap px-1.5 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider",
                                  item.bookingStatus === "CONFIRMED" ||
                                    item.bookingStatus === "COMPLETED"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    : "bg-slate-100 border-slate-300 text-slate-600",
                                )}
                              >
                                {translated ? statusText(item.bookingStatus || item.status) : (item.bookingStatus || item.status)}
                              </span>
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 text-[9px] font-bold rounded border uppercase tracking-wider",
                                  item.paymentStatus === "PAID"
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : "bg-amber-50 border-amber-200 text-amber-700",
                                )}
                              >
                                {translated ? statusText(item.paymentStatus) : item.paymentStatus}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-right text-slate-900 font-bold whitespace-nowrap">
                            {item.isArchivedByReschedule ? (
                              <div className="text-right">
                                <span className="text-[10px] bg-slate-100 text-slate-400 font-bold tracking-wide uppercase px-1.5 py-0.5 rounded">
                                  {translated ? t("transferred") : "Transferred"}
                                </span>
                                <p className="text-[10px] text-slate-400 line-through font-normal mt-0.5">
                                  ৳{item.amount}
                                </p>
                              </div>
                            ) : (
                              <>
                                <div>৳{item.amount}</div>
                                {Number(item.dueAmount || 0) > 0 && (
                                  <div className="text-[10px] font-medium text-amber-600">
                                    {translated ? t("due", { amount: item.dueAmount }) : `Due: ৳${item.dueAmount}`}
                                  </div>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Stack */}
                <div className="block sm:hidden space-y-3">
                  {invoice.items.map((item: any) => (
                    <div
                      key={item.bookingId}
                      className={cn(
                        "p-4 rounded-xl border text-xs space-y-3 relative overflow-hidden transition-all bg-white shadow-sm",
                        item.isTargetBooking
                          ? "border-green-200 bg-green-50/20 border-l-4 border-l-green-500"
                          : "border-slate-100",
                      )}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="font-bold text-slate-800 break-words">
                              {item.description}
                            </p>
                            {item.isTargetBooking && (
                              <span className="text-[8px] bg-green-600 text-white font-extrabold tracking-wide uppercase px-1 py-0.5 rounded-sm">
                                {translated ? t("selected") : "Selected"}
                              </span>
                            )}
                          </div>
                          {item.referenceId && (
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              #{item.referenceId.toUpperCase()}
                            </p>
                          )}

                          {/* Mobile Reschedule Context Node */}
                          {item.rescheduleHistory?.from && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-600 font-medium mt-1">
                              <ArrowRightLeft className="h-2.5 w-2.5" />
                              <span>
                                {translated ? t("rescheduledFrom", { reference: item.rescheduleHistory.from.referenceId?.toUpperCase() || "" }) : `From #${item.rescheduleHistory.from.referenceId?.toUpperCase() || ""}`}
                              </span>
                            </div>
                          )}
                          {item.rescheduleHistory?.to && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-1">
                              <ArrowRightLeft className="h-2.5 w-2.5" />
                              <span>
                                {translated ? t("movedToSlot", { reference: item.rescheduleHistory.to.referenceId?.toUpperCase() || "" }) : `Moved to #${item.rescheduleHistory.to.referenceId?.toUpperCase() || ""}`}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          {item.isArchivedByReschedule ? (
                            <div className="space-y-0.5">
                              <span className="text-[9px] bg-slate-100 text-slate-400 font-bold tracking-wide uppercase px-1.5 py-0.5 rounded inline-block">
                                {translated ? t("transferred") : "Transferred"}
                              </span>
                              <p className="font-bold text-slate-400 text-xs line-through">
                                ৳{item.amount}
                              </p>
                            </div>
                          ) : (
                            <>
                              <p className="font-extrabold text-slate-900 text-sm">
                                ৳{item.amount}
                              </p>
                              {Number(item.dueAmount || 0) > 0 && (
                                <p className="text-[9px] font-bold text-amber-600 mt-0.5">
                                  {translated ? t("due", { amount: item.dueAmount }) : `Due: ৳${item.dueAmount}`}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-dashed border-slate-100 text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400 shrink-0" />{" "}
                          {item.timeSlot}
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            className={cn(
                              "px-1 py-0.5 text-[8px] font-extrabold rounded border uppercase",
                              item.bookingStatus === "CONFIRMED" ||
                                item.bookingStatus === "COMPLETED"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : "bg-slate-100 border-slate-300 text-slate-600",
                            )}
                          >
                            {translated ? statusText(item.bookingStatus || item.status) : (item.bookingStatus || item.status)}
                          </span>
                          <span
                            className={cn(
                              "px-1 py-0.5 text-[8px] font-extrabold rounded border uppercase",
                              item.paymentStatus === "PAID"
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-amber-50 border-amber-200 text-amber-700",
                            )}
                          >
                            {translated ? statusText(item.paymentStatus) : item.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Bottom Financial Summary Totals */}
              <div className="flex justify-end pt-1 sm:pt-2">
                <div className="w-full sm:max-w-[320px] bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-semibold text-slate-600 space-y-2">
                  <div className="flex justify-between">
                    <span>{translated ? t("subtotal") : "Subtotal"}</span>
                    <span className="text-slate-800">
                      ৳{invoice.summary.subTotal}
                    </span>
                  </div>

                  {/* Discount Section */}
                  {Number(invoice.summary.discount || 0) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>{translated ? t("discount") : "Discount Given"}</span>
                      <span>-৳{invoice.summary.discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>{translated ? t("tax") : "Tax"}</span>
                    <span className="text-slate-800">
                      ৳{invoice.summary.tax}
                    </span>
                  </div>

                  <div className="h-px bg-slate-200 my-1" />

                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{translated ? t("total") : "Total Bill"}</span>
                    <span className="text-slate-900 font-bold">
                      ৳{invoice.summary.total}
                    </span>
                  </div>

                  {Number(invoice.summary.paidOnline || 0) > 0 && (
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span> {translated ? t("paidOnline") : "Paid Online"}</span>
                      <span>৳{invoice.summary.paidOnline}</span>
                    </div>
                  )}

                  {Number(invoice.summary.paidCash || 0) > 0 && (
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span> {translated ? t("paidCash") : "Paid Cash"}</span>
                      <span>৳{invoice.summary.paidCash}</span>
                    </div>
                  )}

                  {/* Overpaid Refund Item Node (Reschedule Staging Delta) */}
                  {Number(invoice.summary.overPaidRefund || 0) > 0 && (
                    <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 mt-1">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Coins
                          className={cn(
                            "h-3.5 w-3.5",
                            invoice.summary.isOverPaidRefunded
                              ? "text-emerald-500"
                              : "text-green-500",
                          )}
                        />
                        {translated ? t("rescheduleRefund") : "Reschedule Refund"}
                      </span>
                      <div className="text-right flex flex-col items-end gap-0.5">
                        <span
                          className={cn(
                            "font-bold",
                            invoice.summary.isOverPaidRefunded
                              ? "text-emerald-600"
                              : "text-green-600",
                          )}
                        >
                          ৳{Number(invoice.summary.overPaidRefund).toFixed(2)}
                        </span>
                        <span
                          className={cn(
                            "px-1 rounded-[4px] text-[8px] font-extrabold uppercase border scale-95 origin-right",
                            invoice.summary.isOverPaidRefunded
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-green-50 text-green-600 border-green-200",
                          )}
                        >
                          {invoice.summary.isOverPaidRefunded
                            ? (translated ? t("refunded") : "Refunded")
                            : (translated ? t("pendingPayout") : "Pending Payout")}
                        </span>
                      </div>
                    </div>
                  )}

                  {Number(invoice.summary.dueAmount || 0) > 0 && (
                    <div className="flex justify-between text-amber-600 font-bold border-t border-dashed border-slate-200 pt-2 mt-1">
                      <span>{translated ? t("dueAmount") : "Due Amount"}</span>
                      <span>৳{invoice.summary.dueAmount}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
