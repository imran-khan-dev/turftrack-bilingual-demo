/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  Clock3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface Props {
  businessData: any;
  booking: {
    businessName: string;
    status: string;
    totalAmount: number;
    totalSlots: {
      fieldName: string;
      date: string;
      Time: string;
      status: string;
      reference: string;
    }[];
  };
}

export default function SuccessBookingClient({ businessData, booking }: Props) {
  const t = useTranslations("booking");
  // Extract the root group reference code (e.g., converts "BK-K7R9XP42-01" -> "BK-K7R9XP42")
  const rawFirstRef = booking.totalSlots[0]?.reference;
  const globalCartRef = rawFirstRef
    ? rawFirstRef.split("-").slice(0, 2).join("-").toUpperCase()
    : "BK-ORDER";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container flex justify-center mx-auto px-6 py-12">
        <Card className="max-w-lg w-full rounded-[3rem] bg-white border border-slate-100 shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden">
          {/* TOP GLOW */}
          <div className="h-2 bg-linear-to-r from-green-400 via-green-500 to-emerald-500" />

          <div className="p-10 text-center">
            {/* ICON */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
                <div className="relative h-28 w-28 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle2
                    size={64}
                    className="text-green-500 animate-pulse"
                  />
                </div>
              </div>
            </div>

            {/* TITLE */}
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-3">
              {t("bookingConfirmed")}
            </h1>

            <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto mb-10">
              {t("bookingSuccessDescription")}
            </p>

            {/* BOOKING CARD */}
            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-left space-y-5 mb-8">
              {/* BUSINESS & GLOBAL REF */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200/60">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                      {t("venue")}
                    </p>
                    <h3 className="font-black italic uppercase tracking-tight text-slate-900">
                      {businessData?.name || booking?.businessName}
                    </h3>
                    <p className="text-sm text-slate-500 font-semibold">{t("bookedSlotCount", { count: booking.totalSlots.length })}</p>
                  </div>
                </div>

                {/* Main clean group reference view badge */}
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                    {t("order.ref")}
                  </p>
                  <span className="font-mono text-xs font-black bg-white text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    #{globalCartRef}
                  </span>
                </div>
              </div>

              {/* DYNAMIC SLOT LOOP MAPPING */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {t("schedules")}
                </p>

                {/* Scroll container wraps slots to maintain clean dimensions for large orders */}
                <div className="max-h-64 overflow-y-auto pr-1 space-y-3">
                  {booking.totalSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-slate-800">
                            {slot.fieldName}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {slot.date}{" "}
                            <span className="mx-1 text-slate-300">•</span>{" "}
                            <span className="font-bold text-slate-700">
                              {slot.Time}
                            </span>
                          </p>

                          {/* Suffix unique reference identifier for specific item mapping */}
                          {slot.reference && (
                            <p className="text-[9px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-wider">
                              {t("referenceId", { id: slot.reference.toUpperCase() })}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-100 shrink-0">
                        {t.has(`status.${slot.status}`) ? t(`status.${slot.status}`) : slot.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOOKING INFO */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-200/60">
                <div className="h-12 w-12 rounded-2xl bg-slate-200 flex items-center justify-center shrink-0">
                  <Clock3 size={20} className="text-slate-700" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                    {t("bookingStatus")}
                  </p>
                  <h3 className="font-black text-slate-900 uppercase text-xs tracking-wider">
                    {t.has(`status.${booking.status}`) ? t(`status.${booking.status}`) : booking.status}
                  </h3>
                </div>
              </div>
            </div>

            {/* SUCCESS NOTICE */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-8">
              <p className="text-[11px] leading-5 font-bold uppercase tracking-wide text-green-700">
                {t("arriveEarly")}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="space-y-3">
              <Link href={`/player/dashboard/manage-bookings`}>
                <Button className="w-full h-14 cursor-pointer rounded-2xl bg-green-500 hover:bg-green-400 text-slate-900 font-black italic uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(34,197,94,0.25)]">
                  {t("viewMyBookings")}
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>

              <Link
                href={`/book/${businessData?.slug}`}
                className="block pt-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 hover:text-green-500 transition-colors"
              >
                {t("backToBooking")}
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
