/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { registerPlayer } from "@/services/auth/registerPlayer";
import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputFieldError from "@/components/shared/InputFieldError";
import Link from "next/link";
import {
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Building,
  MapPin,
  Camera,
  ChevronDown,
  ArrowRight,
  UserPlus,
} from "lucide-react";

const PlayerRegisterForm = ({ redirect }: { redirect?: string }) => {
  const t = useTranslations("auth");
  const [state, formAction, isPending] = useActionState(
    registerPlayer,
    undefined,
  );

  const searchParams = useSearchParams();
  const prefilledPhone = searchParams.get("prefill") || "";

  const [isOptionalOpen, setIsOptionalOpen] = useState(false);
  const [photoName, setPhotoName] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (state && !state.success) {
      if (state.message) {
        toast.error(state.message);
      }

      if (
        state.errors?.email ||
        state.errors?.clubName ||
        state.errors?.address ||
        state.errors?.photo
      ) {
        setTimeout(() => {
          setIsOptionalOpen(true);
        }, 0);
      }
    }
  }, [state]);

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="space-y-6 w-full max-w-2xl mx-auto"
    >
      {redirect && <input type="hidden" name="redirect" value={redirect} />}

      {/* --- HEADER SECTION --- */}
      <div className="space-y-1 text-left">
        <span className="text-xs font-semibold tracking-wider text-green-600 uppercase">
          {t("player.registration")}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {t("create.your.profile")}
        </h1>
        <p className="text-sm text-slate-500">
          {t("verify.your.identity.and.start.booking.matches.instantly")}
        </p>
      </div>

      {/* --- SECTION 1: REQUIRED FIELDS CARD --- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {t("step.01")}
            </span>
            <h2 className="text-base font-semibold text-slate-800">
              {t("required.information")}
            </h2>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <UserPlus className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <Field className="flex flex-col space-y-1.5">
            <FieldLabel
              htmlFor="fullName"
              className="text-xs font-medium text-slate-700"
            >
              {t("fullName")} <span className="text-rose-500">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                defaultValue={state?.fields?.fullName || ""}
                className="h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-green-500 bg-white text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <InputFieldError field="fullName" state={state} />
          </Field>

          {/* Phone Number */}
          <Field className="flex flex-col space-y-1.5">
            <FieldLabel
              htmlFor="phone"
              className="text-xs font-medium text-slate-700"
            >
              {t("phoneNumber")} <span className="text-rose-500">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+8801871624537"
                required
                defaultValue={state?.fields?.phone || prefilledPhone}
                className="h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-green-500 bg-white text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <InputFieldError field="phone" state={state} />
          </Field>

          {/* Password */}
          <Field className="flex flex-col space-y-1.5">
            <FieldLabel
              htmlFor="password"
              className="text-xs font-medium text-slate-700"
            >
              {t("password")} <span className="text-rose-500">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                defaultValue={state?.fields?.password || ""}
                className="h-11 pl-10 pr-10 rounded-xl border border-slate-200 focus:border-green-500 bg-white text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <InputFieldError field="password" state={state} />
          </Field>

          {/* Confirm Password */}
          <Field className="flex flex-col space-y-1.5">
            <FieldLabel
              htmlFor="confirmPassword"
              className="text-xs font-medium text-slate-700"
            >
              {t("confirm.password")} <span className="text-rose-500">*</span>
            </FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                defaultValue={state?.fields?.confirmPassword || ""}
                className="h-11 pl-10 pr-10 rounded-xl border border-slate-200 focus:border-green-500 bg-white text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <InputFieldError field="confirmPassword" state={state} />
          </Field>
        </FieldGroup>
      </div>

      {/* --- SECTION 2: ACCORDION CARD (OPTIONAL) --- */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
        <button
          type="button"
          onClick={() => setIsOptionalOpen(!isOptionalOpen)}
          className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50/60 transition-colors text-left"
        >
          <div className="space-y-0.5 pr-4">
            <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
              {t("step.02.optional")}
            </span>
            <h2 className="text-base font-semibold text-slate-800">
              {t("customize.your.profile")}
            </h2>
            <p className="text-xs text-slate-500">
              {t("add.profile.avatar.email.address.and.club.affiliation")}
            </p>
          </div>
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-500 transition-transform duration-200 shrink-0 ${
              isOptionalOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        {isOptionalOpen && (
          <div className="p-5 border-t border-slate-100 space-y-4">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Upload Zone */}
              <Field className="md:col-span-2 flex flex-col space-y-1.5">
                <FieldLabel
                  htmlFor="photo"
                  className="text-xs font-medium text-slate-700"
                >
                  {t("profile.avatar")}
                </FieldLabel>
                <div className="group relative flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 hover:border-green-500 rounded-xl bg-slate-50/50 hover:bg-white transition-all text-center cursor-pointer">
                  <label
                    htmlFor="file"
                    className="absolute inset-0 w-full h-full cursor-pointer z-10"
                  />
                  <input
                    id="file"
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPhotoName(file.name);
                    }}
                  />

                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-green-50 border border-slate-200 group-hover:border-green-200 transition-colors mb-1.5">
                    <Camera className="w-4 h-4 text-slate-500 group-hover:text-green-600" />
                  </div>

                  <p className="text-xs font-medium text-slate-700">
                    {photoName ? t("changeAvatarImage") : t("uploadProfileImage")}
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs truncate">
                    {photoName || t("supportedImageFormats")}
                  </p>
                </div>
                <InputFieldError field="photo" state={state} />
              </Field>

              {/* Email Address */}
              <Field className="md:col-span-2 flex flex-col space-y-1.5">
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-medium text-slate-700"
                >
                  {t("email.address")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="player@example.com"
                    defaultValue={state?.fields?.email || ""}
                    className="h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-green-500 bg-white text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <InputFieldError field="email" state={state} />
              </Field>

              {/* Club Name */}
              <Field className="flex flex-col space-y-1.5">
                <FieldLabel
                  htmlFor="clubName"
                  className="text-xs font-medium text-slate-700"
                >
                  {t("club.affiliation")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="clubName"
                    name="clubName"
                    type="text"
                    placeholder="Dhaka Strikers"
                    defaultValue={state?.fields?.clubName || ""}
                    className="h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-green-500 bg-white text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <InputFieldError field="clubName" state={state} />
              </Field>

              {/* Address */}
              <Field className="flex flex-col space-y-1.5">
                <FieldLabel
                  htmlFor="address"
                  className="text-xs font-medium text-slate-700"
                >
                  {t("primary.address")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Gulshan, Dhaka"
                    defaultValue={state?.fields?.address || ""}
                    className="h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:border-green-500 bg-white text-sm font-normal text-slate-900 placeholder:text-slate-400 transition-all outline-none"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <InputFieldError field="address" state={state} />
              </Field>
            </FieldGroup>
          </div>
        )}
      </div>

      {/* --- FORM SUBMIT ACTIONS --- */}
      <FieldGroup className="pt-1">
        <Field className="space-y-3">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] border-none text-white text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {isPending ? (
              t("creatingProfile")
            ) : (
              <>
                {t("create.player.profile")}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <FieldDescription className="text-center text-xs font-medium text-slate-500">
            {t("already.have.an.active.profile")} {" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              {t("loginHere")}
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};

export default PlayerRegisterForm;
