/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Calendar as CalendarIcon,
  Layers,
  Building2,
} from "lucide-react";

import { createBooking } from "@/services/booking/createBooking";
import { BusinessField } from "@/types/business";
import { ICreateBookingPayload, SelectedSlot, Slot } from "@/types/booking";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import CustomerDetailsForm from "./CustomerDetailsForm";
import SuccessOverlay from "./SuccessOverlay";
import { formatTo12Hour } from "@/utils/formatTime";
import ManulBookingSummarySidebar from "./ManualBookingSummarySidebar";
import { getAccessibleBusinesses } from "@/utils/getAccessibleBusinesses";
import { getFieldAvailability } from "@/services/booking/getFieldAvailability";
import { getBusinessData } from "@/services/business/getBusinessData";
import { manualBookingCancelDraft } from "@/services/booking/manualBookingCancelDraft";
import { bookingCheckoutCalculate } from "@/services/booking/bookingCheckoutCalculate";
import { confirmBookingAsAuthority } from "@/services/booking/confirmBookingAsAuthority";
import { formatLocalDate } from "@/utils/formatLocalDate";
import { useTranslations } from "next-intl";

interface Props {
  user: {
    businesses?: Array<{ id: string; name: string; slug: string }>;
    [key: string]: any;
  };
  managerView?: boolean;
  ownerView?: boolean;
}

export interface CheckoutCalculations {
  sumUpTotalAmount: number;
  finalDiscount: number;
  payableAmount: number;
}

