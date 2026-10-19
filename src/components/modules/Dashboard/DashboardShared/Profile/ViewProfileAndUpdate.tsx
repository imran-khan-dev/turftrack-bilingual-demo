/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import updateMyProfile from "@/services/user/updateMyProfile";
import { cn } from "@/lib/utils";
import {
  Camera,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  BadgeCheck,
} from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import Image from "next/image";
import { redirect } from "next/navigation";
import { IAuthUser } from "@/types/user";
import { useTranslations } from "next-intl";

type ProfileState = {
  success: boolean;
  message?: string;
  entries?: any;
};

const ViewProfileAndUpdate = ({ playerView = false, managerView = false, ownerView = false }: { playerView?: boolean; managerView?: boolean; ownerView?: boolean }) => {
  const translated = playerView || managerView || ownerView;
  const t = useTranslations("player.profileUi");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState<ProfileState, FormData>(
    updateMyProfile,
    { success: false },
  );

  const prevStateRef = useRef(state);

  const [profile, setProfile] = useState<IAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [clubName, setClubName] = useState("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Load current profile
  const loadProfile = async () => {
    setLoading(true);
    const result = await getUserInfo();

    if (result.status === "error" || result.status === "unauthenticated")
      return redirect("/login");

    const data = result.user;

    if (data) {
      setProfile(data);
      setFullName(data.fullName || "");
      setAddress(data.address || "");
      setClubName(data.clubName || "");
      setPhotoPreview(data.photo || null);
      setPhotoFile(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadProfile();
    })();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  // Handle server action result
  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state?.success) {
      toast.success(state.message || (translated ? t("updated") : "Profile updated successfully"));
      const timer = window.setTimeout(() => {
        loadProfile();
      }, 0);
      return () => {
        window.clearTimeout(timer);
      };
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, translated, t]);

  // Revoke object URL on unmount / change
  useEffect(() => {
    return () => {
      if (photoPreview && photoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  if (loading) {
    return (
      <div className="w-full animate-pulse space-y-4">
        <div className="h-20 bg-slate-100 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-2xl" />
          <div className="lg:col-span-2 h-64 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  const isActive = profile?.isActive === "ACTIVE";
  const initial = (profile?.fullName || fullName || "?")
    .charAt(0)
    .toUpperCase();

  return (
    // Single form now wraps the header strip (photo/file input) AND the
    // editable fields grid below, so FormData picks up "file" correctly.
    <form action={formAction} className="w-full space-y-6">
      {/* Header strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 rounded-2xl px-5 sm:px-6 py-5 shadow-sm">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt={translated ? t("profileImage") : "Profile"}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-slate-400">
                  {initial}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-900 hover:bg-slate-700 border-2 border-white flex items-center justify-center text-white transition-colors"
              aria-label={translated ? t("changePhoto") : "Change photo"}
            >
              <Camera className="w-3 h-3" />
            </button>
            <input
              ref={fileInputRef}
              id="file"
              name="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-base sm:text-lg font-bold text-slate-900 truncate">
                {profile?.fullName || fullName || (translated ? t("yourName") : "Your Name")}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5 uppercase tracking-wide">
                <BadgeCheck className="w-3 h-3" />
                {profile?.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {profile?.email || profile?.phone}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wide shrink-0",
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200",
          )}
        >
          {isActive ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5" />
          )}
          {isActive ? (translated ? t("active") : "Active") : (translated ? t("inactive") : "Inactive")}
        </div>
      </div>

      {/* Main content: contact card + editable form, side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info card */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 h-fit space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            {translated ? t("contactInformation") : "Contact Information"}
          </h3>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                {translated ? t("email") : "Email"}
              </p>
              <p className="text-sm font-semibold text-slate-700 break-words">
                {profile?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                {translated ? t("phone") : "Phone"}
              </p>
              <p className="text-sm font-semibold text-slate-700 break-words">
                {profile?.phone || "N/A"}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-100">
            {translated ? t("contactNote") : "Email and phone are managed by your organization and can't be changed here."}
          </p>
        </div>

        {/* Editable fields — no longer its own <form>, just a section
            within the single outer form so "file" submits together
            with fullName/clubName/address. */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            {translated ? t("editDetails") : "Edit Details"}
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="fullName"
                  className="text-xs font-semibold text-slate-600"
                >
                  {translated ? t("fullName") : "Full Name"}
                </FieldLabel>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder={translated ? t("fullNamePlaceholder") : "Your full name"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
                />
                <InputFieldError field="fullName" state={state} />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="clubName"
                  className="text-xs font-semibold text-slate-600"
                >
                  {translated ? t("clubName") : "Club Name"}
                </FieldLabel>
                <Input
                  id="clubName"
                  name="clubName"
                  type="text"
                  placeholder={translated ? t("clubNamePlaceholder") : "e.g. Your Club Name"}
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
                />
                <InputFieldError field="clubName" state={state} />
              </Field>
            </div>

            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="address"
                className="text-xs font-semibold text-slate-600"
              >
                {translated ? t("address") : "Address"}
              </FieldLabel>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder={translated ? t("addressPlaceholder") : "House 12, Road 5, Dhaka"}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
              />
              <InputFieldError field="address" state={state} />
            </Field>

            <InputFieldError field="file" state={state} />

            <div className="flex justify-stretch sm:justify-end pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto h-11 sm:h-10 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 transition-colors px-6"
              >
                {isPending ? (translated ? t("saving") : "Saving...") : (translated ? t("saveChanges") : "Save Changes")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ViewProfileAndUpdate;
