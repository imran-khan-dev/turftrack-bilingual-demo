"use client";

import { MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { AvailabilitySlot, BusinessField } from "@/types/booking";
import { formatTo12Hour } from "@/utils/formatTime";
import { useTranslations } from "next-intl";

interface StepSlotSelectionProps {
  fields: BusinessField[];
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  availableSlots: AvailabilitySlot[];
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
  playerView?: boolean;
  managerView?: boolean;
  ownerView?: boolean;
}

export default function StepSlotSelection({
  fields,
  selectedFieldId,
  setSelectedFieldId,
  selectedDate,
  setSelectedDate,
  availableSlots,
  selectedSlot,
  setSelectedSlot,
  playerView = false,
  managerView = false,
  ownerView = false,
}: StepSlotSelectionProps) {
  const translated = playerView || managerView || ownerView;
  const t = useTranslations("player.reschedule");
  const bookingT = useTranslations("booking");
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {fields.length > 0 && (
        <div>
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
            <MapPin className="h-3.5 w-3.5 text-slate-400" /> {translated ? bookingT("chooseField") : "Choose Target Asset / Field"}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {fields.map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => setSelectedFieldId(field.id)}
                className={cn(
                  "p-3 text-left rounded-xl border font-semibold text-xs flex flex-col transition-all",
                  selectedFieldId === field.id
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white",
                )}
              >
                <span>{field.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-2">
          {translated ? bookingT("selectDate") : "Select Target Reservation Date"}
        </label>
        <div className="border border-slate-100 rounded-2xl p-2 bg-slate-50/30 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
            className="rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-2">
          {translated ? bookingT("availableSlots") : "Available Daily Time Segments"}
        </label>
        {availableSlots.length === 0 ? (
          <div className="p-4 border border-dashed border-slate-200 text-center rounded-xl text-slate-400 font-medium text-xs">
            {translated ? t("noSlots") : "No matching slots found for this date."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {availableSlots.map((slot) => {
              const slotIdentifier = `${slot.startTime}-${slot.endTime}`;
              const isSelected = selectedSlot === slotIdentifier;

              return (
                <button
                  key={slotIdentifier}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slotIdentifier)}
                  className={cn(
                    "p-3 text-xs font-bold rounded-xl border transition-all text-center flex flex-col items-center justify-center gap-1",
                    !slot.available
                      ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60 line-through"
                      : isSelected
                        ? "border-green-600 bg-green-50/40 text-green-700 shadow-sm"
                        : "border-slate-200 hover:border-slate-400 text-slate-700 bg-white",
                  )}
                >
                  <span>
                    {formatTo12Hour(slot.startTime)} -{" "}
                    {formatTo12Hour(slot.endTime)}
                  </span>
                  {slot.available && (
                    <span
                      className={cn(
                        "text-[10px] font-medium tracking-wide",
                        isSelected ? "text-green-600" : "text-slate-400",
                      )}
                    >
                      {translated ? t("slotPrice", { amount: slot.price }) : `TK ${slot.price}`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
