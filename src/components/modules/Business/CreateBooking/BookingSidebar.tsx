import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatTo12Hour } from "@/utils/formatTime";
import { SelectedSlot, Slot } from "@/types/booking";
import { useTranslations } from "next-intl";

interface Field {
  id: string;
  name: string;
}

interface BookingSidebarProps {
  selectedSlots: SelectedSlot[];
  fields: Field[];
  totalPrice: number;
  agreedToBusinessTerms: boolean;
  agreedToAppTerms: boolean;
  setAgreedToBusinessTerms: React.Dispatch<React.SetStateAction<boolean>>;
  setAgreedToAppTerms: React.Dispatch<React.SetStateAction<boolean>>;
  handleCheckout: () => void;
  checkoutLoading: boolean;
  toggleSlot: (slot: Slot, date: string) => void;
  isCheckoutDisabled?: boolean;
}

const BookingSidebar = ({
  selectedSlots,
  fields,
  totalPrice,
  agreedToBusinessTerms,
  agreedToAppTerms,
  setAgreedToBusinessTerms,
  setAgreedToAppTerms,
  handleCheckout,
  checkoutLoading,
  toggleSlot,
  isCheckoutDisabled = false,
}: BookingSidebarProps) => {
  const t = useTranslations("booking");

  return (
    <div className="lg:w-[400px]">
      <aside className="sticky top-24">
        <Card className="bg-slate-900 rounded-[3.5rem] p-8 text-white border-none shadow-2xl">
          <h3 className="text-xl font-black italic tracking-widest mb-6 border-b border-white/5 pb-4 uppercase">
            {t("yourBooking")}
          </h3>

          {/* SELECTED SLOTS */}
          <div className="min-h-[100px] max-h-[380px] overflow-y-auto pr-2 mb-8 space-y-3 custom-scrollbar-white">
            <AnimatePresence mode="popLayout">
              {selectedSlots.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-500 italic font-bold text-sm text-center py-10"
                >
                  {t("pickSlotsToStart")}
                </motion.p>
              ) : (
                selectedSlots.map((slot) => (
                  <motion.div
                    key={`${slot.date}-${slot.fieldId}-${slot.startTime}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center justify-between bg-white/5 p-5 rounded-3xl border border-white/5"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="p-2 bg-green-500/10 rounded-full">
                        <Clock size={14} className="text-green-400" />
                      </div>

                      <div>
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-tighter">
                          {fields.find((f) => f.id === slot.fieldId)?.name} •{" "}
                          {slot.date}
                        </p>

                        <p className="font-bold text-xs">
                          {formatTo12Hour(slot.startTime)} -{" "}
                          {formatTo12Hour(slot.endTime)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSlot(slot as Slot, slot.date)}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                    >
                      <X
                        size={14}
                        className="text-white/40 hover:text-red-400"
                      />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* TOTAL */}
          <div className="bg-white/5 rounded-3xl p-6 mb-6 border border-white/10">
            <div className="flex justify-between items-center text-2xl font-black italic text-green-400">
              <span className="text-white uppercase tracking-tighter text-sm">
                {t("total")}
              </span>
              <span>৳{totalPrice}</span>
            </div>
          </div>

          {/* TERMS */}
          <div className="space-y-4 mb-8 px-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input
                  type="checkbox"
                  checked={agreedToBusinessTerms}
                  onChange={(e) => setAgreedToBusinessTerms(e.target.checked)}
                  className="peer h-5 w-5 appearance-none rounded-md border-2 border-white/20 bg-transparent checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer"
                />
                <svg
                  className="absolute w-3 h-3 text-slate-900 pointer-events-none hidden peer-checked:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <span className="text-[11px] font-bold text-slate-400 uppercase leading-tight group-hover:text-slate-300 transition-colors">
                {t("acceptTheTurfTerms")} {" "}
                <span className="text-white underline decoration-green-500/50">
                  {t("turfTermsConditions")}
                </span>{" "}
                {t("andCancellationPolicy")}
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input
                  type="checkbox"
                  checked={agreedToAppTerms}
                  onChange={(e) => setAgreedToAppTerms(e.target.checked)}
                  className="peer h-5 w-5 appearance-none rounded-md border-2 border-white/20 bg-transparent checked:bg-green-500 checked:border-green-500 transition-all cursor-pointer"
                />
                <svg
                  className="absolute w-3 h-3 text-slate-900 pointer-events-none hidden peer-checked:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <span className="text-[11px] font-bold text-slate-400 uppercase leading-tight group-hover:text-slate-300 transition-colors">
                {t("agreeToThePlatformTerms")} {" "}
                <Link href="/terms-of-service">
                  <span className="text-white underline decoration-green-500/50">
                    {t("turfTrack")}
                  </span>
                </Link>{" "}
                {t("platformTerms")}
              </span>
            </label>
          </div>

          {/* CHECKOUT */}
          <Button
            disabled={
              checkoutLoading ||
              isCheckoutDisabled ||
              selectedSlots.length === 0 ||
              !agreedToBusinessTerms ||
              !agreedToAppTerms
            }
            onClick={handleCheckout}
            className="w-full bg-green-500 hover:bg-green-400 cursor-pointer disabled:bg-slate-800 disabled:text-slate-600 disabled:opacity-100 text-slate-900 h-16 rounded-2xl text-lg font-black italic transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
          >
            {checkoutLoading ? (
              <Loader2 className="animate-spin text-black" size={20} />
            ) : (
              <span className="flex items-center justify-center gap-2">
                {t("checkoutNow")}
                <ArrowRight size={20} className="stroke-[3]" />
              </span>
            )}
          </Button>
        </Card>
      </aside>
    </div>
  );
};

export default BookingSidebar;
