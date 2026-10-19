/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useTransition, useRef, useCallback } from "react";
import {
  X,
  CalendarDays,
  ArrowRight,
  Loader2,
  Clock,
  User,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { getBusinessData } from "@/services/business/getBusinessData";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import {
  ActiveBooking,
  AvailabilitySlot,
  BusinessField,
  CalculationDetails,
  renderCurrentBookingWindow,
} from "@/types/booking";
import StepSlotSelection from "./StepSlotSelection";
import StepReviewCheckout from "./StepReviewCheckout";
import { getBookingDetails } from "@/services/booking/getBookingDetails";
import { getFieldAvailability } from "@/services/booking/getFieldAvailability";
import { bookingCheckoutCalculate } from "@/services/booking/bookingCheckoutCalculate";
import { createBookingReschedule } from "@/services/booking/createBookingReschedule";
import { finalizeBookingReschedule } from "@/services/booking/finalizeBookingReschedule";
import { pendingBookingDelete } from "@/services/booking/pendingDelete";
import { IAuthUser } from "@/types/user";
import { useTranslations } from "next-intl";

interface RescheduleBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | null;
  onSuccess?: () => void;
  playerView?: boolean;
  managerView?: boolean;
  ownerView?: boolean;
}

type SubmissionStatus = "idle" | "submitting" | "success";

