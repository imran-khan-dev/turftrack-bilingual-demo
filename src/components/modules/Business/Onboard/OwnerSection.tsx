/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import InputFieldError from "@/components/shared/InputFieldError";

interface OwnerSectionProps {
  data: any;
  onChange: (fields: any) => void;
  state: any;
}

export default function OwnerSection({
  data,
  onChange,
  state,
}: OwnerSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States to track visibility toggles independently
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onChange({ ownerPhoto: null });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 md:p-8 bg-white border-t-2 border-slate-50">
      {/* Full Name */}
      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="fullName"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Full Name *
        </FieldLabel>
        <Input
          id="fullName"
          type="text"
          placeholder="JOHN DOE"
          required
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value.toUpperCase() })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold outline-none uppercase text-sm tracking-wide transition-all"
        />
      </Field>

      {/* Phone Number */}
      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="phone"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Account Phone Number *
        </FieldLabel>
        <Input
          id="phone"
          type="tel"
          placeholder="+88017XXXXXXXX"
          required
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold outline-none text-sm tracking-wide transition-all"
        />
        <InputFieldError field="phone" state={state} />
      </Field>

      {/* Email Address - OPTIONAL */}
      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="email"
          className="text-xs font-black tracking-wider text-slate-400 uppercase"
        >
          Email Address (Optional)
        </FieldLabel>
        <Input
          id="email"
          type="email"
          placeholder="OWNER@TURFPLATFORM.COM"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold outline-none text-sm tracking-wide transition-all"
        />
        <InputFieldError field="email" state={state} />
      </Field>

      {/* Password Block Wrapper Row to balance layout presentation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:col-span-1">
        {/* Password */}
        <Field className="flex flex-col space-y-2">
          <FieldLabel
            htmlFor="password"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Secure Password *
          </FieldLabel>
          <div className="relative w-full">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={data.password}
              onChange={(e) => onChange({ password: e.target.value })}
              className="h-[56px] pl-5 pr-12 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold outline-none text-sm transition-all w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Crossed eye icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                // Normal eye icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </Field>

        {/* Confirm Password */}
        <Field className="flex flex-col space-y-2">
          <FieldLabel
            htmlFor="confirmPassword"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Confirm Password *
          </FieldLabel>
          <div className="relative w-full">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={data.confirmPassword || ""}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              className={`h-[56px] pl-5 pr-12 rounded-2xl border-2 bg-white font-semibold outline-none text-sm transition-all w-full ${
                data.confirmPassword && data.password !== data.confirmPassword
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-100 focus:border-green-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors select-none"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                // Crossed eye icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                // Normal eye icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
          <InputFieldError field="confirmPassword" state={state} />
        </Field>
      </div>

      {/* Address */}
      <Field className="md:col-span-2 flex flex-col space-y-2">
        <FieldLabel
          htmlFor="address"
          className="text-xs font-black tracking-wider text-slate-400 uppercase"
        >
          Permanent Address (Optional)
        </FieldLabel>
        <Input
          id="address"
          type="text"
          placeholder="HOUSE 12, ROAD 4, BANANI, DHAKA"
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value.toUpperCase() })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold outline-none text-sm transition-all"
        />
      </Field>

      {/* Owner Profile Photo File */}
      <Field className="md:col-span-2 flex flex-col space-y-2">
        <FieldLabel className="text-xs font-black tracking-wider text-slate-400 uppercase">
          Owner Representative Portrait Photo (Optional)
        </FieldLabel>
        <div className="group relative mt-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-green-500 rounded-[2rem] bg-slate-50/30 hover:bg-white transition-all cursor-pointer">
          {!data.ownerPhoto && (
            <label
              htmlFor="ownerPhoto"
              className="absolute inset-0 w-full h-full cursor-pointer z-10"
            />
          )}

          <input
            id="ownerPhoto"
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onChange({ ownerPhoto: file });
            }}
          />

          <span className="text-slate-400 font-bold text-lg mb-1">📷</span>

          <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
            {data.ownerPhoto ? "Change Uploaded Image" : "Upload Owner Image"}
          </p>

          <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-xs truncate">
            {data.ownerPhoto
              ? data.ownerPhoto.name
              : "Required. Supports JPG, PNG, WebP up to 5MB"}
          </p>

          {data.ownerPhoto && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="mt-3 relative z-20 px-3 py-1.5 rounded-xl border-2 border-red-100 bg-red-50 text-[10px] font-black italic text-red-500 uppercase tracking-wider transition-all hover:bg-red-100 active:scale-[0.97]"
            >
              ✕ Remove File
            </button>
          )}
        </div>
      </Field>
    </FieldGroup>
  );
}
