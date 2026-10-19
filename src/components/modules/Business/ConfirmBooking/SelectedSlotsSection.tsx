import { formatTo12Hour } from "@/utils/formatTime";
import { Clock3, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface Slot {
  bookingId?: string;
  fieldName?: string;
  fieldId?: string;
  startTime?: string | number | Date;
  endTime?: string | number | Date;
  finalPayable?: number | string;
}

interface SelectedSlotsSectionProps {
  slotPricingDetails: Slot[];
  checkoutLoading: boolean;
}

const SelectedSlotsSection = ({
  slotPricingDetails,
  checkoutLoading,
}: SelectedSlotsSectionProps) => {
  const t = useTranslations("booking");
  const locale = useLocale();

  return (
    <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Clock3 className="text-green-500" size={24} />
          <h2 className="text-2xl font-black italic uppercase tracking-tight">
            {t("selectedSlotsCount", { count: slotPricingDetails?.length || 0 })}
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        {checkoutLoading && slotPricingDetails.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-slate-400 gap-2 font-medium">
            <Loader2 className="animate-spin" size={20} />
            <span>{t("fetchingSlotAvailability")}</span>
          </div>
        ) : (
          slotPricingDetails?.map((slot, i) => (
            <div
              key={slot.bookingId || i}
              className="group bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 hover:border-green-200 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center font-black text-slate-400 text-xs shadow-sm">
                    {i + 1}
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-black text-green-600 tracking-widest">
                      {t("fieldLabel")}: {slot.fieldName || slot.fieldId}
                    </p>

                    <h4 className="font-bold text-slate-900 mt-0.5">
                      {slot.startTime
                        ? new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(new Date(slot.startTime))
                        : t("pendingDateConfiguration")}
                    </h4>

                    {slot.startTime && slot.endTime && (
                      <p className="text-sm text-slate-500 font-medium">
                        {formatTo12Hour(new Date(slot.startTime))} →{" "}
                        {formatTo12Hour(new Date(slot.endTime))}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="text-[9px] uppercase font-black text-slate-400">
                    {t("rate")}
                  </p>
                  <p className="text-2xl font-black italic text-slate-900">
                    ৳{slot.finalPayable}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default SelectedSlotsSection;
