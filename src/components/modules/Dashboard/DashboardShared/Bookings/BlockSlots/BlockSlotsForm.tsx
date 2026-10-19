/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { formatTo12Hour } from "@/utils/formatTime";
import { getFieldAvailability } from "@/services/booking/getFieldAvailability";
import { blockBookingSlots } from "@/services/booking/blockBookingSlots";

interface FormProps {
  selectedFieldId: string;
  formattedDate: string;
  onBlockSuccess: () => void;
  managerView?: boolean;
}

export default function BlockSlotsForm({
  selectedFieldId,
  formattedDate,
  onBlockSuccess,
  managerView = false,
}: FormProps) {
  const t = useTranslations("manager.blockSlots");
  const label = (key: string, fallback: string) => managerView ? t(key as never) : fallback;
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedFieldId) return;

    const fetchSlots = async () => {
      try {
        setIsLoadingSlots(true);
        setSelectedTimes([]);

        const result = await getFieldAvailability({
          fieldId: selectedFieldId,
          date: formattedDate,
        });

        if (result.success) {
          setSlots(result.data);
        } else {
          toast.error(result.message);
        }
      } catch (err) {
        console.error("Unexpected client-side hook failure:", err);
        toast.error(
          label("error", "An unexpected error occurred while parsing slot configurations."),
        );
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedFieldId, formattedDate]);

  const toggleSelectSlot = (slot: any) => {
    const exists = selectedTimes.some((t) => t.startTime === slot.startTime);
    if (exists) {
      setSelectedTimes((prev) =>
        prev.filter((t) => t.startTime !== slot.startTime),
      );
    } else {
      setSelectedTimes((prev) => [
        ...prev,
        { startTime: slot.startTime, endTime: slot.endTime },
      ]);
    }
  };

  const handleBlockAction = async () => {
    if (selectedTimes.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const result = await blockBookingSlots({
        fieldId: selectedFieldId,
        date: formattedDate,
        slots: selectedTimes.map((t) => ({
          startTime: t.startTime,
          endTime: t.endTime,
        })),
      });

      if (result.success) {
        toast.success(managerView ? t("blockedCount", { count: selectedTimes.length }) : `Successfully blocked ${selectedTimes.length} slot(s).`);
        setSelectedTimes([]);
        onBlockSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Unexpected client-side hook failure:", err);
      toast.error(
        label("error", "An unexpected error occurred while processing your request."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
        {label("title", "Apply Schedule Restriction")}
      </h2>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-400 block mb-2">
          {label("availableHours", "Select Available Hours")}
        </label>

        {isLoadingSlots ? (
          <div className="py-8 flex justify-center">
            <Loader2 size={16} className="animate-spin text-slate-400" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium text-center py-6">
            {label("noSlots", "No matching slots found.")}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
            {slots.map((slot, index) => {
              const isSelected = selectedTimes.some(
                (t) => t.startTime === slot.startTime,
              );
              const isTaken = !slot.available || slot.isBooked;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isTaken}
                  onClick={() => toggleSelectSlot(slot)}
                  className={`p-2.5 text-left rounded-xl border text-[11px] font-bold transition-all ${
                    isTaken
                      ? "bg-slate-50 border-slate-200 text-slate-300 line-through cursor-not-allowed"
                      : isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                        : "bg-slate-50/50 hover:bg-slate-100/80 text-slate-700 border-slate-200 hover:border-emerald-200"
                  }`}
                >
                  {formatTo12Hour(slot.startTime)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleBlockAction}
        disabled={selectedTimes.length === 0 || isSubmitting}
        className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
      >
        {isSubmitting ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Lock size={12} />
        )}
        {managerView ? t("blockCount", { count: selectedTimes.length }) : `Block Selected Slots (${selectedTimes.length})`}
      </button>
    </div>
  );
}
