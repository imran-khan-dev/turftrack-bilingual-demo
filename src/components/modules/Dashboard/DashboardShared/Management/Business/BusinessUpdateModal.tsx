"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import NumberVerifyField from "./NumberVerifyField";
import { updateBusiness } from "@/services/business/updateBusiness";
import Image from "next/image";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface Feature {
  title: string;
}

interface BusinessFull {
  id: string;
  name: string;
  slug: string;
  location: string;
  contactNumber: string;
  isContactVerified: boolean;
  bkashNumber: string;
  isBkashVerified: boolean;
  businessEmail?: string | null;
  aboutDesc?: string | null;
  logo?: string | null;
  facebookLink?: string | null;
  instagramLink?: string | null;
  whatsappLink?: string | null;
  googleMapLink?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  branchName?: string | null;
  allowPlayerCancel?: boolean;
  allowPlayerReschedule?: boolean;
  cancelWindowHours?: number;
  rescheduleWindowHours?: number;
  refundAllowed?: boolean;
  refundPercent?: number | string;
  minDepositPercent?: number | string;
  maxDepositPercent?: number | string;
  maxSlotsPerBooking?: number;
  maxBookingsPerDay?: number;
  bookingHorizonDays?: number;
  features?: Feature[];
  businessTerms?: Feature[];
  bankInfo?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
  };
  // Super admin only fields, "ACTIVE" / "INACTIVE", not boolean
  isActive?: string;
  noAppFeeWindow?: number | string;
  customFeeRate?: number | string;
  platformFeeType?: string;
  outstandingDebtLimit?: number | string;
  marketingLimitCount?: number | string;
  marketingLimitWindowHours?: number | string;
}

interface BusinessUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: BusinessFull | null;
  onSuccess?: () => void;
  role?: string;
}

