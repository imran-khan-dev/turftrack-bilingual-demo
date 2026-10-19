import { formatTo12Hour } from "@/utils/formatTime";
import { SelectedSlot, Slot } from "@/types/booking";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Business {
  maxSlotsPerBooking: number;
  maxBookingsPerDay: number;
}

interface SlotPickerProps {
  slots: Slot[];
  selectedSlots: SelectedSlot[];
  selectedDate: string;
  selectedField: string;
  business: Business;
  isLoading: boolean;
  warning: string | null;
  isLoggedIn: boolean;
  isUserActive: boolean;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInactiveModal: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSlot: (slot: Slot, date: string) => void;
}

const SlotPicker = ({
  slots,
  selectedSlots,
  selectedDate,
  selectedField,
  business,
  isLoading,
  warning,
  isLoggedIn,
  isUserActive,
  setShowAuthModal,
  setShowInactiveModal,
  toggleSlot,
}: SlotPickerProps) => {
  const t = useTranslations("booking");
  return (
    <section>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">
          {t("availableSlots")}
        </h2>

        <div className="flex items-center gap-3">
          {isLoading && (
            <Loader2 className="animate-spin text-green-500" size={20} />
          )}

          <AnimatePresence mode="wait">
            {warning ? (
              <motion.div
                key="warning"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-red-500 font-bold text-[11px] uppercase bg-red-50 px-4 py-2 rounded-full border border-red-100 flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {warning}
              </motion.div>
            ) : selectedSlots.length >= business.maxSlotsPerBooking ? (
              <motion.div
                key="limit-reached"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-slate-500 font-bold text-[11px] uppercase bg-slate-100 px-4 py-2 rounded-full border border-slate-200"
              >
                {t("bookingLimitReached", { count: business.maxSlotsPerBooking })}
              </motion.div>
            ) : (
              <motion.p
                key="slots-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 font-bold text-[10px] uppercase tracking-widest"
              >
                {t("slotsSelected", { count: selectedSlots.length, max: business.maxSlotsPerBooking })}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SLOT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, n) => (
              <div
                key={n}
                className="h-28 rounded-4xl bg-slate-200 animate-pulse"
              />
            ))
          : slots.map((slot) => {
              const isSelected = selectedSlots.some(
                (s) =>
                  s.date === selectedDate &&
                  s.fieldId === selectedField &&
                  s.startTime === slot.startTime,
              );

              const cartIsFull =
                selectedSlots.length >= business.maxSlotsPerBooking;

              const isRestricted = !isSelected && cartIsFull;

              return (
                <button
                  key={slot.startTime}
                  disabled={!slot.available || isRestricted}
                  onClick={() => {
                    if (!isLoggedIn) {
                      setShowAuthModal(true);
                      return;
                    }

                    // if (!isPlayer) {
                    //   setShowNotPlayerModal(true);
                    //   return;
                    // }

                    if (!isUserActive) {
                      setShowInactiveModal(true);
                      return;
                    }

                    toggleSlot(slot, selectedDate);
                  }}
                  className={`p-5 rounded-[2.2rem] cursor-pointer border-2 transition-all duration-300 text-left relative group ${
                    !slot.available || isRestricted
                      ? "bg-slate-50 border-slate-50 text-slate-300 cursor-not-allowed opacity-60"
                      : isSelected
                        ? "bg-green-50 border-green-500 shadow-lg ring-2 ring-green-500/10"
                        : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <p
                    className={`text-sm font-black italic ${
                      !slot.available ? "opacity-30" : "text-slate-900"
                    }`}
                  >
                    {formatTo12Hour(slot.startTime)}
                  </p>

                  <p className="text-[9px] font-bold text-slate-400 mb-4 uppercase">
                    {t("to")} {formatTo12Hour(slot.endTime)}
                  </p>

                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xl font-black italic ${
                        isSelected ? "text-green-600" : "text-slate-900"
                      }`}
                    >
                      ৳{slot.price}
                    </p>

                    {isRestricted && (
                      <div className="h-2 w-2 bg-slate-300 rounded-full" />
                    )}
                  </div>
                </button>
              );
            })}
      </div>
    </section>
  );
};

export default SlotPicker;