export default function CreateManualBooking({ user, managerView = false, ownerView = false }: Props) {
  const t = useTranslations("manager.manualBooking");
  const translatedView = managerView || ownerView;
  const label = (key: string, fallback: string) => translatedView ? t(key as never) : fallback;
  const businessesList = useMemo(() => getAccessibleBusinesses(user), [user]);

  const [selectedBusinessSlug, setSelectedBusinessSlug] = useState<string>(
    businessesList[0]?.slug || "",
  );

  const [fields, setFields] = useState<BusinessField[]>([]);
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(false);

  // Booking Form State
  const [selectedField, setSelectedField] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

  // Customer Details
  const [manualPlayerName, setManualPlayerName] = useState("");
  const [manualPlayerPhone, setManualPlayerPhone] = useState("");
  const [promoInput, setPromoInput] = useState("");

  // System Booking Locks & Flags
  const [activeCartId, setActiveCartId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isCalculatingCheckout, setIsCalculatingCheckout] = useState(false);

  // Success Confirmation State
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string | null>(
    null,
  );

  // Billing Calculations
  const [calculations, setCalculations] = useState<CheckoutCalculations | null>(
    null,
  );
  const [promoMessage, setPromoMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 5 Minutes Hold Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formattedDateString = useMemo(() => {
    return formatLocalDate(selectedDate);
  }, [selectedDate]);

  const isPhoneValid = useMemo(() => {
    const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
    return bdPhoneRegex.test(manualPlayerPhone.trim());
  }, [manualPlayerPhone]);

  const isLockDisabled = useMemo(() => {
    return selectedSlots.length === 0 || !isPhoneValid || isSubmitting;
  }, [selectedSlots, isPhoneValid, isSubmitting]);

  const resetHoldingState = () => {
    setActiveCartId(null);
    setCalculations(null);
    setPromoMessage(null);
    setTimeLeft(null);
  };

  const startNewBookingSession = () => {
    setConfirmedBookingRef(null);
    setSelectedSlots([]);
    setManualPlayerName("");
    setManualPlayerPhone("");
    setPromoInput("");
    resetHoldingState();
    if (selectedField) fetchAvailability(selectedField, formattedDateString);
  };

  const fetchAvailability = async (fieldId: string, dateStr: string) => {
    try {
      setIsLoadingSlots(true);
      const result = await getFieldAvailability({ fieldId, date: dateStr });

      if (result.success) {
        setSlots(result.data || []);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(label("slotsLoadFailed", "Failed to load time slots."));
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (!selectedBusinessSlug) return;
    const fetchBusinessData = async () => {
      try {
        setIsLoadingBusiness(true);
        setSelectedSlots([]);
        setSlots([]);
        resetHoldingState();
        setConfirmedBookingRef(null);

        const business = await getBusinessData(selectedBusinessSlug);
        if (business) {
          const bizFields = business.fields || [];
          setFields(bizFields);
          setSelectedField(bizFields[0]?.id || "");
        } else {
          toast.error(label("businessLoadFailed", "Failed to load business details."));
        }
      } catch (error) {
        console.error(error);
        toast.error(label("businessConnectionFailed", "Error connecting to business database."));
      } finally {
        setIsLoadingBusiness(false);
      }
    };
    fetchBusinessData();
  }, [selectedBusinessSlug]);

  useEffect(() => {
    if (!selectedField || confirmedBookingRef) return;
    fetchAvailability(selectedField, formattedDateString);
  }, [selectedField, formattedDateString, confirmedBookingRef]);

  const handleCancelBookingDraft = useCallback(
    async (expiredCartId: string) => {
      try {
        const result = await manualBookingCancelDraft(expiredCartId);

        if (result.success) {
          toast.warning(
            label("holdExpired", "Hold time expired. Selected slots have been released."),
          );
        } else {
          console.warn(
            "Draft cancelation handled with warning response:",
            result.message,
          );
        }
      } catch (err) {
        console.error("Unexpected error executing draft rollback:", err);
      }
    },
    [],
  );

  useEffect(() => {
    if (activeCartId) {
      setTimeLeft(300);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(timerRef.current!);
            handleCancelBookingDraft(activeCartId);
            resetHoldingState();
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeLeft(null);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCartId, handleCancelBookingDraft]);

  const toggleSlot = (slot: Slot) => {
    if (activeCartId) {
      handleCancelBookingDraft(activeCartId);
      resetHoldingState();
    }
    const isAlreadySelected = selectedSlots.some(
      (s) =>
        s.date === formattedDateString &&
        s.fieldId === selectedField &&
        s.startTime === slot.startTime,
    );
    if (isAlreadySelected) {
      setSelectedSlots((prev) =>
        prev.filter(
          (s) =>
            !(
              s.date === formattedDateString &&
              s.fieldId === selectedField &&
              s.startTime === slot.startTime
            ),
        ),
      );
    } else {
      setSelectedSlots((prev) => [
        ...prev,
        {
          fieldId: selectedField,
          date: formattedDateString,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
        },
      ]);
    }
  };

  const handleLockSession = async () => {
    if (isLockDisabled) return;
    try {
      setIsSubmitting(true);

      const grouped = selectedSlots.reduce((acc: any, slot) => {
        const key = `${slot.fieldId}-${slot.date}`;
        if (!acc[key]) {
          acc[key] = { fieldId: slot.fieldId, date: slot.date, slots: [] };
        }
        acc[key].slots.push({
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
        return acc;
      }, {});

      const payload = {
        bookingItems: Object.values(grouped),
        manualPlayerData: {
          name: manualPlayerName.trim() || "Walk-In Customer",
          phone: manualPlayerPhone.trim(),
        },
      };

      const response = await createBooking(
        payload as ICreateBookingPayload,
        true,
      );

      if (response.success && response.data?.cartId) {
        const lockedCartId = response.data.cartId;
        setActiveCartId(lockedCartId);

        fetchCheckoutCalculations({ cartId: lockedCartId });
        toast.success(label("slotsHeld", "Slots temporarily held for booking."));
      } else {
        toast.error(response.message || label("lockFailed", "Could not lock selected slots."));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(label("lockError", "An error occurred while locking slots."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCheckoutCalculations = async (
    identifier: { cartId?: string; newBookingId?: string },
    promoCode?: string,
  ) => {
    try {
      setIsCalculatingCheckout(true);
      setPromoMessage(null);

      const result = await bookingCheckoutCalculate({
        ...identifier,
        promoCode,
      });

      if (result.success && result.data) {
        const data = result.data;

        setCalculations({
          sumUpTotalAmount: data.sumUpTotalAmount ?? 0,
          finalDiscount: data.finalDiscount ?? 0,
          payableAmount: data.payableAmount ?? 0,
        });

        if (promoCode) {
          setPromoMessage(
            data.finalDiscount > 0
              ? {
                  type: "success",
                  text: `Promo applied! Saved ৳${data.finalDiscount}`,
                }
              : {
                  type: "error",
                  text: label("promoNoDiscount", "Promo code valid but offers no discount here."),
                },
          );
        }
      } else {
        setPromoMessage({
          type: "error",
          text: result.message || label("pricingCalculationFailed", "Failed to compute pricing values."),
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(label("pricingFailed", "Failed to update booking total pricing."));
    } finally {
      setIsCalculatingCheckout(false);
    }
  };

  const handleApplyPromoCode = () => {
    if (!activeCartId || !promoInput.trim()) return;

    fetchCheckoutCalculations({ cartId: activeCartId }, promoInput.trim());
  };

  const handleFinalConfirm = async () => {
    if (!activeCartId || isSubmitting || isCalculatingCheckout) return;

    try {
      setIsSubmitting(true);

      const result = await confirmBookingAsAuthority(activeCartId);

      if (result.success) {
        if (timerRef.current) clearInterval(timerRef.current);

        toast.success(label("confirmed", "Manual booking confirmed successfully!"));

        const data = result.data;

        const referenceId = data?.bookings[0]?.reference_id || "N/A";

        setConfirmedBookingRef(referenceId.slice(0, -3));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(label("confirmFailed", "An unexpected error occurred during confirmation."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 text-slate-700 rounded-2xl shadow-sm overflow-hidden font-sans">
      {/* HEADER SECTION */}
      <div className="bg-slate-50/60 px-6 py-5 border-b border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              {label("bookingTitle", "Manual Booking Entry")}
            </h1>
            <span className="text-[10px] bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              {managerView ? t("managerMode") : ownerView ? "Owner Mode" : "Admin Mode"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {label("bookingDescription", "Book slots directly for offline or walk-in customers.")}
          </p>
        </div>

        {!confirmedBookingRef && (
          <CustomerDetailsForm
            name={manualPlayerName}
            phone={manualPlayerPhone}
            onNameChange={setManualPlayerName}
            onPhoneChange={setManualPlayerPhone}
            isPhoneValid={isPhoneValid}
            disabled={!!activeCartId}
            managerView={translatedView}
          />
        )}
      </div>

      {confirmedBookingRef ? (
        <SuccessOverlay
          referenceId={confirmedBookingRef}
          onReset={startNewBookingSession}
          managerView={translatedView}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {/* LEFT AREA: SETUP SELECTION CONTROLS */}
          <div className="lg:col-span-8 p-6 space-y-6 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 flex flex-col">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                  <Building2 size={13} className="text-slate-400" /> {label("selectBusiness", "Select Business")}
                </span>
                <Select
                  value={selectedBusinessSlug}
                  onValueChange={setSelectedBusinessSlug}
                >
                  <SelectTrigger className="w-full h-10 px-3 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 font-medium transition-all focus:ring-1 focus:ring-emerald-500 outline-none">
                    <SelectValue placeholder={label("selectBusiness", "Select business")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-md rounded-xl">
                    {businessesList.map((b) => (
                      <SelectItem
                        key={b.id}
                        value={b.slug}
                        className="text-xs py-2 font-semibold cursor-pointer focus:bg-slate-50 focus:text-emerald-700"
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                  <Layers size={13} className="text-slate-400" /> {label("selectField", "Select Court / Field")}
                </span>
                <Select
                  value={selectedField}
                  disabled={isLoadingBusiness || fields.length === 0}
                  onValueChange={(val) => {
                    setSelectedField(val);
                    if (activeCartId) {
                      handleCancelBookingDraft(activeCartId);
                      resetHoldingState();
                    }
                  }}
                >
                  <SelectTrigger className="w-full h-10 px-3 text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 font-medium transition-all focus:ring-1 focus:ring-emerald-500 outline-none disabled:opacity-50">
                    <SelectValue
                      placeholder={
                        isLoadingBusiness ? label("loadingFields", "Loading fields...") : label("selectField", "Select field")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-md rounded-xl">
                    {fields.map((f) => (
                      <SelectItem
                        key={f.id}
                        value={f.id}
                        className="text-xs py-2 font-semibold cursor-pointer focus:bg-slate-50 focus:text-emerald-700"
                      >
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                  <CalendarIcon size={13} className="text-slate-400" /> {label("selectDate", "Select Date")}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-10 px-3 flex items-center justify-between text-xs bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none transition-all focus:ring-1 focus:ring-emerald-500 text-left cursor-pointer"
                    >
                      <span>
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <CalendarIcon size={14} className="text-slate-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-slate-200 shadow-md rounded-xl"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          if (activeCartId) {
                            handleCancelBookingDraft(activeCartId);
                            resetHoldingState();
                          }
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* AVAILABLE SLOTS SUB-PANEL */}
            <div className="bg-slate-50/40 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-3">
                <span className="font-bold tracking-wider text-slate-400 uppercase text-[10px]">
                  {label("availableSlots", "Available Time Slots")}
                </span>
                {(isLoadingSlots || isLoadingBusiness) && (
                  <Loader2
                    size={14}
                    className="animate-spin text-emerald-600"
                  />
                )}
              </div>

              {slots.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center font-medium">
                  {label("emptySlots", "No time slots found for the selected setup.")}
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {slots.map((slot, i) => {
                    const isSelected = selectedSlots.some(
                      (s) =>
                        s.date === formattedDateString &&
                        s.fieldId === selectedField &&
                        s.startTime === slot.startTime,
                    );
                    const isNotAvailable = !slot.available;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isNotAvailable}
                        onClick={() => toggleSlot(slot)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                          isNotAvailable
                            ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed line-through"
                            : isSelected
                              ? "bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500/20 shadow-2xs"
                              : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50 text-slate-700 font-medium"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold tracking-tight">
                            {formatTo12Hour(slot.startTime)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                            {label("to", "to")} {formatTo12Hour(slot.endTime)}
                          </span>
                        </div>

                        <span
                          className={`text-[11px] font-bold text-right w-full block mt-1 ${
                            isSelected
                              ? "text-emerald-700"
                              : isNotAvailable
                                ? "text-slate-300"
                                : "text-slate-500"
                          }`}
                        >
                          {isNotAvailable ? label("unavailable", "Unavailable") : `৳${slot.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT AREA: PRICING SIDEBAR COMPONENT */}
          <ManulBookingSummarySidebar
            selectedSlots={selectedSlots}
            fields={fields}
            activeCartId={activeCartId}
            timeLeft={timeLeft ?? 0}
            promoInput={promoInput}
            onPromoInput={setPromoInput}
            promoMessage={promoMessage}
            calculations={calculations}
            isLockDisabled={isLockDisabled}
            isSubmitting={isSubmitting}
            isCalculatingCheckout={isCalculatingCheckout}
            onToggleSlot={(item: any) => toggleSlot(item as Slot)}
            onLockSession={handleLockSession}
            onApplyPromo={handleApplyPromoCode}
            onConfirmBooking={handleFinalConfirm}
            managerView={translatedView}
          />
        </div>
      )}
    </div>
  );
}
