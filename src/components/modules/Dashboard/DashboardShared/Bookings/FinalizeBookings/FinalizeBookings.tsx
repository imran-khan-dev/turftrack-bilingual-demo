/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  UserX,
  Loader2,
  Landmark,
  Coins,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { finalizeBookingStatus } from "@/services/booking/finalizeBookingStatus";
import { getBookings } from "@/services/booking/getBookings";

interface BookingRecord {
  id: string;
  reference_id: string;
  fieldName: string;
  startTime: string;
  endTime: string;
  totalAmount: string | number;
  discountAmount: string | number;
  netAmount: string | number;
  paidOnline: string | number;
  totalAmountToCollect: string | number;
  user?: {
    fullName: string;
    phone: string;
  };
  business?: {
    name: string;
    location: string;
  };
}

const PAGE_LIMIT = 10;

export default function FinalizeBookings({ managerView = false, ownerView = false }: { managerView?: boolean; ownerView?: boolean }) {
  const t = useTranslations("manager.finalize");
  const translatedView = managerView || ownerView;
  const label = (key: string, fallback: string) => translatedView ? t(key as never) : fallback;
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const fetchPendingFinalizations = async (targetPage: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getBookings({
        status: "FOR_REVIEW",
        page: targetPage,
        limit: PAGE_LIMIT,
      });

      const extractedData = result.data?.formattedData || [];
      const meta = result.data?.meta;

      setBookings(extractedData);
      setTotal(meta?.total ?? extractedData.length);

      // If a status change emptied the current page (e.g. resolving the last
      // remaining row on the last page), step back a page instead of showing blank.
      if (extractedData.length === 0 && targetPage > 1) {
        setPage(targetPage - 1);
        return;
      }
    } catch (err: any) {
      setError(err.message || label("error", "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingFinalizations(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleResolutionMutation = async (
    id: string,
    targetStatus: "COMPLETED" | "NO_SHOW",
  ) => {
    try {
      setProcessingId(id);

      const result = await finalizeBookingStatus(id, targetStatus);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Re-fetch the current page rather than just filtering the resolved
      // row out locally, so `total` and the row count stay in sync with the
      // backend (and the next row from page N+1 slides in if needed).
      await fetchPendingFinalizations(page);
    } catch (err: any) {
      alert(err.message || label("error", "Failed to process database mutation transaction."));
    } finally {
      setProcessingId(null);
    }
  };

  const formatSlotTime = (startStr: string, endStr: string) => {
    const opts: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    try {
      const start = new Date(startStr).toLocaleTimeString("en-US", opts);
      const end = new Date(endStr).toLocaleTimeString("en-US", opts);
      return `${start} - ${end}`;
    } catch {
      return label("customSlot", "Custom Slot Allocation");
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-2 bg-white border border-slate-200 rounded-2xl">
        <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label("loading", "Syncing pending match reviews...")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          {/* <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {label("title", "Pending Verification Checkouts")}
            </h3>
            {total > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                {translatedView ? t("leftCount", { count: total }) : `${total} Left`}
              </span>
            )}
          </div> */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Pending Verification Checkouts
            </h3>
            {total > 0 && (
              <span className="shrink-0 whitespace-nowrap px-2 py-0.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                {total} Left
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {label("description", "Verify and sign off completed sessions or submit match absentees here.")}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-medium rounded-xl flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {!loading && bookings.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <CheckCircle2 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {label("empty", "All booking logs perfectly reconciled")}
          </p>
        </div>
      ) : (
        <div className="w-full">
          {/* MOBILE CARDS VIEW */}
          <div className="block sm:hidden divide-y divide-slate-100 -mx-5 -mb-5">
            {bookings.map((booking) => {
              const dateStr = new Date(booking.startTime).toLocaleDateString(
                "en-US",
                {
                  dateStyle: "medium",
                },
              );

              const dueAmount = Number(booking.totalAmountToCollect);

              return (
                <div
                  key={booking.id}
                  className="p-4 space-y-3 hover:bg-slate-50/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-800 text-xs block">
                        {booking.reference_id}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <User size={10} />{" "}
                        {booking.user?.fullName || label("guest", "Guest User")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-xs block bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                        ৳{Number(booking.netAmount).toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {label("venuePitch", "Venue")}
                      </span>
                      <span className="font-semibold text-slate-700 truncate block max-w-[130px]">
                        {booking.business?.name || "SB TURF"}
                      </span>
                      <span className="text-slate-400 block truncate max-w-[130px] text-[10px]">
                        {booking.fieldName}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        {label("schedule", "Schedule")}
                      </span>
                      <span className="font-semibold text-slate-700 block">
                        {dateStr}
                      </span>
                      <span className="text-slate-500 block text-[10px]">
                        {formatSlotTime(booking.startTime, booking.endTime)}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Financial Breakdown */}
                  <div className="bg-slate-50/30 border border-slate-100 rounded-xl p-2.5 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>{label("total", "Total Amount:")}</span>
                      <span>
                        ৳{Number(booking.totalAmount).toLocaleString("en-BD")}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>{label("discount", "Discount:")}</span>
                      <span
                        className={
                          Number(booking.discountAmount) > 0
                            ? "text-rose-600"
                            : ""
                        }
                      >
                        ৳
                        {Number(booking.discountAmount).toLocaleString("en-BD")}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-700 pt-0.5 border-t border-slate-100">
                      <span>{label("net", "Net Amount:")}</span>
                      <span>
                        ৳{Number(booking.netAmount).toLocaleString("en-BD")}
                      </span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>{label("paidOnline", "Paid (Online):")}</span>
                      <span>
                        ৳{Number(booking.paidOnline).toLocaleString("en-BD")}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>{label("dueCash", "Due (Collect Cash):")}</span>
                      <span
                        className={
                          dueAmount > 0 ? "text-amber-600" : "text-slate-500"
                        }
                      >
                        ৳{dueAmount.toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() =>
                        handleResolutionMutation(booking.id, "COMPLETED")
                      }
                      disabled={processingId !== null}
                      className="flex-1 flex items-center justify-center gap-1 h-8 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <CheckCircle2 size={12} />
                      {processingId === booking.id
                        ? label("processing", "Processing...")
                        : label("complete", "Complete")}
                    </button>
                    <button
                      onClick={() =>
                        handleResolutionMutation(booking.id, "NO_SHOW")
                      }
                      disabled={processingId !== null}
                      className="flex-1 flex items-center justify-center gap-1 h-8 text-[11px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <UserX size={12} />
                      {label("noShowAction", "No-Show")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4">{label("bookingInfo", "Booking Info")}</th>
                  <th className="py-3 px-4">{label("venuePitch", "Venue & Pitch")}</th>
                  <th className="py-3 px-4">{label("schedule", "Schedule Detail")}</th>
                  <th className="py-3 px-4">{label("ledger", "Financial Ledger Breakdown")}</th>
                  <th className="py-3 px-4 text-right">{label("actions", "Operational Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                {bookings.map((booking) => {
                  const dueAmount = Number(booking.totalAmountToCollect);

                  return (
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">
                          {booking.reference_id}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <User size={10} />{" "}
                          {booking.user?.fullName || label("guest", "Guest User")}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-700 flex items-center gap-1">
                          <Landmark
                            size={12}
                            className="text-slate-400 shrink-0"
                          />
                          <span className="truncate max-w-[150px]">
                            {booking.business?.name || "SB TURF"}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[160px]">
                          {booking.fieldName}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-700 flex items-center gap-1">
                          <Calendar size={12} className="text-slate-400" />
                          {new Date(booking.startTime).toLocaleDateString(
                            "en-US",
                            {
                              dateStyle: "medium",
                            },
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 pl-4">
                          {formatSlotTime(booking.startTime, booking.endTime)}
                        </div>
                      </td>

                      {/* Desktop Financial Ledger Column Breakdown */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-start gap-2 bg-slate-50/60 border border-slate-100 rounded-xl p-2 max-w-xs text-[11px]">
                          <Coins
                            size={14}
                            className="text-slate-400 mt-0.5 shrink-0"
                          />
                          <div className="w-full space-y-0.5">
                            <div className="flex justify-between gap-4 text-slate-500">
                              <span>{label("grossDiscount", "Gross / Disc:")}</span>
                              <span>
                                ৳
                                {Number(booking.totalAmount).toLocaleString(
                                  "en-BD",
                                )}{" "}
                                /
                                <span
                                  className={
                                    Number(booking.discountAmount) > 0
                                      ? "text-rose-600 font-medium"
                                      : ""
                                  }
                                >
                                  ৳
                                  {Number(
                                    booking.discountAmount,
                                  ).toLocaleString("en-BD")}
                                </span>
                              </span>
                            </div>
                            <div className="flex justify-between font-medium text-slate-700">
                              <span>{label("netPayable", "Net Payable:")}</span>
                              <span>
                                ৳
                                {Number(booking.netAmount).toLocaleString(
                                  "en-BD",
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between text-emerald-600 font-medium">
                              <span>{label("paidOnline", "Paid Online:")}</span>
                              <span>
                                ৳
                                {Number(booking.paidOnline).toLocaleString(
                                  "en-BD",
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold border-t border-slate-200/60 pt-0.5 mt-0.5">
                              <span>{label("dueBalance", "Due Balance:")}</span>
                              <span
                                className={
                                  dueAmount > 0
                                    ? "text-amber-600"
                                    : "text-slate-500"
                                }
                              >
                                ৳{dueAmount.toLocaleString("en-BD")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              handleResolutionMutation(booking.id, "COMPLETED")
                            }
                            disabled={processingId !== null}
                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle2 size={12} />
                            {processingId === booking.id
                              ? label("processing", "Processing...")
                              : label("complete", "Complete")}
                          </button>
                          <button
                            onClick={() =>
                              handleResolutionMutation(booking.id, "NO_SHOW")
                            }
                            disabled={processingId !== null}
                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <UserX size={12} />
                            {label("noShowAction", "No-Show")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 px-1">
              <p className="text-[11px] text-slate-400 font-medium">
                {translatedView ? t("pagination", { page, pages: totalPages, total }) : `Page ${page} of ${totalPages} · ${total} total`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={12} />
                  {label("previous", "Prev")}
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {label("next", "Next")}
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
