/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";

interface OnboardingFormContext {
  fullName?: string;
  phone?: string;
  email?: string;
  businessName?: string;
  slug?: string;
  features?: any[];
  bankName?: string;
  branchName?: string;
  accountName?: string;
  accountNumber?: string;
  bkashNumber?: string;
  bkashAccountType?: string;
  
  allowPlayerCancel?: boolean;
  cancelAllowed?: boolean;
  cancelWindowHours?: number;
  allowPlayerReschedule?: boolean;
  rescheduleWindowHours?: number;
  rescheduleLimitCount?: number;
  // multipleRescheduleCountLimit?: number;
  refundAllowed?: boolean;
  refundPercent?: number;
  minDepositPercent?: number;
  maxSlotsPerBooking?: number;
  maxBookingsPerDay?: number;
  bookingHorizonDays?: number;
  businessTerms?: Array<{ title: string }>;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: OnboardingFormContext;
  isSubmitting: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onConfirm,
  data,
  isSubmitting,
}: ReviewModalProps) {
  if (!isOpen) return null;

  // Helper function to safely parse and display amenity features
  // regardless of whether they are primitive strings or data objects
  const renderFeatures = () => {
    if (!Array.isArray(data.features) || data.features.length === 0) {
      return "None Specified";
    }

    return data.features
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        return item.name || item.label || item.title || JSON.stringify(item);
      })
      .filter(Boolean)
      .join(", ");
  };

  const renderStatusLabel = (flag: boolean | undefined) => {
    if (flag) {
      return <span className="text-green-600 font-black">ALLOWED</span>;
    }
    return <span className="text-rose-500 font-black">NOT ALLOWED</span>;
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl my-8">
        <div>
          <span className="text-xs font-black tracking-[0.2em] text-green-500 uppercase block">
            FINAL REVIEW
          </span>
          <h3 className="text-2xl font-black italic text-slate-900 uppercase">
            Confirm Registration Metrics
          </h3>
        </div>

        {/* Content Container Area */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 text-sm text-slate-700 font-semibold uppercase tracking-wide custom-scrollbar">
          {/* Section 1: Owner Identity */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <h4 className="text-[10px] font-black tracking-widest text-slate-400">
              OWNER CORE IDENTIFICATION
            </h4>
            <p className="text-slate-800 font-black text-base">
              {data.fullName || "[No Name Provided]"}
            </p>
            <p className="text-xs normal-case font-medium text-slate-500">
              Phone Account: {data.phone || "[No Phone Provided]"}{" "}
              {data.email ? `• ${data.email}` : "• [No Email Provided]"}
            </p>
          </div>

          {/* Section 2: Venue settings */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <h4 className="text-[10px] font-black tracking-widest text-slate-400">
              VENUE SETTINGS
            </h4>
            <p className="text-slate-800 font-black text-base">
              {data.businessName || "[No Business Name Provided]"}
            </p>
            <p className="text-xs text-green-600 font-bold normal-case">
              Dynamic Live Route:{" "}
              {data.slug ? `/book/${data.slug}` : "[No Slug Configured]"}
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-2 normal-case leading-relaxed">
              Amenities Set:{" "}
              <span className="font-bold text-slate-800">
                {renderFeatures()}
              </span>
            </p>
          </div>

          {/* Section 3: Operational Rules & Policy Windows */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <h4 className="text-[10px] font-black tracking-widest text-slate-400">
              OPERATIONAL POLICIES & CONTROLS
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium text-slate-600 normal-case">
              <div className="space-y-1">
                <p>
                  • Cancellation Allowed:{" "}
                  {renderStatusLabel(
                    data.cancelAllowed ?? data.allowPlayerCancel,
                  )}
                </p>
                <p>
                  • Cancellation Window:{" "}
                  <span className="font-bold text-slate-800">
                    {data.cancelWindowHours ?? 72} Hours
                  </span>
                </p>
                <p>
                  • Refund Policy:{" "}
                  <span className="font-bold text-slate-800">
                    {data.refundAllowed
                      ? `${data.refundPercent}% Refund`
                      : "No Refund"}
                  </span>
                </p>
                <p>
                  • Minimum Pitch Deposit:{" "}
                  <span className="font-bold text-slate-800">
                    {data.minDepositPercent ?? 10}%
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                <p>
                  • Reschedule Allowed:{" "}
                  {renderStatusLabel(data.allowPlayerReschedule)}
                </p>
                <p>
                  • Reschedule Window:{" "}
                  <span className="font-bold text-slate-800">
                    {data.rescheduleWindowHours ?? 72} Hours
                  </span>
                </p>
                <p>
                  • Max Limit Count:{" "}
                  <span className="font-bold text-slate-800">
                    {data.rescheduleLimitCount ?? 2} Times
                  </span>
                </p>
                <p>
                  • Booking Horizon:{" "}
                  <span className="font-bold text-slate-800">
                    {data.bookingHorizonDays ?? 30} Days Ahead
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-2 mt-1 text-[11px] text-slate-500 normal-case font-medium">
              <p>
                • Limits: Max {data.maxSlotsPerBooking ?? 10} Slots per
                reservation • Max {data.maxBookingsPerDay ?? 3} bookings
                daily/player.
              </p>
              {Array.isArray(data.businessTerms) &&
                data.businessTerms.length > 0 && (
                  <p className="mt-1">
                    • Custom Terms Set: {data.businessTerms.length} Rules
                    formulated.
                  </p>
                )}
            </div>
          </div>

          {/* Section 4: Bank Routing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <h4 className="text-[10px] font-black tracking-widest text-slate-400">
              BANK SETTLEMENT ROUTING
            </h4>
            <p className="text-slate-800 font-black text-xs">
              {data.bankName || "[No Bank Configured]"} —{" "}
              {data.branchName || "[No Branch]"}
            </p>
            <p className="text-xs text-slate-600 normal-case">
              A/C Name: {data.accountName || "—"}
            </p>
            <p className="text-xs text-slate-900 font-mono font-bold">
              A/C No: {data.accountNumber || "—"}
            </p>
          </div>

          {/* Section 5: MFS Routing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <h4 className="text-[10px] font-black tracking-widest text-slate-400">
              MOBILE SETTLEMENT GATEWAYS
            </h4>
            <p className="text-xs text-slate-800 font-black">
              bKash Disbursal Recipient: {data.bkashNumber || "[None Set]"} (
              {data.bkashAccountType || "PERSONAL"})
            </p>
          </div>
        </div>

        {/* Form CTA Actions Pipeline */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-[56px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-black uppercase rounded-2xl text-xs cursor-pointer transition-colors"
          >
            Go Back & Edit
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="h-[56px] bg-green-600 hover:bg-green-500 text-white font-black italic uppercase rounded-2xl text-xs shadow-lg shadow-green-500/10 cursor-pointer flex items-center justify-center transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Registering profile..." : "Confirm & Register"}
          </Button>
        </div>
      </div>
    </div>
  );
}