const formatTimeLeft = (seconds: number) => {
  const mins = Math.floor(seconds / 60);

  const secs = seconds % 60;

  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export default function RescheduleBookingDrawer({
  isOpen,
  onClose,
  bookingId,
  onSuccess,
  playerView = false,
  managerView = false,
  ownerView = false,
}: RescheduleBookingDrawerProps) {
  const translated = playerView || managerView || ownerView;
  const t = useTranslations("player.reschedule");
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(true);
  const [promoLoading, setPromoLoading] = useState(false);

  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle");

  // const [userData, setUserData] = useState<{
  //   role?: string;
  //   isSpecial?: boolean;
  // } | null>(null);
  const [userData, setUserData] = useState<IAuthUser | null>(null);
  const [currentBooking, setCurrentBooking] = useState<ActiveBooking | null>(
    null,
  );
  const [fields, setFields] = useState<BusinessField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [calcData, setCalcData] = useState<CalculationDetails | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [payLater, setPayLater] = useState(false);

  const [cachedSlot, setCachedSlot] = useState<string | null>(null);
  const [cachedDate, setCachedDate] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<number>(300);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);

  // Keeps track of active backend temporary booking IDs across render cycles
  const currentPendingBookingIdRef = useRef<string | null>(null);

  const isAuthorityUser = ["OWNER", "MANAGER", "SUPER ADMIN"].includes(
    userData?.role || "",
  );

  // Safe Centralized Cleanup Hook Wrapper
  const releaseActiveDatabaseHold = useCallback(async () => {
    if (currentPendingBookingIdRef.current) {
      try {
        await pendingBookingDelete(currentPendingBookingIdRef.current);
      } catch (err) {
        console.error("Failed to release temporary database lock:", err);
      }
    }
  }, []);

  // Intercepting Tab Close/Cancel event flows safely
  const handleSafeCloseWorkspace = async () => {
    if (submissionStatus !== "submitting") {
      await releaseActiveDatabaseHold();
      onClose();
    }
  };

  // Triggered when timer counts down to expiration
  const handleTimerExpiration = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    toast.error(translated ? t("expiredHold") : "Your reservation hold has expired. Time slot released.");
    await releaseActiveDatabaseHold();
    setCalcData(null);
    setCachedSlot(null);
    setCachedDate(null);
    setStep(1);
    setTimeLeft(300);
  }, [releaseActiveDatabaseHold, playerView, t]);

  // Track state changes when structural user closes drawer/panel
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSubmissionStatus("idle");
      setCalcData(null);
      currentPendingBookingIdRef.current = null;
    }
  }, [isOpen]);

  // Handle countdown timers securely
  useEffect(() => {
    if (step === 2 && calcData && submissionStatus === "idle") {
      setTimeLeft(300);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerExpiration();
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, calcData, submissionStatus, handleTimerExpiration]);

  useEffect(() => {
    if (!isOpen || !bookingId) return;

    const initializeRescheduleFlow = async () => {
      setInitialFetchLoading(true);
      try {
        const result = await getUserInfo();

        const user =
          result.status !== "error" && result.status !== "unauthenticated"
            ? result.user
            : null;

        setUserData(user);

        const bookingResult = await getBookingDetails(bookingId);
        if (!bookingResult.success) throw new Error(bookingResult.message);

        const baseBooking = bookingResult.data;
        setCurrentBooking(baseBooking);

        const businessSlug = baseBooking.business?.slug;
        if (!businessSlug)
          throw new Error(translated ? t("initializationError") : "Business slug target reference not discovered.");

        const business = await getBusinessData(businessSlug);
        const dynamicFields: BusinessField[] = business?.fields || [];
        setFields(dynamicFields);

        if (dynamicFields.length > 0) {
          const match = dynamicFields.find((f) => f.id === baseBooking.fieldId);
          setSelectedFieldId(match ? match.id : dynamicFields[0].id);
        }
      } catch (err: any) {
        toast.error(err.message || (translated ? t("initializationError") : "Initialization setup error."));
        onClose();
      } finally {
        setInitialFetchLoading(false);
      }
    };

    initializeRescheduleFlow();
  }, [isOpen, bookingId, onClose, playerView, t]);

  useEffect(() => {
    if (!isOpen || !selectedFieldId || !selectedDate) return;

    const generateAvailableSlots = async () => {
      setSelectedSlot(null);
      try {
        const dateString = format(selectedDate, "yyyy-MM-dd");
        const result = await getFieldAvailability({
          fieldId: selectedFieldId,
          date: dateString,
        });

        if (result.success) {
          setAvailableSlots(result.data || []);
        } else {
          toast.error(result.message);
        }
      } catch (err: any) {
        toast.error(
          err.message || (translated ? t("availabilityError") : "Failed to parse system availability matrix."),
        );
      }
    };

    generateAvailableSlots();
  }, [selectedDate, selectedFieldId, isOpen, playerView, t]);

  if (!isOpen) return null;

  const handleProceedToReview = async () => {
    if (
      !selectedFieldId ||
      !selectedDate ||
      !selectedSlot ||
      !bookingId ||
      !currentBooking?.business?.id
    )
      return toast.error(translated ? t("requiredFields") : "Please select all required fields.");

    const currentDateString = format(selectedDate, "yyyy-MM-dd");

    // Skip creating a new pending slot if selections haven't changed from cached options
    if (
      calcData &&
      cachedSlot === selectedSlot &&
      cachedDate === currentDateString
    ) {
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      // CLEAR PREVIOUS STACK RECORDS: If they previously held a slot, free it up before reserving a new one
      await releaseActiveDatabaseHold();

      const [startTime, endTime] = selectedSlot.split("-");

      const rescheduleRes = await createBookingReschedule({
        businessId: currentBooking?.business?.id,
        fieldId: selectedFieldId,
        bookingId: bookingId,
        date: currentDateString,
        slot: { startTime, endTime },
        manualPlayerPhone: currentBooking?.manualPlayerPhone,
        manualPlayerName: currentBooking?.manualPlayerName,
      });

      if (!rescheduleRes.success) throw new Error(rescheduleRes.message);

      const pendingBookingId = rescheduleRes.data?.id;
      const pendingBookingCartId = rescheduleRes.data?.cartId;
      setCartId(pendingBookingCartId);
      if (!pendingBookingId)
        throw new Error(translated ? t("pendingTokenError") : "Pending booking token structural anomaly.");

      // Link newly reserved ID to our safe reference engine pointer
      currentPendingBookingIdRef.current = pendingBookingId;

      const calcResult = await bookingCheckoutCalculate({
        newBookingId: pendingBookingId,
      });
      if (!calcResult.success)
        throw new Error(
          calcResult.message || (translated ? t("settlementRulesError") : "Could not retrieve settlement balance rules."),
        );

      setCalcData(calcResult.data);
      setCachedSlot(selectedSlot);
      setCachedDate(currentDateString);
      setAppliedPromo("");
      setPromoCode("");
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || (translated ? t("processingError") : "Processing sequence transaction error."));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromo = async () => {
    if (!calcData?.newBookingId || !promoCode.trim()) return;

    setPromoLoading(true);
    try {
      const trimmedPromo = promoCode.trim();
      const result = await bookingCheckoutCalculate({
        newBookingId: calcData.newBookingId,
        promoCode: trimmedPromo,
      });

      if (!result.success)
        throw new Error(result.message || (translated ? t("invalidPromo") : "Invalid promo code."));

      setCalcData(result.data);
      setAppliedPromo(trimmedPromo);
      toast.success(translated ? t("promoApplied") : "Promo code applied successfully!");
    } catch (err: any) {
      toast.error(err.message || (translated ? t("promoFailed") : "Failed to apply promo code."));
    } finally {
      setPromoLoading(false);
    }
  };

  const handleFinalConfirmation = async () => {
    if (!calcData) return;

    setSubmissionStatus("submitting");
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const shouldBypassPayment =
        isAuthorityUser || payLater || calcData.remainingPayable <= 0;

      const result = await finalizeBookingReschedule({
        newBookingId: calcData.newBookingId,
        cartId: calcData.cartId,
        shouldBypassPayment,
      });

      if (!result.success) throw new Error(result.message);

      // Successfully processed on backend, disconnect tracking handler to prevent accidental cancellations during unmount
      currentPendingBookingIdRef.current = null;

      if (result.data?.gatewayUrl) {
        window.location.href = result.data.gatewayUrl;
        return;
      }

      setSubmissionStatus("success");
      toast.success(translated ? t("completed") : "Reschedule completed successfully!");

      setTimeout(() => {
        startTransition(() => {
          if (onSuccess) onSuccess();
        });
        onClose();
      }, 2000);
    } catch (err: any) {
      setSubmissionStatus("idle");
      toast.error(err.message || (translated ? t("finalizeFailed") : "Failed to finalize reschedule operations."));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
      {/* BACKGROUND DROP CLICK BACKDROP LAYER */}
      <div
        className="absolute inset-0 -z-10"
        onClick={handleSafeCloseWorkspace}
      />

      <div className="w-full sm:w-[460px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header Block */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {translated ? t("workspace") : "Reschedule Workspace"}
            </h3>
            {currentBooking && (
              <p className="text-[10px] text-slate-400 font-bold tracking-wide uppercase mt-0.5">
                {translated ? t("reference") : "Ref"}: {currentBooking.reference_id}
              </p>
            )}
          </div>
          <button
            onClick={handleSafeCloseWorkspace}
            disabled={submissionStatus === "submitting"}
            className="p-2 -mr-1 hover:bg-slate-200/60 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {initialFetchLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            <span className="text-xs font-semibold">
              {translated ? t("initializing") : "Validating record matrices..."}
            </span>
          </div>
        ) : submissionStatus === "submitting" ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 p-6 text-center animate-in fade-in duration-200">
            <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
            <h4 className="text-sm font-bold text-slate-800">
              {translated ? t("submitting") : "Updating Schedule Configuration"}
            </h4>
            <p className="text-xs text-slate-500 max-w-[280px]">
              {translated ? t("submittingDescription") : "Securing transaction blocks and validating new allocation slots. Please hold on..."}
            </p>
          </div>
        ) : submissionStatus === "success" ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 p-6 text-center animate-in zoom-in-95 duration-300">
            <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {translated ? t("successTitle") : "Reschedule Confirmed!"}
            </h4>
            <p className="text-xs text-slate-500 max-w-[280px]">
              {translated ? t("successDescription") : "Your reservation data has been updated. Refreshing workspace matrices..."}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {step === 2 && calcData && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold">
                  <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
                  <span>{translated ? t("temporaryHold") : "Temporary Slot Hold Active"}</span>
                </div>
                <span className="bg-amber-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                  {formatTimeLeft(timeLeft)}
                </span>
              </div>
            )}

            {currentBooking && (
              <div className="space-y-2">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs text-slate-600 font-medium flex items-start gap-2.5">
                  <CalendarDays className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {translated ? t("currentWindow") : "Current Active Window"}
                    </span>
                    <span className="text-slate-800 font-semibold">
                      {renderCurrentBookingWindow(currentBooking)}
                    </span>
                  </div>
                </div>

                {currentBooking.manualPlayerPhone && (
                  <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 block uppercase tracking-wide">
                          {translated ? t("offlinePlayer") : "Offline Player Linked"}
                      </span>
                      <span className="font-semibold text-slate-800">
                        {currentBooking.manualPlayerName || (translated ? t("unnamedPlayer") : "Unnamed Player")} (
                        {currentBooking.manualPlayerPhone})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 1 ? (
              <StepSlotSelection
                fields={fields}
                selectedFieldId={selectedFieldId}
                setSelectedFieldId={setSelectedFieldId}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                playerView={playerView}
        managerView={managerView}
        ownerView={ownerView}
              />
            ) : (
              calcData && (
                <StepReviewCheckout
                  calcData={calcData}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  appliedPromo={appliedPromo}
                  promoLoading={promoLoading}
                  loading={loading}
                  handleApplyPromo={handleApplyPromo}
                  userData={userData}
                  isAuthorityUser={isAuthorityUser}
                  payLater={payLater}
                  setPayLater={setPayLater}
                  playerView={playerView}
        managerView={managerView}
        ownerView={ownerView}
                />
              )
            )}
          </div>
        )}

        {/* Action Sticky Footer Bar */}
        {!initialFetchLoading && submissionStatus === "idle" && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
            {step === 2 && (
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                disabled={loading || promoLoading}
                className="text-xs font-bold rounded-xl h-10 text-slate-500 hover:bg-slate-200/50"
              >
                {translated ? t("back") : "Back"}
              </Button>
            )}

            <Button
              disabled={
                (step === 1 && !selectedSlot) || loading || promoLoading
              }
              onClick={
                step === 1 ? handleProceedToReview : handleFinalConfirmation
              }
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 rounded-xl shadow-sm transition-all"
            >
              {loading ? (
                (translated ? t("processing") : "Processing Request...")
              ) : step === 1 ? (
                <span className="flex items-center justify-center gap-1.5">
                  {translated ? t("reviewChanges") : "Review Changes"} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              ) : isAuthorityUser ? (
                (translated ? t("confirmAdminOverride", { timeLeft: formatTimeLeft(timeLeft) }) : `Confirm Admin Override (${formatTimeLeft(timeLeft)})`)
              ) : payLater ? (
                (translated ? t("bookPayLater", { timeLeft: formatTimeLeft(timeLeft) }) : `Book Now & Pay Later (${formatTimeLeft(timeLeft)})`)
              ) : calcData?.remainingPayable === 0 ? (
                (translated ? t("confirm", { timeLeft: formatTimeLeft(timeLeft) }) : `Confirm Reschedule (${formatTimeLeft(timeLeft)})`)
              ) : calcData && calcData.refundAmount > 0 ? (
                (translated ? t("requestRefund", { timeLeft: formatTimeLeft(timeLeft) }) : `Confirm & Request Refund (${formatTimeLeft(timeLeft)})`)
              ) : (
                (translated ? t("payAndConfirm", { amount: calcData?.remainingPayable.toFixed(2) || "0.00", timeLeft: formatTimeLeft(timeLeft) }) : `Pay TK ${calcData?.remainingPayable.toFixed(2)} & Confirm (${formatTimeLeft(timeLeft)})`)
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
