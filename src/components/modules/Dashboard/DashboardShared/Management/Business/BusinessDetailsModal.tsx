"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBusinessData } from "@/services/business/getBusinessData";
import {
  BadgeCheck,
  ShieldAlert,
  MapPin,
  Phone,
  Facebook,
  MessageCircle,
  Link as LinkIcon,
  Landmark,
  Sparkles,
  Wallet,
  CalendarClock,
  RefreshCcw,
  Percent,
  Receipt,
  CalendarCheck2,
  Building2,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface BankInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchName: string;
}

interface Feature {
  id?: string;
  title: string;
  description?: string | null;
}

interface BusinessTerm {
  id: string;
  businessId: string;
  title: string;
  description: string | null;
}

export interface BusinessDetail {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  location?: string | null;
  contactNumber: string;
  isContactVerified: boolean;
  businessEmail: string | null;
  logo?: string | null;
  bkashNumber: string | null;
  bkashAccountType: string | null;
  isBkashVerified: boolean;
  facebookLink?: string | null;
  whatsappLink?: string | null;
  aboutDesc: string | null;
  googleMapLink?: string | null;
  allowPlayerCancel: boolean;
  allowPlayerReschedule: boolean;
  cancelWindowHours: number;
  rescheduleWindowHours: number;
  rescheduleLimitCount: number;
  multipleRescheduleCountLimit: number;
  refundAllowed: boolean;
  refundPercent: string | number;
  minDepositPercent: string | number;
  maxDepositPercent?: string | number;
  maxSlotsPerBooking: number;
  maxBookingsPerDay: number;
  bookingHorizonDays: number;
  isActive?: string;
  bankInfo: BankInfo | null;
  features: Feature[];
  businessTerms?: BusinessTerm[];
  totalCompletedBookings?: number;
  currentDebt?: string | number;
  // Super admin only — present only when the API includes them for this role
  noAppFeeWindow?: number;
  customFeeRate?: number | string;
  platformFeeType?: string;
  outstandingDebtLimit?: number | string;
  marketingLimitCount?: number;
  marketingLimitWindowHours?: number;
}

interface BusinessDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  role?: string;
}

function InfoRow({ label, value, emptyLabel }: { label: string; value: React.ReactNode; emptyLabel: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[13px] font-semibold text-slate-800 break-words leading-snug">
        {value ?? emptyLabel}
      </span>
    </div>
  );
}

const ACCENT_CLASSES = {
  blue: "bg-blue-50 text-blue-600",
  pink: "bg-pink-50 text-pink-600",
  indigo: "bg-indigo-50 text-indigo-600",
  teal: "bg-teal-50 text-teal-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  slate: "bg-slate-100 text-slate-700",
} as const;

function Section({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent: keyof typeof ACCENT_CLASSES;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3.5">
        <span
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-xl border border-slate-100",
            ACCENT_CLASSES[accent],
          )}
        >
          <Icon className="w-3.5 h-3.5" />
        </span>
        <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">{children}</div>
    </section>
  );
}

