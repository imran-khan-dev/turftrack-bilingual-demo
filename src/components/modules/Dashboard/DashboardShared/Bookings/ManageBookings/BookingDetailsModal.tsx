/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Info,
  DollarSign,
  AlertTriangle,
  Percent,
  CheckCircle2,
  XCircle,
  Bell,
  RefreshCw,
  Coins,
  Mail,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { getBookingDetails } from "@/services/booking/getBookingDetails";
import { useTranslations } from "next-intl";

interface BookingDetailsModalProps {
  bookingId: string | null;
  isOpen: boolean;
  onClose: () => void;
  playerView?: boolean;
  managerView?: boolean;
  ownerView?: boolean;
}

export default function BookingDetailsModal({
  bookingId,
  isOpen,
  onClose,
  playerView = false,
  managerView = false,
  ownerView = false,
}: BookingDetailsModalProps) {
  const translated = playerView || managerView || ownerView;
  const t = useTranslations("player.bookingDetails");
  const extra = useTranslations("player.bookingDetailsExtra");
  const finance = useTranslations("player.bookingDetailsFinance");
  const statusText = (status: string) => {
    const key = `statusLabels.${status}`;
    return t.has(key) ? t(key) : status;
  };
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  useEffect(() => {
    if (!isOpen || !bookingId) return;

    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBookingDetails(bookingId);
        const data = result.data;

        setBooking(data);
      } catch (err: any) {
        setError(err.message || (translated ? t("unexpectedError") : "An unexpected error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [isOpen, bookingId, backendUrl]);

  if (!isOpen) return null;

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Logic condition rule to show totalAmountToCollect: Only if PENDING or PARTIAL payment status
  const shouldShowDueToCollect =
    booking?.paymentStatus === "PENDING" ||
    booking?.paymentStatus === "PARTIAL";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm mb-0">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header Block */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {translated ? t("title") : "Booking Management Registry"}
              </h3>
              {booking?.reference_id && (
                <p className="text-[10px] font-mono text-slate-400">
                  {translated ? t("reference") : "Ref"}: #{booking.reference_id.toUpperCase()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Container Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-2">
              <div className="h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500">
                {translated ? t("loading") : "Fetching live entity records..."}
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4 bg-red-50/50 border border-red-100 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && booking && (
            <>
              {/* Top Row Status Pills Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    {translated ? t("bookingStatus") : "Booking Status"}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                      booking.status === "CONFIRMED" ||
                        booking.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : booking.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200",
                    )}
                  >
                    {translated ? statusText(booking.status) : booking.status}
                  </span>
                </div>

                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    {translated ? t("paymentStatus") : "Payment Status"}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                      booking.paymentStatus === "PAID"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200",
                    )}
                  >
                    {translated ? statusText(booking.paymentStatus) : booking.paymentStatus}
                  </span>
                </div>

                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                      {translated ? t("reminderStatus") : "Auto Reminder Status"}
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mt-1">
                      <Bell
                        className={cn(
                          "h-3.5 w-3.5",
                          booking.reminderSent
                            ? "text-emerald-500"
                            : "text-slate-300",
                        )}
                      />
                      {booking.reminderSent ? (translated ? t("sent") : "Sent (T-60 Min)") : (translated ? t("notSent") : "Not Sent")}
                    </span>
                  </div>
                </div>

                <div className="p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    {translated ? t("field") : "Field Arena / Pitch"}
                  </span>
                  <span className="text-xs font-bold text-green-600 block truncate mt-0.5">
                    {booking.field?.name || booking.fieldName}
                  </span>
                </div>
              </div>

              {/* Reschedule Timeline Context Banner Block */}
              {(booking.rescheduledFrom || booking.rescheduledTo) && (
                <div className="border rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100">
                  {/* Case A: This booking came from an older booking */}
                  {booking.rescheduledFrom && (
                    <div className="p-3.5 bg-green-50/60 flex items-start gap-3 text-xs text-green-800">
                      <RefreshCw className="h-4 w-4 text-green-800 mt-0.5 animate-pulse" />
                      <div className="flex-1">
                        <p className="font-bold">{translated ? extra("rescheduleEntry") : "Rescheduled Activity Entry"}</p>
                        <p className="text-green-800 font-medium mt-0.5">
                          {translated ? extra("previousSlot", { reference: booking.rescheduledFrom.reference_id?.toUpperCase() || "", date: formatDateTime(booking.rescheduledFrom.startTime) }) : <>This current booking slot was instantiated by rescheduling a previous original slot <span className="font-mono font-bold bg-green-100 px-1 py-0.25 rounded text-[11px]">#{booking.rescheduledFrom.reference_id?.toUpperCase()}</span> which was slate-timed for {formatDateTime(booking.rescheduledFrom.startTime)}.</>}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Case B: This booking was forwarded/rescheduled into a newer one */}
                  {booking.rescheduledTo && (
                    <div className="p-3.5 bg-amber-50/70 flex items-start gap-3 text-xs text-amber-800">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold uppercase tracking-wide text-amber-900">
                          {translated ? extra("superseded") : "Slot Superceded & Moved"}
                        </p>
                        <p className="text-amber-700 font-medium mt-0.5">
                          {translated ? extra("movedSlot", { reference: booking.rescheduledTo.reference_id?.toUpperCase() || "", date: formatDateTime(booking.rescheduledTo.startTime) }) : <>Attention: This explicit session item is no longer active because it has been forwarded onto a new rescheduled registry slot reference: <span className="font-mono font-bold bg-amber-100 px-1 py-0.25 rounded text-[11px] text-amber-900">#{booking.rescheduledTo.reference_id?.toUpperCase()}</span> set for execution at {formatDateTime(booking.rescheduledTo.startTime)}.</>}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Grid split for Schedule vs Profile Accounts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Schedule Container */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> {translated ? t("schedule") : "Schedule Metrics"}
                  </h4>
                  <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm space-y-3 text-xs font-semibold text-slate-600">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                          {translated ? t("startsAt") : "Starts At"}
                        </span>
                        <p className="text-slate-800 font-bold">
                          {formatDateTime(booking.startTime)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                          {translated ? t("endsAt") : "Ends At"}
                        </span>
                        <p className="text-slate-800 font-bold">
                          {formatDateTime(booking.endTime)}
                        </p>
                      </div>
                    </div>
                    {booking.business && (
                      <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                            {translated ? t("location") : "Facility Location"}
                          </span>
                          <p className="text-slate-800 font-bold">
                            {booking.business.name}
                          </p>
                          <p className="text-slate-500 font-medium text-[11px] mt-0.5">
                            {booking.business.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Profile Client Assignment (Buyer and BookFor layout) */}
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-slate-400" /> {translated ? t("account") : "Account Assignment"}
                  </h4>
                  <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm space-y-4 text-xs font-semibold text-slate-600">
                    {/* Buyer Details */}
                    {booking.buyer ? (
                      <div className="flex gap-3 items-start">
                        <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 font-bold text-slate-600 text-xs shrink-0">
                          <User className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                            {translated ? t("buyer") : "Buyer"}
                          </span>
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {booking.buyer.name}
                          </p>
                          <div className="flex flex-col gap-0.5 text-slate-500 font-medium text-[11px]">
                            <p className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />{" "}
                              {booking.buyer.contact}
                            </p>
                            {booking.buyer.email &&
                              booking.buyer.email !== "N/A" && (
                                <p className="flex items-center gap-1 truncate">
                                  <Mail className="h-3 w-3 text-slate-400" />{" "}
                                  {booking.buyer.email}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                            {translated ? t("buyer") : "Buyer"}
                        </span>
                        <p className="text-slate-400 font-medium">
                          {translated ? extra("noBuyer") : "No historical buyer context mapped."}
                        </p>
                      </div>
                    )}

                    {/* Divider Line */}
                    <div className="border-t border-slate-100" />

                    {/* Book For Details */}
                    {booking.bookFor ? (
                      <div className="flex gap-3 items-start">
                        <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 font-bold text-green-600 text-xs shrink-0">
                          <UserCheck className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                              {translated ? t("bookFor") : "Book For"}
                            </span>
                            {(booking.manualPlayerName ||
                              booking.manualPlayerPhone) && (
                              <span className="text-[9px] bg-amber-50 border border-amber-200 text-amber-700 font-bold px-1 py-0.25 rounded uppercase tracking-wide shrink-0">
                                {translated ? t("manualEntry") : "Manual Entry"}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {booking.bookFor.name}
                          </p>
                          <div className="flex flex-col gap-0.5 text-slate-500 font-medium text-[11px]">
                            <p className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />{" "}
                              {booking.bookFor.contact}
                            </p>
                            {booking.bookFor.email &&
                              booking.bookFor.email !== "N/A" && (
                                <p className="flex items-center gap-1 truncate">
                                  <Mail className="h-3 w-3 text-slate-400" />{" "}
                                  {booking.bookFor.email}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          {translated ? t("bookFor") : "Book For"}
                        </span>
                        <p className="text-slate-400 font-medium">
                          {translated ? extra("noBookFor") : "No deployment profile mapped."}
                        </p>
                      </div>
                    )}

                    {/* Dynamic Player Context Tier Flags */}
                    {booking.playerContext && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">
                            Special Tier Status
                          </span>
                          <p className="text-slate-800 font-bold text-xs">
                            {booking.playerContext.isSpecial ? (translated ? t("yes") : "Yes") : (translated ? t("no") : "No")}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">
                            Membership Status
                          </span>
                          <p className="text-slate-800 font-bold text-xs">
                            {booking.playerContext.status}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Core Financial Ledger Split */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />{" "}
                  {translated ? finance("title") : "Financial Settlement & Transactions"}
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white text-xs font-semibold">
                  {/* Ledger Matrix Header */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/50 p-4 gap-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                        {translated ? finance("grossPrice") : "Gross Price"}
                      </span>
                      <p className="text-slate-800 font-bold text-sm">
                        ৳{Number(booking.totalAmount || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5 flex items-center gap-0.5">
                        {translated ? finance("discount") : "Discount Given"}{" "}
                        <Percent className="h-2.5 w-2.5 text-slate-400" />
                      </span>
                      <p className="text-emerald-600 font-bold text-sm">
                        -৳{Number(booking.discountAmount || 0).toFixed(2)}
                      </p>
                      <span className="text-[9px] text-slate-400 block font-normal">
                        {translated ? finance("type") : "Type:"} {booking.discountType || "PERCENT"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                        {translated ? finance("netAmount") : "Net Bill Amount"}
                      </span>
                      <p className="text-slate-900 font-extrabold text-sm">
                        ৳{Number(booking.netAmount || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-0.5">
                        {translated ? finance("paidOnline") : "Paid Online"}
                      </span>
                      <p className="text-green-600 font-extrabold text-sm">
                        ৳{Number(booking.paidOnline || 0).toFixed(2)}
                      </p>
                      {booking.onlinePaidAt && (
                        <span className="text-[9px] text-slate-400 block font-normal font-mono">
                          {formatDateTime(booking.onlinePaidAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cash Collections Segment */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/20 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        {translated ? finance("cashCollected") : "Cash Collected at Arena"}
                      </span>
                      <p className="text-slate-800 font-bold text-sm">
                        ৳{Number(booking.paidCash || 0).toFixed(2)}
                      </p>
                      {booking.cashCollectedAt && (
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                          {translated ? finance("timestamp") : "Timestamp:"} {formatDateTime(booking.cashCollectedAt)}
                        </p>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                        {translated ? finance("cashAgent") : "Cash Collection Agent Details"}
                      </span>
                      <p className="text-slate-700 font-bold text-xs">
                        {booking.cashCollectedBy ||
                          (translated ? finance("noCash") : "No cash ledger collected yet")}
                      </p>
                    </div>
                  </div>

                  {/* Overpaid Refund Segment (Reschedule Delta) */}
                  {Number(booking.overPaidRefund || 0) > 0 && (
                    <div
                      className={cn(
                        "p-4 border-b border-slate-100 flex justify-between items-center transition-colors",
                        booking.isOverPaidRefunded
                          ? "bg-emerald-50/40 text-emerald-900"
                          : "bg-green-50/40 text-green-900",
                      )}
                    >
                      <div className="flex gap-2.5 items-start">
                        <Coins
                          className={cn(
                            "h-4 w-4 mt-0.5",
                            booking.isOverPaidRefunded
                              ? "text-emerald-500"
                              : "text-green-500",
                          )}
                        />
                        <div>
                          <span
                            className={cn(
                              "text-[10px] uppercase font-bold tracking-wider block",
                              booking.isOverPaidRefunded
                                ? "text-emerald-700"
                                : "text-green-600",
                            )}
                          >
                            {translated ? finance("overpaidRefund") : "Reschedule Overpayment Refund"}
                          </span>
                          <p className="text-[11px] font-medium text-slate-500">
                            {translated ? (booking.isOverPaidRefunded ? finance("refundPaid") : finance("refundDue")) : (booking.isOverPaidRefunded ? "This down-shifted rescheduling delta amount has been successfully disbursed back to the user." : "Refundable balance generated by down-shifting total cost via rescheduling. (Action required)")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span
                          className={cn(
                            "text-base font-black",
                            booking.isOverPaidRefunded
                              ? "text-emerald-600"
                              : "text-green-600",
                          )}
                        >
                          ৳{Number(booking.overPaidRefund).toFixed(2)}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                            booking.isOverPaidRefunded
                              ? "bg-emerald-100/50 text-emerald-700 border-emerald-200"
                              : "bg-green-100/50 text-green-700 border-green-200",
                          )}
                        >
                          {booking.isOverPaidRefunded
                            ? (translated ? finance("refunded") : "Refunded")
                            : (translated ? finance("pendingPayout") : "Pending Payout")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Conditional Render Rules for Dues */}
                  {shouldShowDueToCollect && (
                    <div className="p-4 bg-amber-50/50 border-b border-slate-100 flex justify-between items-center text-amber-900">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block">
                          {translated ? finance("outstandingDue") : "Outstanding Pipeline Due"}
                        </span>
                        <p className="text-[11px] font-medium text-slate-500">
                          {translated ? finance("remainingDue") : "Remaining collectible amount after partial or pending staging values"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-amber-600">
                          ৳
                          {Number(booking.totalAmountToCollect || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Platform vs Gateway Settlement Matrix */}
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] font-semibold text-slate-500">
                    <div>
                      <span className="text-[9px] uppercase tracking-wide text-slate-400 block mb-0.5">
                        Platform Fee Rate
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <p className="text-slate-800 font-bold">
                          {Number(booking.platformFeeRate || 0)}%
                        </p>
                        {booking.platformFeeType && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded capitalize">
                            {booking.platformFeeType.toLowerCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wide text-slate-400 block mb-0.5">
                        Platform Cut Amount
                      </span>
                      <p className="text-slate-800 font-bold">
                        ৳{Number(booking.platformAmount || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wide text-slate-400 block mb-0.5">
                        Gateway Fee Charge
                      </span>
                      <p className="text-slate-800 font-bold">
                        ৳{Number(booking.gatewayFeeAmount || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wide text-slate-400 block mb-0.5">
                        Gateway Settled Net
                      </span>
                      <p className="text-slate-900 font-bold">
                        ৳{Number(booking.gatewaySettledAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Owner Settlement Bar Container */}
                  <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between text-[11px]">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-wide text-slate-400 block">
                          Owner Receivable
                        </span>
                        <p className="text-slate-800 font-bold text-xs">
                          ৳{Number(booking.ownerReceivable || 0).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wide text-slate-400 block">
                          Merchant Settled Status
                        </span>
                        <span className="flex items-center gap-1 font-bold text-slate-700 mt-0.5">
                          {booking.ownerSettled ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                              Settled{" "}
                              {booking.ownerSettledAt && (
                                <span className="font-normal text-slate-400 font-mono">
                                  ({formatDateTime(booking.ownerSettledAt)})
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 text-slate-300" />{" "}
                              Unsettled Pipeline
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Platform Fee Settlement Logs */}
                    <div className="flex items-center gap-1.5 border-l pl-4 border-slate-200">
                      <div>
                        <span className="text-[9px] uppercase tracking-wide text-slate-400 block">
                          Platform Fee Settled
                        </span>
                        <span className="flex items-center gap-1 font-bold text-slate-700 mt-0.5">
                          {booking.isFeeSettled ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                              Fees Transferred{" "}
                              {booking.feeSettledAt && (
                                <span className="font-normal text-slate-400 font-mono">
                                  ({formatDateTime(booking.feeSettledAt)})
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 text-slate-300" />{" "}
                              Open Balance
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Waived Fee Audit Panel */}
              {booking.isFeeWaived && (
                <div className="p-3 bg-amber-50/40 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-semibold text-amber-800">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-amber-500" />
                    <span>
                      Platform management fees have been explicitly waived for
                      this booking entry.
                    </span>
                  </div>
                  {booking.waivedAt && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Waived Stamp: {formatDateTime(booking.waivedAt)}
                    </span>
                  )}
                </div>
              )}

              {/* Exception Logs Matrix (Cancellations / Refunds) */}
              {(booking.status === "CANCELLED" ||
                Number(booking.refundAmount || 0) > 0) && (
                <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-xl space-y-2 text-xs font-semibold text-rose-800">
                  <h4 className="text-[10px] uppercase font-bold text-rose-500 tracking-wider flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" /> Cancellation & Refund
                    Matrix
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {booking.cancelReason && (
                      <div className="col-span-1 sm:col-span-2">
                        <span className="text-[10px] text-rose-400 block font-bold uppercase tracking-wide">
                          Reason Statement
                        </span>
                        <p className="text-rose-900 font-medium mt-0.5 italic">
                          {booking.cancelReason}
                        </p>
                      </div>
                    )}
                    {booking.cancelledAt && (
                      <div>
                        <span className="text-[10px] text-rose-400 block font-bold uppercase tracking-wide">
                          Cancelled Stamp
                        </span>
                        <p className="text-rose-900 font-bold">
                          {formatDateTime(booking.cancelledAt)}
                        </p>
                      </div>
                    )}
                    {Number(booking.refundAmount || 0) > 0 && (
                      <div>
                        <span className="text-[10px] text-rose-400 block font-bold uppercase tracking-wide">
                          Refund Matrix Details
                        </span>
                        <p className="text-rose-900 font-bold">
                          ৳{Number(booking.refundAmount).toFixed(2)}
                        </p>
                        {booking.refundCompletedAt && (
                          <span className="text-[9px] text-slate-400 block font-mono">
                            Completed:{" "}
                            {formatDateTime(booking.refundCompletedAt)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