const PLATFORM_FEE_TYPES = [
  { value: "PERCENT", label: "Percent" },
  { value: "FLAT", label: "Flat" },
];

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1.5">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function TagListEditor({
  label,
  placeholder,
  removeLabel,
  items,
  onChange,
}: {
  label: string;
  placeholder: string;
  removeLabel: string;
  items: Feature[];
  onChange: (items: Feature[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, { title: trimmed }]);
    setDraft("");
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="col-span-2 space-y-1.5">
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder={placeholder}
          className="h-9 text-xs flex-1"
        />
        <Button
          type="button"
          onClick={addItem}
          variant="outline"
          className="h-9 px-3"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {items.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-700"
            >
              {item.title}
              <button
                type="button"
                onClick={() => removeItem(idx)}
                aria-label={removeLabel}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SwitchRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function BusinessUpdateModal({
  open,
  onOpenChange,
  business,
  onSuccess,
  role,
}: BusinessUpdateModalProps) {
  const isSuperAdmin = role === "SUPER_ADMIN";
  const bt = useTranslations("owner.business");
  const adminT = useTranslations("admin.business");
  const ui = (key: string, fallback: string) => role === "OWNER" || isSuperAdmin ? bt(key) : fallback;

  const [contactNumber, setContactNumber] = useState(
    business?.contactNumber ?? "",
  );
  const [isContactVerified, setIsContactVerified] = useState(
    business?.isContactVerified ?? false,
  );
  const [bkashNumber, setBkashNumber] = useState(business?.bkashNumber ?? "");
  const [isBkashVerified, setIsBkashVerified] = useState(
    business?.isBkashVerified ?? false,
  );

  const [allowPlayerCancel, setAllowPlayerCancel] = useState(
    business?.allowPlayerCancel ?? true,
  );
  const [allowPlayerReschedule, setAllowPlayerReschedule] = useState(
    business?.allowPlayerReschedule ?? true,
  );
  const [refundAllowed, setRefundAllowed] = useState(
    business?.refundAllowed ?? true,
  );
  const [features, setFeatures] = useState<Feature[]>(business?.features ?? []);
  const [businessTerms, setBusinessTerms] = useState<Feature[]>(
    business?.businessTerms ?? [],
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(
    business?.logo ?? null,
  );

  const [isActive, setIsActive] = useState(
    (business?.isActive ?? "ACTIVE") === "ACTIVE",
  );
  const [platformFeeType, setPlatformFeeType] = useState(
    business?.platformFeeType ?? "PERCENT",
  );

  const [state, formAction, isPending] = useActionState(updateBusiness, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (!business) return;

    const t = setTimeout(() => {
      setContactNumber(business.contactNumber ?? "");
      setIsContactVerified(business.isContactVerified ?? false);
      setBkashNumber(business.bkashNumber ?? "");
      setIsBkashVerified(business.isBkashVerified ?? false);
      setAllowPlayerCancel(business.allowPlayerCancel ?? true);
      setAllowPlayerReschedule(business.allowPlayerReschedule ?? true);
      setRefundAllowed(business.refundAllowed ?? true);
      setFeatures(business.features ?? []);
      setBusinessTerms(business.businessTerms ?? []);
      setIsActive((business.isActive ?? "ACTIVE") === "ACTIVE");
      setPlatformFeeType(business.platformFeeType ?? "PERCENT");
    }, 0);

    return () => clearTimeout(t);
  }, [business]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);

      onSuccess?.();
      onOpenChange(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state, onOpenChange, onSuccess]);

  const originalSnapshot = useMemo(() => {
    if (!business) return {};

    const snapshot: Record<string, string> = {
      businessName: business.name ?? "",
      slug: business.slug ?? "",
      location: business.location ?? "",
      businessEmail: business.businessEmail ?? "",
      aboutDesc: business.aboutDesc ?? "",
      facebookLink: business.facebookLink ?? "",
      instagramLink: business.instagramLink ?? "",
      whatsappLink: business.whatsappLink ?? "",
      googleMapLink: business.googleMapLink ?? "",
      accountName: business.bankInfo?.accountName ?? "",
      accountNumber: business.bankInfo?.accountNumber ?? "",
      bankName: business.bankInfo?.bankName ?? "",
      branchName: business.bankInfo?.branchName ?? "",
      cancelWindowHours: String(business.cancelWindowHours ?? 24),
      rescheduleWindowHours: String(business.rescheduleWindowHours ?? 24),
      allowPlayerCancel: String(business.allowPlayerCancel ?? true),
      allowPlayerReschedule: String(business.allowPlayerReschedule ?? true),
      refundAllowed: String(business.refundAllowed ?? true),
      refundPercent: String(business.refundPercent ?? 0),
      minDepositPercent: String(business.minDepositPercent ?? 0),
      maxDepositPercent: String(business.maxDepositPercent ?? 100),
      maxSlotsPerBooking: String(business.maxSlotsPerBooking ?? 1),
      maxBookingsPerDay: String(business.maxBookingsPerDay ?? 1),
      bookingHorizonDays: String(business.bookingHorizonDays ?? 30),
      features: JSON.stringify(business.features ?? []),
      businessTerms: JSON.stringify(business.businessTerms ?? []),
    };

    if (isSuperAdmin) {
      snapshot.isActive = business.isActive ?? "ACTIVE";
      snapshot.noAppFeeWindow = String(business.noAppFeeWindow ?? "");
      snapshot.customFeeRate = String(business.customFeeRate ?? "");
      snapshot.platformFeeType = business.platformFeeType ?? "";
      snapshot.outstandingDebtLimit = String(
        business.outstandingDebtLimit ?? "",
      );
      snapshot.marketingLimitCount = String(business.marketingLimitCount ?? "");
      snapshot.marketingLimitWindowHours = String(
        business.marketingLimitWindowHours ?? "",
      );
    }

    return snapshot;
  }, [business, isSuperAdmin]);

  if (!business) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">
            {ui("manageBusiness", "Manage Business")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              {ui("verifiedNumbers", "Verified Numbers")}
            </h3>
            <div className="flex items-center gap-1.5 text-amber-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[10px] font-semibold">
                {ui("savesAfterVerification", "Saves instantly once verified")}
              </span>
            </div>
          </div>

          <NumberVerifyField
            businessId={business.id}
            field="contact"
            ownerView={role === "OWNER"}
            adminView={isSuperAdmin}
            label={ui("contactNumber", "Contact Number")}
            currentNumber={contactNumber}
            isVerified={isContactVerified}
            onVerified={(newNumber) => {
              setContactNumber(newNumber);
              setIsContactVerified(true);
            }}
          />

          <NumberVerifyField
            businessId={business.id}
            field="bkash"
            ownerView={role === "OWNER"}
            adminView={isSuperAdmin}
            label={ui("bkashNumber", "Bkash Number")}
            currentNumber={bkashNumber}
            isVerified={isBkashVerified}
            onVerified={(newNumber) => {
              setBkashNumber(newNumber);
              setIsBkashVerified(true);
            }}
          />
        </div>

        <form action={formAction} className="space-y-5 pt-2">
          <input type="hidden" name="businessId" value={business.id} />

          {/* One snapshot instead of one hidden input per field — see
              originalSnapshot comment above for why. */}
          <input
            type="hidden"
            name="_original"
            value={JSON.stringify(originalSnapshot)}
          />

          {/* Serialized array fields — schema preprocesses JSON strings */}
          <input
            type="hidden"
            name="features"
            value={JSON.stringify(features)}
          />
          <input
            type="hidden"
            name="businessTerms"
            value={JSON.stringify(businessTerms)}
          />

          {/* Serialized booleans — controlled Switch state, not native checkboxes */}
          <input
            type="hidden"
            name="allowPlayerCancel"
            value={String(allowPlayerCancel)}
          />
          <input
            type="hidden"
            name="allowPlayerReschedule"
            value={String(allowPlayerReschedule)}
          />
          <input
            type="hidden"
            name="refundAllowed"
            value={String(refundAllowed)}
          />

          {/* Super admin only — hidden inputs for controlled fields */}
          {isSuperAdmin && (
            <>
              <input
                type="hidden"
                name="isActive"
                value={isActive ? "ACTIVE" : "INACTIVE"}
              />
              <input
                type="hidden"
                name="platformFeeType"
                value={platformFeeType}
              />
            </>
          )}

          <FormSection title={ui("basicInfo", "Basic Info")}>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("businessName", "Business Name")}
              </Label>
              <Input
                name="businessName"
                defaultValue={business.name}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            {/* <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                Slug
              </Label>
              <Input
                name="slug"
                defaultValue={business.slug}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div> */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("location", "Location")}
              </Label>
              <Input
                name="location"
                defaultValue={business.location}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("businessEmail", "Business Email")}
              </Label>
              <Input
                name="businessEmail"
                type="email"
                defaultValue={business.businessEmail ?? ""}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("aboutDescription", "About Description")}
              </Label>
              <Textarea
                name="aboutDesc"
                defaultValue={business.aboutDesc ?? ""}
                className="text-xs min-h-[70px]"
                disabled={isPending}
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("logoLabel", "Logo")}
              </Label>
              <div className="flex items-center gap-3">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    width={56}
                    height={56}
                    alt={ui("logo", "Business logo")}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 text-center">
                    {ui("noLogo", "No logo")}
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    name="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (logoPreview && logoPreview.startsWith("blob:")) {
                        URL.revokeObjectURL(logoPreview);
                      }
                      setLogoPreview(URL.createObjectURL(file));
                    }}
                    className="h-9 text-xs file:text-xs file:font-semibold"
                    disabled={isPending}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {ui("imageRequirements", "PNG or JPG (max. 1MB)")}
                  </p>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title={ui("links", "Links")}>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("facebookLink", "Facebook Link")}
              </Label>
              <Input
                name="facebookLink"
                defaultValue={business.facebookLink ?? ""}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("instagramLink", "Instagram Link")}
              </Label>
              <Input
                name="instagramLink"
                defaultValue={business.instagramLink ?? ""}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("whatsappLink", "WhatsApp Link")}
              </Label>
              <Input
                name="whatsappLink"
                defaultValue={business.whatsappLink ?? ""}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("googleMapsLink", "Google Maps Link")}
              </Label>
              <Input
                name="googleMapLink"
                defaultValue={business.googleMapLink ?? ""}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
          </FormSection>

          <FormSection title={ui("bankInfo", "Bank Info")}>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("accountName", "Account Name")}
              </Label>
              <Input
                name="accountName"
                defaultValue={business.bankInfo?.accountName ?? ""}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("accountNumber", "Account Number")}
              </Label>
              <Input
                name="accountNumber"
                defaultValue={business.bankInfo?.accountNumber ?? ""}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("bankName", "Bank Name")}
              </Label>
              <Input
                name="bankName"
                defaultValue={business.bankInfo?.bankName ?? ""}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("branchName", "Branch Name")}
              </Label>
              <Input
                name="branchName"
                defaultValue={business.bankInfo?.branchName ?? ""}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
          </FormSection>

          <FormSection title={ui("cancellationReschedule", "Cancellation & Reschedule")}>
            <SwitchRow
              label={ui("allowPlayerCancel", "Allow Player Cancel")}
              checked={allowPlayerCancel}
              onCheckedChange={setAllowPlayerCancel}
            />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("cancelWindow", "Cancel Window (hours)")}
              </Label>
              <Input
                name="cancelWindowHours"
                type="number"
                min={24}
                max={72}
                defaultValue={business.cancelWindowHours ?? 24}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <SwitchRow
              label={ui("allowPlayerReschedule", "Allow Player Reschedule")}
              checked={allowPlayerReschedule}
              onCheckedChange={setAllowPlayerReschedule}
            />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("rescheduleWindow", "Reschedule Window (hours)")}
              </Label>
              <Input
                name="rescheduleWindowHours"
                type="number"
                defaultValue={business.rescheduleWindowHours ?? 24}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
          </FormSection>

          <FormSection title={ui("refundDeposit", "Refund & Deposit")}>
            <SwitchRow
              label={ui("refundAllowed", "Refund Allowed")}
              checked={refundAllowed}
              onCheckedChange={setRefundAllowed}
            />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("refundPercent", "Refund Percent (%)")}
              </Label>
              <Input
                name="refundPercent"
                type="number"
                min={0}
                max={100}
                defaultValue={business.refundPercent ?? 0}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("minDeposit", "Min Deposit (%)")}
              </Label>
              <Input
                name="minDepositPercent"
                type="number"
                min={0}
                max={100}
                defaultValue={business.minDepositPercent ?? 0}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("maxDeposit", "Max Deposit (%)")}
              </Label>
              <Input
                name="maxDepositPercent"
                type="number"
                min={0}
                max={100}
                defaultValue={business.maxDepositPercent ?? 100}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
          </FormSection>

          <FormSection title={ui("bookingRules", "Booking Rules")}>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("maxSlotsPerBooking", "Max Slots / Booking")}
              </Label>
              <Input
                name="maxSlotsPerBooking"
                type="number"
                min={0}
                defaultValue={business.maxSlotsPerBooking ?? 1}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("maxBookingsPerDay", "Max Bookings / Day")}
              </Label>
              <Input
                name="maxBookingsPerDay"
                type="number"
                min={0}
                defaultValue={business.maxBookingsPerDay ?? 1}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {ui("bookingHorizon", "Booking Horizon (days)")}
              </Label>
              <Input
                name="bookingHorizonDays"
                type="number"
                min={1}
                max={365}
                defaultValue={business.bookingHorizonDays ?? 30}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
          </FormSection>

          <FormSection title={ui("featuresTerms", "Features & Terms")}>
            <TagListEditor
              label={ui("features", "Features")}
              placeholder={ui("addFeaturePlaceholder", "Add feature...")}
              removeLabel={ui("removeTag", "Remove item")}
              items={features}
              onChange={setFeatures}
            />
            <TagListEditor
              label={ui("businessTerms", "Business Terms")}
              placeholder={ui("addTermPlaceholder", "Add business term...")}
              removeLabel={ui("removeTag", "Remove item")}
              items={businessTerms}
              onChange={setBusinessTerms}
            />
          </FormSection>

          {isSuperAdmin && (
            <div className="space-y-3 rounded-xl border-2 border-amber-200 bg-amber-50/40 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  {adminT("platformSettings")}
                </h3>
                <span className="text-[10px] text-amber-600 font-semibold">
                  {adminT("platformLevelSettings")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SwitchRow
                  label={ui("businessActive", "Business Active")}
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">
                    {adminT("platformFeeType")}
                  </Label>
                  <Select
                    value={platformFeeType}
                    onValueChange={setPlatformFeeType}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder={ui("selectFeeType", "Select fee type")} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200 shadow-lg">
                      {PLATFORM_FEE_TYPES.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="text-xs font-medium text-slate-700 cursor-pointer focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-900 data-[state=checked]:text-white data-[state=checked]:font-bold"
                        >
                          {ui(opt.value === "PERCENT" ? "percent" : "flat", opt.label)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">
                    {adminT("customFeeRate")} (%)
                  </Label>
                  <Input
                    name="customFeeRate"
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    defaultValue={business.customFeeRate ?? ""}
                    placeholder={ui("defaultRatePlaceholder", "Uses default rate if empty")}
                    className="h-9 text-xs"
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">
                    {adminT("noAppFeeWindow")}
                  </Label>
                  <Input
                    name="noAppFeeWindow"
                    type="number"
                    min={0}
                    defaultValue={business.noAppFeeWindow ?? ""}
                    className="h-9 text-xs"
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">
                    {adminT("outstandingDebtLimit")}
                  </Label>
                  <Input
                    name="outstandingDebtLimit"
                    type="number"
                    min={0}
                    defaultValue={business.outstandingDebtLimit ?? ""}
                    className="h-9 text-xs"
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">
                    {adminT("marketingLimitCount")}
                  </Label>
                  <Input
                    name="marketingLimitCount"
                    type="number"
                    min={0}
                    defaultValue={business.marketingLimitCount ?? ""}
                    className="h-9 text-xs"
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-600">
                    {adminT("marketingLimitWindow")}
                  </Label>
                  <Input
                    name="marketingLimitWindowHours"
                    type="number"
                    min={0}
                    defaultValue={business.marketingLimitWindowHours ?? ""}
                    className="h-9 text-xs"
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>
          )}

          {state?.message && (
            <p
              className={
                state.success
                  ? "text-xs text-emerald-600 font-medium"
                  : "text-xs text-rose-600 font-medium"
              }
            >
              {state.message}
            </p>
          )}

          <DialogFooter className="pt-2 sticky bottom-0 bg-white pb-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {ui("close", "Close")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-black hover:bg-black/80 text-white"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                ui("updateDetails", "Update Details")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
