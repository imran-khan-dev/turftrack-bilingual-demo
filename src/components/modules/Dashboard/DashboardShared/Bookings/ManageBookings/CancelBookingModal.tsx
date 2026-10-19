/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { X, AlertTriangle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cancelBooking } from "@/services/booking/cancelBooking";
import { useTranslations } from "next-intl";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  bookingRef?: string; // e.g., #BK-8839
  bookingDetails?: string; // e.g., "Court 2 - 7:00 PM"
  onSuccess?: () => void;
  playerView?: boolean;
  managerView?: boolean;
  ownerView?: boolean;
}

export default function CancelBookingModal({
  isOpen,
  onClose,
  bookingId,
  bookingRef,
  bookingDetails,
  onSuccess,
  playerView = false,
  managerView = false,
  ownerView = false,
}: CancelBookingModalProps) {
  const translated = playerView || managerView || ownerView;
  const t = useTranslations("player.cancelDialog");
  const [loading, setLoading] = useState(false);

  const handleCancelBooking = async () => {
    if (!bookingId) return;

    setLoading(true);

    toast.promise(
      async () => {
        const result = await cancelBooking(bookingId);

        if (!result.success) {
          throw new Error(result.error || (translated ? t("failed") : "Failed to cancel the booking."));
        }

        // Execute local UI closure and state propagation updates
        if (onSuccess) onSuccess();
        onClose();
      },
      {
        loading: translated ? t("loading") : "Processing cancellation request...",
        success: () => {
          setLoading(false);
          return translated ? t("success") : "Booking cancelled successfully.";
        },
        error: (err: Error) => {
          setLoading(false);
          return err.message;
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm mb-0">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header Block */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {translated ? t("title") : "Cancel Reservation"} {bookingRef ? `(${bookingRef})` : ""}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 -mr-1 rounded-xl hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50 touch-manipulation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {translated ? t("confirmQuestion") : "Are you sure you want to cancel your reservation? This action will immediately release this schedule block back into public availability."}
          </p>

          {bookingDetails && (
            <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-xs font-semibold text-slate-700">
              <CalendarDays className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {translated ? t("details") : "Reservation Details"}
                </span>
                <span className="text-slate-800 break-words">
                  {bookingDetails}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button Set */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2 px-5 py-3 sm:bg-slate-50/50 sm:border-t sm:border-slate-100">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="h-10 sm:h-9 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 w-full sm:w-auto"
          >
            {translated ? t("keep") : "Keep Reservation"}
          </Button>
          <Button
            onClick={handleCancelBooking}
            disabled={loading}
            className="h-10 sm:h-9 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm px-4 focus-visible:ring-2 focus-visible:ring-red-400 w-full sm:w-auto"
          >
            {loading ? (translated ? t("processing") : "Processing...") : (translated ? t("confirming") : "Confirm Cancellation")}
          </Button>
        </div>
      </div>
    </div>
  );
}