export default function BusinessDetailsModal({
  open,
  onOpenChange,
  slug,
  role,
}: BusinessDetailsModalProps) {
  const bt = useTranslations("owner.business");
  const adminT = useTranslations("admin.business");
  const ui = (key: string, fallback: string) => role === "OWNER" || role === "SUPER_ADMIN" ? bt(key) : fallback;
  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !slug) return;

    let cancelled = false;

    async function fetchBusiness() {
      setIsLoading(true);
      setFetchError(null);

      try {
        const res = await getBusinessData(slug, { mode: "dashboard" });

        if (cancelled) return;

        // if (!res || !("result" in res) || !res.result) {
        //   setFetchError("Failed to load business data.");
        //   setBusiness(null);
        //   return;
        // }

        if (!res) {
          setFetchError(role === "OWNER" || role === "SUPER_ADMIN" ? bt("loadFailed") : "Failed to load business data.");
          setBusiness(null);
          return;
        }

        setBusiness(res as BusinessDetail);
      } catch (err) {
        if (!cancelled) {
          console.error("getBusinessData failed:", err);
          setFetchError(role === "OWNER" || role === "SUPER_ADMIN" ? bt("loadError") : "Something went wrong loading this business.");
          setBusiness(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchBusiness();

    return () => {
      cancelled = true;
    };
  }, [open, slug, role, bt]);

  useEffect(() => {
    if (!open) {
      setBusiness(null);
      setFetchError(null);
    }
  }, [open]);

  const isSuperAdmin = role === "SUPER_ADMIN";
  const hasSuperAdminData = business?.platformFeeType !== undefined;
  const showSuperAdminSection = isSuperAdmin && hasSuperAdminData;

  const debt = business ? Number(business.currentDebt) || 0 : 0;
  const hasActiveStatus = business?.isActive !== undefined;
  const isActive = business?.isActive === "ACTIVE";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl max-h-[88vh] overflow-hidden p-0 gap-0 border-slate-200">
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        )}

        {!isLoading && fetchError && (
          <div className="flex flex-col items-center gap-2 py-24 text-center px-6">
            <AlertCircle className="h-6 w-6 text-rose-500" />
            <p className="text-sm font-medium text-rose-600">{fetchError}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              {ui("close", "Close")}
            </Button>
          </div>
        )}

        {!isLoading && !fetchError && business && (
          <div className="overflow-y-auto max-h-[88vh] bg-slate-50/60">
            {/* Header band — Matched to Light Card Wallet Background */}
            <div className="relative overflow-hidden bg-white border-b border-slate-200 p-6 sm:p-7">
              {/* Soft decorative blur glows */}
              <div className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full bg-emerald-100/50 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-blue-50 blur-3xl" />

              <div className="relative flex flex-col gap-6">
                <DialogHeader className="p-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-slate-700" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                          {business.name}
                        </DialogTitle>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">
                          /{business.slug}
                        </p>
                      </div>
                    </div>

                    {hasActiveStatus && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide border shrink-0",
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200",
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isActive ? "bg-emerald-500" : "bg-rose-500",
                          )}
                        />
                        {isActive ? ui("active", "Active") : ui("inactive", "Inactive")}
                      </span>
                    )}
                  </div>
                </DialogHeader>

                {/* Quick stats row styled like MiniStats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white border border-slate-200 px-3.5 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <CalendarCheck2 className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {ui("bookingsCompleted", "Booking Completed")}
                      </span>
                    </div>
                    <p className="text-base font-bold text-slate-900">
                      {business.totalCompletedBookings ?? 0}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-200 px-3.5 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <Receipt className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {ui("currentDebt", "Current Debt")}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-base font-bold",
                        debt > 0 ? "text-rose-600" : "text-slate-900",
                      )}
                    >
                      ৳{debt}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-200 px-3.5 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {ui("location", "Location")}
                      </span>
                    </div>
                    <p className="text-[13px] font-bold text-slate-900 truncate">
                      {business.location || ui("notAvailable", "N/A")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail cards body */}
            <div className="space-y-3.5 p-6">
              {business.aboutDesc && (
                <p className="text-xs text-slate-500 leading-relaxed px-0.5">
                  {business.aboutDesc}
                </p>
              )}

              <Section icon={Phone} title={ui("contactLinks", "Contact & Links")} accent="blue">
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("contactNumber", "Contact Number")}
                  value={
                    <span className="inline-flex items-center gap-1">
                      {business.contactNumber || ui("notAvailable", "N/A")}
                      {business.isContactVerified ? (
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </span>
                  }
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("businessEmail", "Business Email")}
                  value={business.businessEmail || ui("notAvailable", "N/A")}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("facebook", "Facebook")}
                  value={
                    business.facebookLink ? (
                      <a
                        href={business.facebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                      >
                        <Facebook className="w-3 h-3" />
                        {ui("viewPage", "View Page")}
                      </a>
                    ) : (
                      ui("notAvailable", "N/A")
                    )
                  }
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("whatsapp", "WhatsApp")}
                  value={
                    business.whatsappLink ? (
                      <a
                        href={business.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-semibold"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {ui("openChat", "Open Chat")}
                      </a>
                    ) : (
                      ui("notAvailable", "N/A")
                    )
                  }
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("googleMaps", "Google Maps")}
                  value={
                    business.googleMapLink ? (
                      <a
                        href={business.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                      >
                        <LinkIcon className="w-3 h-3" />
                        {ui("viewOnMap", "View on Map")}
                      </a>
                    ) : (
                      ui("notAvailable", "N/A")
                    )
                  }
                />
              </Section>

              <Section icon={Wallet} title={ui("bkash", "Bkash")} accent="pink">
                <InfoRow emptyLabel={bt("notAvailable")} label={ui("bkashNumber", "Bkash Number")} value={business.bkashNumber} />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("accountType", "Account Type")}
                  value={business.bkashAccountType}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("verified", "Verified")}
                  value={
                    <span
                      className={cn(
                        "inline-flex w-max items-center gap-1 rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide text-[10px] border",
                        business.isBkashVerified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200",
                      )}
                    >
                      {business.isBkashVerified ? ui("verified", "Verified") : ui("unverified", "Unverified")}
                    </span>
                  }
                />
              </Section>

              {business.bankInfo && (
                <Section icon={Landmark} title={ui("bankInfo", "Bank Info")} accent="indigo">
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={ui("accountName", "Account Name")}
                    value={business.bankInfo.accountName}
                  />
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={ui("accountNumber", "Account Number")}
                    value={business.bankInfo.accountNumber}
                  />
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={ui("bankName", "Bank Name")}
                    value={business.bankInfo.bankName}
                  />
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={ui("branchName", "Branch Name")}
                    value={business.bankInfo.branchName}
                  />
                </Section>
              )}

              <Section icon={CalendarClock} title={ui("bookingRules", "Booking Rules")} accent="teal">
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("maxSlotsPerBooking", "Max Slots / Booking")}
                  value={business.maxSlotsPerBooking}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("maxBookingsPerDay", "Max Bookings / Day")}
                  value={business.maxBookingsPerDay}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("bookingHorizon", "Booking Horizon")}
                  value={(role === "OWNER" || role === "SUPER_ADMIN") ? bt("dayCount", { count: business.bookingHorizonDays }) : `${business.bookingHorizonDays} days`}
                />
              </Section>

              <Section
                icon={RefreshCcw}
                title={ui("cancellationReschedule", "Cancellation & Reschedule")}
                accent="amber"
              >
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("playerCancelAllowed", "Player Cancel Allowed")}
                  value={business.allowPlayerCancel ? ui("yes", "Yes") : ui("no", "No")}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("cancelWindowLabel", "Cancel Window")}
                  value={(role === "OWNER" || role === "SUPER_ADMIN") ? bt("hourCount", { count: business.cancelWindowHours }) : `${business.cancelWindowHours} hours`}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("playerRescheduleAllowed", "Player Reschedule Allowed")}
                  value={business.allowPlayerReschedule ? ui("yes", "Yes") : ui("no", "No")}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("rescheduleWindowLabel", "Reschedule Window")}
                  value={(role === "OWNER" || role === "SUPER_ADMIN") ? bt("hourCount", { count: business.rescheduleWindowHours }) : `${business.rescheduleWindowHours} hours`}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("reschedulePercent", "Reschedule Limit")}
                  value={business.rescheduleLimitCount}
                />
              </Section>

              <Section icon={Percent} title={ui("refundDeposit", "Refund & Deposit")} accent="emerald">
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("refundAllowed", "Refund Allowed")}
                  value={business.refundAllowed ? ui("yes", "Yes") : ui("no", "No")}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("refundPercentShort", "Refund Percent")}
                  value={`${business.refundPercent}%`}
                />
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("minDepositPercent", "Min Deposit Percent")}
                  value={`${business.minDepositPercent}%`}
                />
                {/* FIX: maxDepositPercent is absent for owner — was rendering
                    the literal string "undefined%" on screen */}
                <InfoRow emptyLabel={bt("notAvailable")}
                  label={ui("maxDepositPercent", "Max Deposit Percent")}
                  value={
                    business.maxDepositPercent !== undefined
                      ? `${business.maxDepositPercent}%`
                      : ui("notAvailable", "N/A")
                  }
                />
              </Section>

              {showSuperAdminSection && (
                <Section
                  icon={ShieldCheck}
                  title={adminT("platformSettings")}
                  accent="slate"
                >
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={adminT("platformFeeType")}
                    value={business.platformFeeType === "PERCENT" ? bt("percent") : business.platformFeeType === "FLAT" ? bt("flat") : business.platformFeeType}
                  />
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={adminT("customFeeRate")}
                    value={
                      business.customFeeRate !== undefined &&
                      business.customFeeRate !== null &&
                      business.customFeeRate !== ""
                        ? `${business.customFeeRate}%`
                        : adminT("default")
                    }
                  />
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={adminT("noAppFeeWindow")}
                    value={
                      business.noAppFeeWindow !== undefined
                        ? bt("hourCount", { count: business.noAppFeeWindow })
                      : ui("notAvailable", "N/A")
                    }
                  />
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={adminT("outstandingDebtLimit")}
                    value={
                      business.outstandingDebtLimit !== undefined
                        ? `৳${business.outstandingDebtLimit}`
                      : ui("notAvailable", "N/A")
                    }
                  />
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={adminT("marketingLimitCount")}
                    value={business.marketingLimitCount}
                  />
                  <InfoRow emptyLabel={bt("notAvailable")}
                    label={adminT("marketingLimitWindow")}
                    value={
                      business.marketingLimitWindowHours !== undefined
                        ? bt("hourCount", { count: business.marketingLimitWindowHours })
                      : ui("notAvailable", "N/A")
                    }
                  />
                </Section>
              )}

              {business.features?.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-violet-50 text-violet-600 border border-slate-100">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      {ui("features", "Features")}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {business.features.map((feature, idx) => (
                      // FIX: owner-mode feature items have no `id`
                      // ({ title } only) — fall back to title+index so
                      // React keys stay unique and stable either way.
                      <span
                        key={feature.id ?? `${feature.title}-${idx}`}
                        className="inline-flex items-center rounded-full px-2.5 py-1 font-semibold bg-violet-50 text-violet-700 border border-violet-200 text-[11px]"
                        title={feature.description || undefined}
                      >
                        {feature.title.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {business.businessTerms && business.businessTerms.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3.5">
                    <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-50 text-amber-600 border border-slate-100">
                      <Receipt className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Business Terms
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {business.businessTerms.map((term) => (
                      <span
                        key={term.id}
                        className="inline-flex items-center rounded-full px-2.5 py-1 font-semibold bg-amber-50 text-amber-700 border border-amber-200 text-[11px]"
                        title={term.description || undefined}
                      >
                        {term.title.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
