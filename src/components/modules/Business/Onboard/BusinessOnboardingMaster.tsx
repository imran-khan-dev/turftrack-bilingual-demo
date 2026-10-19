"use client";

import { useState, useActionState, useEffect, startTransition } from "react";
import { toast } from "sonner";
import OwnerSection from "./OwnerSection";
import BrandingSection from "./BrandingSection";
import PolicySection from "./PolicySection";
import ReviewModal from "./ReviewModal";
import { Button } from "../../../ui/button";
import { useRouter } from "next/navigation";
import { onboardBusiness } from "@/services/business/onboardBusiness";
import { useTranslations } from "next-intl";

export default function BusinessOnboardingMaster() {
  const [state, formAction, isPending] = useActionState(
    onboardBusiness,
    undefined,
  );

  // Tracks each section's visibility independently so multiple sections can open together
  const [sections, setSections] = useState({
    owner: true,
    branding: false,
    policies: false,
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("errors");

  const [formData, setFormData] = useState({
    fullName: undefined,
    email: "",
    phone: undefined,
    password: undefined,
    confirmPassword: undefined,
    address: undefined,
    ownerPhoto: null as File | null,
    businessName: undefined,
    slug: undefined,
    location: undefined,
    contactNumber: undefined,
    businessEmail: "",
    aboutDesc: undefined,
    logo: null as File | null,
    googleMapLink: undefined,
    facebookLink: undefined,
    instagramLink: undefined,
    whatsappLink: undefined,
    features: [] as string[],
    bkashNumber: undefined,
    bkashAccountType: "PERSONAL",
    bankName: undefined,
    branchName: undefined,
    accountName: undefined,
    accountNumber: undefined,
    allowPlayerCancel: true,
    cancelAllowed: true,
    cancelWindowHours: 72,
    allowPlayerReschedule: true,
    rescheduleWindowHours: 72,
    rescheduleLimitCount: 2,
    // multipleRescheduleCountLimit: 1,
    refundAllowed: true,
    refundPercent: 0.0,
    minDepositPercent: 20.0,
    maxDepositPercent: 100.0,
    maxSlotsPerBooking: 10,
    maxBookingsPerDay: 3,
    bookingHorizonDays: 30,
    businessTerms: [] as Array<{ title: string }>,
  });

  useEffect(() => {
    if (!state) return;

    if (!state.success) {
      if (state.errors && Object.keys(state.errors).length > 0) {
        toast.error(t("formValidation"));
      } else if (state.message) {
        toast.error(state.message);
      }
    } else if (state.success) {
      toast.success(t("onboarding.accountInitialized"));
      router.push("/business/verify");
    }
  }, [state, router, t]);

  const updateFormData = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFormSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.businessName ||
      !formData.slug ||
      !formData.location ||
      !formData.contactNumber ||
      !formData.bkashNumber ||
      !formData.bkashAccountType ||
      !formData.bankName ||
      !formData.branchName ||
      !formData.accountName ||
      !formData.accountNumber
    ) {
      toast.error(
        t("onboarding.configurationRequired"),
      );
      return;
    }
    if (formData.features.length === 0) {
      toast.error(
        t("onboarding.accessibleFeatureRequired"),
      );
      return;
    }

    // 1. COLLAPSE ALL SECTIONS: Minimizes parent scroll footprint instantly
    setSections({ owner: false, branding: false, policies: false });
    setIsPreviewOpen(true);
  };

  // Triggered when modal "Go Back & Edit" is clicked
  const handleCancelReview = () => {
    setIsPreviewOpen(false);
    // 2. EXPAND ALL SECTIONS: Opens everything back up for review changes
    setSections({ owner: true, branding: true, policies: true });
  };

  const handleFinalConfirmSubmission = () => {
    const actionPayload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) return;
      if (Array.isArray(value)) {
        actionPayload.append(key, JSON.stringify(value));
        return;
      }
      if (value !== null && value !== undefined) {
        actionPayload.append(key, String(value));
      }
    });

    if (formData.ownerPhoto)
      actionPayload.append("ownerPhoto", formData.ownerPhoto);
    if (formData.logo) actionPayload.append("logo", formData.logo);

    setIsPreviewOpen(false);

    startTransition(() => {
      formAction(actionPayload);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="container max-w-5xl mx-auto px-6 py-12">
        <form onSubmit={handleFormSubmitReview} className="space-y-5">
          {/* Accordion 1 */}
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("owner")}
              className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 text-left"
            >
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Section 01
                </span>
                <h3 className="text-base font-black italic text-slate-800 uppercase">
                  Owner Identity Credentials
                </h3>
              </div>
              <span className="text-slate-400 font-bold text-xs">
                {sections.owner ? "▲" : "▼"}
              </span>
            </button>
            {sections.owner && (
              <OwnerSection
                data={formData}
                onChange={updateFormData}
                state={state}
              />
            )}
          </div>

          {/* Accordion 2 */}
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("branding")}
              className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 text-left"
            >
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Section 02
                </span>
                <h3 className="text-base font-black italic text-slate-800 uppercase">
                  Branding & Social Parameters
                </h3>
              </div>
              <span className="text-slate-400 font-bold text-xs">
                {sections.branding ? "▲" : "▼"}
              </span>
            </button>
            {sections.branding && (
              <BrandingSection
                data={formData}
                onChange={updateFormData}
                state={state}
              />
            )}
          </div>

          {/* Accordion 3 */}
          <div className="bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("policies")}
              className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 text-left"
            >
              <div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Section 03
                </span>
                <h3 className="text-base font-black italic text-slate-800 uppercase">
                  Operational Rules & Financial Setup
                </h3>
              </div>
              <span className="text-slate-400 font-bold text-xs">
                {sections.policies ? "▲" : "▼"}
              </span>
            </button>
            {sections.policies && (
              <PolicySection
                data={formData}
                onChange={updateFormData}
                state={state}
              />
            )}
          </div>

          {/* Trigger Flow Action Container */}
          <div className="flex justify-center items-center">
            <Button
              type="submit"
              disabled={isPending}
              className="h-[60px] p-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white text-xs font-black italic uppercase tracking-widest rounded-2xl shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending
                ? "Processing Parameters..."
                : "Proceed to Summary Review"}
            </Button>
          </div>
        </form>
        {/* Review Modal */}
        <ReviewModal
          isOpen={isPreviewOpen}
          onClose={handleCancelReview}
          onConfirm={handleFinalConfirmSubmission}
          data={formData}
          isSubmitting={isPending}
        />
      </main>
    </div>
  );
}
