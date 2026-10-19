/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import InputFieldError from "@/components/shared/InputFieldError";
import { checkSlugAvailability } from "@/services/business/checkSlugAvailability";

interface BrandingSectionProps {
  data: any;
  onChange: (fields: any) => void;
  state: any;
}

export default function BrandingSection({
  data,
  onChange,
  state,
}: BrandingSectionProps) {
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugMessage, setSlugMessage] = useState<{
    text: string;
    isAvailable: boolean | null;
  }>({
    text: "",
    isAvailable: null,
  });


  // Reference hook to reset internal data stream inside the input DOM layout
  const logoInputRef = useRef<HTMLInputElement>(null);

  const transformToSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");
  };

  useEffect(() => {

    if (!data.slug || data.slug.endsWith("-")) {
      setSlugMessage({ text: "", isAvailable: null });
      return;
    }

    setSlugChecking(true);

    const handler = setTimeout(async () => {
      try {
        const response = await checkSlugAvailability(data.slug);

        if (response.success && response.data?.available) {
          setSlugMessage({
            text: "✓ URL slug configuration is available!",
            isAvailable: true,
          });
        } else {
          setSlugMessage({
            text:
              response.data?.message ||
              response.error ||
              "✗ This custom slug is already taken.",
            isAvailable: false,
          });
        }
      } catch (err) {
        console.error(
          "Orchestration pipeline failure during custom slug lookups:",
          err,
        );
        setSlugMessage({
          text: "Error checking link routing availability.",
          isAvailable: false,
        });
      } finally {
        setSlugChecking(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [data.slug]);

  // Compute status tracking variant configurations cleanly
  const getSlugStyles = () => {
    if (slugMessage.isAvailable === true) {
      return "border-green-500 focus:border-green-600 text-green-600 focus:text-green-700 focus:ring-green-500";
    }
    if (slugMessage.isAvailable === false) {
      return "border-red-500 focus:border-red-600 text-red-600 focus:text-red-700 focus:ring-red-500";
    }
    return "border-slate-100 focus:border-green-600 text-slate-900";
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Avoids opening system dialog picker view overlay panel

    onChange({ logo: null });

    if (logoInputRef.current) {
      logoInputRef.current.value = ""; // Empty string allocation unbinds file attachment stream
    }
  };

  return (
    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 md:p-8 bg-white border-t-2 border-slate-50">
      {/* Venue Name */}
      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="businessName"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Business / Venue Name *
        </FieldLabel>
        <Input
          id="businessName"
          type="text"
          placeholder="BANANI TURF PRO"
          required
          value={data.businessName}
          onChange={(e) =>
            onChange({ businessName: e.target.value.toUpperCase() })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold text-sm transition-all"
        />
      </Field>

      {/* Custom Dynamic Live Input Slug */}
      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="slug"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Custom Live URL Path Slug *
        </FieldLabel>
        <div className="relative">
          <Input
            id="slug"
            type="text"
            required
            placeholder="banani-turf-pro"
            value={data.slug}
            onChange={(e) =>
              onChange({ slug: transformToSlug(e.target.value) })
            }
            className={`h-[56px] px-5 pr-10 rounded-2xl border-2 bg-white font-bold text-sm tracking-wide outline-none transition-all ${getSlugStyles()}`}
          />
          {slugChecking && (
            <span className="absolute right-4 top-4 text-xs font-black text-slate-400 animate-pulse">
              ...
            </span>
          )}
        </div>
        {slugMessage.text && (
          <p
            className={`text-[11px] font-black tracking-wide ${
              slugMessage.isAvailable ? "text-green-500" : "text-red-500"
            }`}
          >
            {slugMessage.text}
          </p>
        )}
      </Field>

      {/* Location */}
      <Field className="md:col-span-2 flex flex-col space-y-2">
        <FieldLabel
          htmlFor="location"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Physical Venue Geographic Location Address *
        </FieldLabel>
        <Input
          id="location"
          type="text"
          placeholder="PLOT 45, ROAD 11, BANANI, DHAKA"
          required
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value.toUpperCase() })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold text-sm transition-all"
        />
        <InputFieldError field="location" state={state} />
      </Field>

      {/* Booking Hotline Contact */}
      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="contactNumber"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Venue Booking Contact Hotline *
        </FieldLabel>
        <Input
          id="contactNumber"
          type="tel"
          placeholder="+88018XXXXXXXX"
          required
          value={data.contactNumber}
          onChange={(e) => onChange({ contactNumber: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold text-sm transition-all"
        />
        <InputFieldError field="contactNumber" state={state} />
      </Field>

      {/* Business Support Email */}
      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="businessEmail"
          className="text-xs font-black tracking-wider text-slate-400 uppercase"
        >
          Public Business Email Address (Optional)
        </FieldLabel>
        <Input
          id="businessEmail"
          type="email"
          placeholder="BOOKING@YOURTURF.COM"
          value={data.businessEmail}
          onChange={(e) => onChange({ businessEmail: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold text-sm transition-all"
        />
        <InputFieldError field="businessEmail" state={state} />
      </Field>

      {/* Google Maps Embed Link String */}
      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="googleMapLink"
          className="text-xs font-black tracking-wider text-slate-400 uppercase"
        >
          Google Maps Navigation Link (Optional)
        </FieldLabel>
        <Input
          id="googleMapLink"
          type="url"
          placeholder="https://maps.google.com/?q=..."
          value={data.googleMapLink}
          onChange={(e) => onChange({ googleMapLink: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold text-sm transition-all"
        />
        <InputFieldError field="googleMapLink" state={state} />
      </Field>

      {/* About Description text area */}
      <Field className="md:col-span-2 flex flex-col space-y-2">
        <FieldLabel
          htmlFor="aboutDesc"
          className="text-xs font-black tracking-wider text-slate-400 uppercase"
        >
          Venue Infrastructure Public Description (Optional)
        </FieldLabel>
        <textarea
          id="aboutDesc"
          rows={3}
          placeholder="PROVIDE DETAILED DESCRIPTION CONCERNING PITCH DIMENSIONS, FLOODLIGHT CAPABILITIES, GRASS QUALITY, AND SPARE FACILITIES..."
          value={data.aboutDesc}
          onChange={(e) =>
            onChange({ aboutDesc: e.target.value.toUpperCase() })
          }
          className="p-4 rounded-2xl border-2 border-slate-100 focus:border-green-600 bg-white font-semibold text-sm outline-none resize-none transition-all"
        />
        <InputFieldError field="aboutDesc" state={state} />
      </Field>

      {/* Social Media Section Banner */}
      <div className="md:col-span-2 border-b border-slate-100 pt-4 pb-1">
        <h4 className="text-xs font-black tracking-widest text-green-600 uppercase">
          Digital Media Links
        </h4>
      </div>

      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="facebookLink"
          className="text-xs font-black tracking-wider text-slate-400 uppercase"
        >
          Facebook Page Link (Optional)
        </FieldLabel>
        <Input
          id="facebookLink"
          type="url"
          placeholder="https://facebook.com/yourpage"
          value={data.facebookLink}
          onChange={(e) => onChange({ facebookLink: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 text-sm"
        />
        <InputFieldError field="facebookLink" state={state} />
      </Field>

      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="instagramLink"
          className="text-xs font-black tracking-wider text-slate-400 uppercase"
        >
          Instagram Link (Optional)
        </FieldLabel>
        <Input
          id="instagramLink"
          type="url"
          placeholder="https://instagram.com/yourprofile"
          value={data.instagramLink}
          onChange={(e) => onChange({ instagramLink: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 text-sm"
        />
        <InputFieldError field="instagramLink" state={state} />
      </Field>

      <Field className="md:col-span-2 flex flex-col space-y-2">
        <FieldLabel
          htmlFor="whatsappLink"
          className="text-xs font-black tracking-wider text-slate-400 uppercase"
        >
          WhatsApp Connect Link (Optional)
        </FieldLabel>
        <Input
          id="whatsappLink"
          type="url"
          placeholder="https://wa.me/8801XXXXXXXXX"
          value={data.whatsappLink}
          onChange={(e) => onChange({ whatsappLink: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 focus:border-green-600 text-sm"
        />
        <InputFieldError field="whatsappLink" state={state} />
      </Field>

      {/* Brand Logo Upload Input */}
      <Field className="md:col-span-2 flex flex-col space-y-2 pt-2">
        <FieldLabel className="text-xs font-black tracking-wider text-slate-400 uppercase">
          Corporate Business Logo Image (Optional)
        </FieldLabel>
        <div className="p-5 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center relative hover:bg-white transition-all flex flex-col items-center justify-center">
          {/* Prevent click tracking layer logic on active states */}
          {!data.logo && (
            <label
              htmlFor="logo"
              className="absolute inset-0 cursor-pointer z-10"
            />
          )}

          <input
            type="file"
            accept="image/*"
            id="logo"
            ref={logoInputRef}
            className="hidden"
            onChange={(e) => onChange({ logo: e.target.files?.[0] || null })}
          />

          <p className="text-[11px] font-black tracking-wider text-slate-700 uppercase">
            {data.logo
              ? "✓ Uploaded Logo"
              : "Click to select logo binary attachment"}
          </p>

          <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-xs truncate">
            {data.logo ? data.logo.name : "Optional dropzone area"}
          </p>

          {data.logo && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="mt-3 relative z-20 px-3 py-1.5 rounded-xl border-2 border-red-100 bg-red-50 text-[10px] font-black italic text-red-500 uppercase tracking-wider transition-all hover:bg-red-100 active:scale-[0.97]"
            >
              ✕ Remove Logo
            </button>
          )}
        </div>
      </Field>
    </FieldGroup>
  );
}
