/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import InputFieldError from "@/components/shared/InputFieldError";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PolicySectionProps {
  data: any;
  onChange: (fields: any) => void;
  state: any;
}

const PLATFORM_FEATURES = [
  "FLOODLIGHTS",
  "INDOOR_ARENA",
  "PARKING_LOT",
  "CHANGING_ROOMS",
  "PREMIUM_TURF_MAT",
  "CAFETERIA",
  "REST_ZONES",
];

export default function PolicySection({
  data,
  onChange,
  state,
}: PolicySectionProps) {
  const [customFeatureInput, setCustomFeatureInput] = useState("");
  const [termInput, setTermInput] = useState("");

  // Safely ensure we always have an array to work with
  const currentFeatures = Array.isArray(data.features) ? data.features : [];
  const currentTerms = Array.isArray(data.businessTerms)
    ? data.businessTerms
    : [];

  // --- FEATURES MUTATION HANDLERS (UPDATED FOR ARRAY OF OBJECTS) ---
  const handleFeatureToggle = (featureStr: string) => {
    const activeFeatures = [...currentFeatures];
    // Look up via target object property matching
    const index = activeFeatures.findIndex((f: any) => f.title === featureStr);

    if (index > -1) {
      activeFeatures.splice(index, 1);
    } else {
      activeFeatures.push({ title: featureStr }); // Save as backend structure object
    }
    onChange({ features: activeFeatures });
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFeature = customFeatureInput
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_");
    if (!cleanFeature) return;

    const isDuplicate = currentFeatures.some(
      (f: any) => f.title === cleanFeature,
    );

    if (!isDuplicate) {
      onChange({ features: [...currentFeatures, { title: cleanFeature }] });
    }
    setCustomFeatureInput("");
  };

  // --- BUSINESS TERMS MUTATION HANDLERS ---
  const handleAddBusinessTerm = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTerm = termInput.trim();
    if (!cleanTerm) return;

    const isDuplicate = currentTerms.some(
      (t: any) => t.title.toUpperCase() === cleanTerm.toUpperCase(),
    );

    if (!isDuplicate) {
      onChange({ businessTerms: [...currentTerms, { title: cleanTerm }] });
    }
    setTermInput("");
  };

  const handleRemoveBusinessTerm = (indexToRemove: number) => {
    const filteredTerms = currentTerms.filter(
      (_: any, idx: number) => idx !== indexToRemove,
    );
    onChange({ businessTerms: filteredTerms });
  };

  return (
    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 md:p-8 bg-white border-t-2 border-slate-50">
      {/* FEATURE SELECTOR BLOCK */}
      <div className="md:col-span-2 border-b border-slate-100 pb-2">
        <h4 className="text-xs font-black tracking-widest text-green-600 uppercase">
          Available Pitch Features & Amenities *
        </h4>
      </div>

      <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PLATFORM_FEATURES.map((item) => {
          const isSelected = currentFeatures.some((f: any) => f.title === item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => handleFeatureToggle(item)}
              className={`p-3 text-[11px] font-black tracking-wide border-2 rounded-xl uppercase transition-all select-none cursor-pointer ${
                isSelected
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {item.replace("_", " ")}
            </button>
          );
        })}

        {currentFeatures
          .filter((f: any) => !PLATFORM_FEATURES.includes(f.title))
          .map((customItem: any) => (
            <button
              key={customItem.title}
              type="button"
              onClick={() => handleFeatureToggle(customItem.title)}
              className="p-3 text-[11px] font-black tracking-wide border-2 rounded-xl uppercase transition-all border-green-600 bg-green-600 text-white cursor-pointer flex items-center justify-center gap-1"
            >
              <span>{customItem.title.replace(/_/g, " ")}</span>
              <span className="text-[9px] opacity-70">✕</span>
            </button>
          ))}
      </div>

      <div className="md:col-span-2 flex gap-2">
        <Input
          type="text"
          placeholder="E.G. CHILLED WATER STATION, SHOE RENTAL"
          value={customFeatureInput}
          onChange={(e) => setCustomFeatureInput(e.target.value)}
          className="h-[48px] px-4 rounded-xl border-2 border-slate-100 font-semibold uppercase text-xs tracking-wide"
        />
        <InputFieldError field="features" state={state} />
        <button
          type="button"
          onClick={handleAddCustomFeature}
          className="h-[48px] px-5 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap"
        >
          + Add Amenity
        </button>
      </div>

      {/* OPERATIONAL TOGGLES MATRIX */}
      <div className="md:col-span-2 border-b border-slate-100 pt-4 pb-2">
        <h4 className="text-xs font-black tracking-widest text-green-600 uppercase">
          Player Autonomy Permissions
        </h4>
      </div>

      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onChange({ cancelAllowed: !data.cancelAllowed })}
          className={`p-4 border-2 rounded-2xl flex flex-col items-start gap-2 transition-all cursor-pointer text-left select-none ${
            data.cancelAllowed
              ? "border-green-600 bg-green-50/50"
              : "border-slate-100 bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black tracking-wide uppercase text-slate-800">
              Allow Cancellation
            </span>
            <input
              type="checkbox"
              checked={data.cancelAllowed}
              readOnly
              className="w-4 h-4 accent-green-600 pointer-events-none"
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
            Let players cancel active slots
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            onChange({ rescheduleAllowed: !data.rescheduleAllowed })
          }
          className={`p-4 border-2 rounded-2xl flex flex-col items-start gap-2 transition-all cursor-pointer text-left select-none ${
            data.rescheduleAllowed
              ? "border-green-600 bg-green-50/50"
              : "border-slate-100 bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black tracking-wide uppercase text-slate-800">
              Allow Rescheduling
            </span>
            <input
              type="checkbox"
              checked={data.rescheduleAllowed}
              readOnly
              className="w-4 h-4 accent-green-600 pointer-events-none"
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
            Enable slot shift management panels
          </p>
        </button>

        <button
          type="button"
          onClick={() => onChange({ refundAllowed: !data.refundAllowed })}
          className={`p-4 border-2 rounded-2xl flex flex-col items-start gap-2 transition-all cursor-pointer text-left select-none ${
            data.refundAllowed
              ? "border-green-600 bg-green-50/50"
              : "border-slate-100 bg-slate-50/50"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black tracking-wide uppercase text-slate-800">
              Allow Refunds
            </span>
            <input
              type="checkbox"
              checked={data.refundAllowed}
              readOnly
              className="w-4 h-4 accent-green-600 pointer-events-none"
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
            Does your business allow refunds?
          </p>
        </button>
      </div>

      {/* DYNAMIC BUSINESS TERMS MANAGEMENT SYSTEM */}
      <div className="md:col-span-2 border-b border-slate-100 pt-4 pb-2">
        <h4 className="text-xs font-black tracking-widest text-green-600 uppercase">
          Venue Custom Rules & Regulations (Business Terms)
        </h4>
      </div>

      <div className="md:col-span-2 space-y-2">
        {currentTerms.length === 0 && (
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 italic bg-slate-50 p-4 rounded-xl text-center">
            No specific booking rules or terms declared yet.
          </p>
        )}
        {currentTerms.map((term: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3.5 border-2 border-slate-100 rounded-xl bg-white shadow-sm"
          >
            <h5 className="text-xs font-semibold text-slate-700 pr-4 uppercase">
              {term.title}
            </h5>
            <button
              type="button"
              onClick={() => handleRemoveBusinessTerm(idx)}
              className="p-1 px-2 rounded-lg border border-red-200 bg-red-50 text-[10px] font-black text-red-500 uppercase hover:bg-red-100 transition-all cursor-pointer whitespace-nowrap"
            >
              ✕ Remove
            </button>
          </div>
        ))}
        <InputFieldError field="businessTerms" state={state} />
      </div>

      <div className="md:col-span-2 flex flex-col space-y-1.5 bg-slate-50/40 p-4 rounded-2xl border-2 border-slate-100/80">
        <label className="text-[10px] font-black tracking-wider text-slate-500 uppercase">
          Enter New Policy Rule Condition
        </label>
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <Input
            type="text"
            placeholder="E.G. Players must wear appropriate sports shoes and attire while using the turf."
            value={termInput}
            maxLength={200}
            onChange={(e) => setTermInput(e.target.value)}
            className="h-[48px] px-4 bg-white border-2 border-slate-100 rounded-xl text-xs font-semibold normal-case tracking-wide flex-1 uppercase"
          />
          <button
            type="button"
            onClick={handleAddBusinessTerm}
            className="h-[48px] px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap cursor-pointer"
          >
            + Save Term Rule
          </button>
        </div>
      </div>

      {/* BANK SETTLEMENT ACCOUNT DATA STRUCTURE */}
      <div className="md:col-span-2 border-b border-slate-100 pt-4 pb-2">
        <h4 className="text-xs font-black tracking-widest text-green-600 uppercase">
          Primary Corporate Bank Settlement Route *
        </h4>
      </div>

      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="bankName"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Bank Institution Name *
        </FieldLabel>
        <Input
          id="bankName"
          type="text"
          placeholder="BRAC BANK PLC"
          required
          value={data.bankName}
          onChange={(e) => onChange({ bankName: e.target.value.toUpperCase() })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm"
        />
      </Field>

      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="branchName"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Branch Destination Name *
        </FieldLabel>
        <Input
          id="branchName"
          type="text"
          placeholder="GULSHAN AVENUE BRANCH"
          required
          value={data.branchName}
          onChange={(e) =>
            onChange({ branchName: e.target.value.toUpperCase() })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm"
        />
      </Field>

      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="accountName"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Settlement Account Title Name *
        </FieldLabel>
        <Input
          id="accountName"
          type="text"
          placeholder="BANANI TURF MANAGEMENT LTD"
          required
          value={data.accountName}
          onChange={(e) =>
            onChange({ accountName: e.target.value.toUpperCase() })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm"
        />
      </Field>

      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="accountNumber"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Account Number *
        </FieldLabel>
        <Input
          id="accountNumber"
          type="text"
          placeholder="150120XXXXXXXXXX"
          required
          value={data.accountNumber}
          onChange={(e) => onChange({ accountNumber: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm"
        />
        <InputFieldError field="accountNumber" state={state} />
      </Field>

      {/* MERCHANDISE PAYOUT FINANCIAL SUITE */}
      <div className="md:col-span-2 border-b border-slate-100 pt-4 pb-2">
        <h4 className="text-xs font-black tracking-widest text-green-600 uppercase">
          Mobile Finance Gateways
        </h4>
      </div>

      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="bkashNumber"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          bKash Disbursal Wallet *
        </FieldLabel>
        <Input
          id="bkashNumber"
          type="tel"
          placeholder="017XXXXXXXX"
          required
          value={data.bkashNumber}
          onChange={(e) => onChange({ bkashNumber: e.target.value })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm"
        />
        <InputFieldError field="bkashNumber" state={state} />
      </Field>

      <Field className="flex flex-col space-y-2">
        <FieldLabel
          htmlFor="bkashAccountType"
          className="text-xs font-black tracking-wider text-slate-600 uppercase"
        >
          Wallet Profile Type *
        </FieldLabel>
        <Select
          value={data.bkashAccountType}
          onValueChange={(value) => onChange({ bkashAccountType: value })}
        >
          <SelectTrigger
            id="bkashAccountType"
            className="w-full h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm font-semibold outline-none bg-white text-slate-800 shadow-sm transition-colors focus:ring-0 focus:border-green-600"
          >
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>

          <SelectContent className="rounded-xl border border-slate-100 shadow-md">
            <SelectItem
              value="MERCHANT"
              className="text-sm text-slate-700 font-semibold cursor-pointer focus:bg-slate-50 focus:text-slate-900 rounded-lg m-1"
            >
              MERCHANT PORTAL
            </SelectItem>
            <SelectItem
              value="PERSONAL"
              className="text-sm text-slate-700 font-semibold cursor-pointer focus:bg-slate-50 focus:text-slate-900 rounded-lg m-1"
            >
              PERSONAL WALLET
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {/* POLICY CONFIGURATIONS MATRIX INPUTS */}
      <div className="md:col-span-2 border-b border-slate-100 pt-4 pb-2">
        <h4 className="text-xs font-black tracking-widest text-green-600 uppercase">
          Configurable Booking Operational Controls
        </h4>
      </div>

      <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="cancelWindowHours"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Cancellation Window Limit (Hours) *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              The minimum number of hours before a booking start time that a
              user is allowed to cancel their match slot.
            </div>
          </div>
        </div>
        <Input
          id="cancelWindowHours"
          type="number"
          disabled={!data.cancelAllowed}
          required
          max={72}
          value={data.cancelWindowHours}
          onChange={(e) =>
            onChange({ cancelWindowHours: Number(e.target.value) })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm disabled:opacity-40 disabled:bg-slate-50"
        />
        <InputFieldError field="cancelWindowHours" state={state} />
      </Field>

      <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="rescheduleWindowHours"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Reschedule Window Limit (Hours) *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              The deadline threshold (in hours) before slot kickoff time during
              which a player is permitted to move their match date.
            </div>
          </div>
        </div>
        <Input
          id="rescheduleWindowHours"
          type="number"
          disabled={!data.rescheduleAllowed}
          required
          value={data.rescheduleWindowHours}
          onChange={(e) =>
            onChange({ rescheduleWindowHours: Number(e.target.value) })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm disabled:opacity-40 disabled:bg-slate-50"
        />
        <InputFieldError field="rescheduleWindowHours" state={state} />
      </Field>

      <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="rescheduleLimitCount"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Monthly Allowed Reschedules (Per Player) *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              The maximum total number of reschedules a single player account
              can execute across all their bookings combined in a single month.
            </div>
          </div>
        </div>
        <Input
          id="rescheduleLimitCount"
          type="number"
          disabled={!data.rescheduleAllowed}
          required
          value={data.rescheduleLimitCount}
          onChange={(e) =>
            onChange({ rescheduleLimitCount: Number(e.target.value) })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm disabled:opacity-40 disabled:bg-slate-50"
        />
        <InputFieldError field="rescheduleLimitCount" state={state} />
      </Field>

      {/* <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="multipleRescheduleCountLimit"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Reschedule Limit Count Per Booking *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              How many times a specific booking ticket ID can be shuffled around
              before it becomes completely locked down.
            </div>
          </div>
        </div>
        <Input
          id="multipleRescheduleCountLimit"
          type="number"
          disabled={!data.rescheduleAllowed}
          required
          value={data.multipleRescheduleCountLimit}
          onChange={(e) =>
            onChange({ multipleRescheduleCountLimit: Number(e.target.value) })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm disabled:opacity-40 disabled:bg-slate-50"
        />
        <InputFieldError field="multipleRescheduleCountLimit" state={state} />
      </Field> */}

      <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="refundPercent"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Refund Percentage Ratio (%) *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              The percentage proportion of the deposit or payment returned to
              the player on a valid cancellation.
            </div>
          </div>
        </div>
        <Input
          id="refundPercent"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={data.refundPercent}
          disabled={!data.refundAllowed}
          required
          onChange={(e) => onChange({ refundPercent: Number(e.target.value) })}
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm disabled:opacity-40 disabled:bg-slate-50"
        />
        <InputFieldError field="refundPercent" state={state} />
      </Field>

      {/* Required Minimum Advance Deposit */}
      <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="minDepositPercent"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Required Minimum Advance Deposit (%) *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              The minimum advance payment percentage a player must complete down
              to secure the field reservation online.
            </div>
          </div>
        </div>
        <Input
          id="minDepositPercent"
          type="number"
          min="0"
          max="100"
          step="0.01"
          required
          value={data.minDepositPercent}
          onChange={(e) =>
            onChange({ minDepositPercent: Number(e.target.value) })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm"
        />
        <InputFieldError field="minDepositPercent" state={state} />
      </Field>

      {/* NEW FIELD: Maximum Allowed Deposit */}
      <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="maxDepositPercent"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Maximum Allowed Deposit (%) *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              The maximum cap a player can pay online for bookings. Caps your
              financial exposure via the app gateways; remaining balances are
              paid at your field.
            </div>
          </div>
        </div>
        <Input
          id="maxDepositPercent"
          type="number"
          min="0"
          max="100"
          step="0.01"
          required
          value={data.maxDepositPercent ?? 100}
          onChange={(e) =>
            onChange({ maxDepositPercent: Number(e.target.value) })
          }
          className={`h-[56px] px-5 rounded-2xl border-2 text-sm transition-all ${
            data.maxDepositPercent !== undefined &&
            data.maxDepositPercent < data.minDepositPercent
              ? "border-red-400 focus:border-red-500 bg-red-50/10"
              : "border-slate-100 focus:border-green-600"
          }`}
        />
        <InputFieldError field="maxDepositPercent" state={state} />
      </Field>

      {/* Maximum Match Slots Per Single Order */}
      <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="maxSlotsPerBooking"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Maximum Match Slots Per Single Order *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              The single-transaction cap limiting how many slots a player can
              select at one time on checkout.
            </div>
          </div>
        </div>
        <Input
          id="maxSlotsPerBooking"
          type="number"
          required
          value={data.maxSlotsPerBooking}
          onChange={(e) =>
            onChange({ maxSlotsPerBooking: Number(e.target.value) })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm"
        />
        <InputFieldError field="maxSlotsPerBooking" state={state} />
      </Field>

      {/* Maximum Active Allowed Bookings Daily */}
      <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="maxBookingsPerDay"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Maximum Active Allowed Bookings Daily *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              Limits the maximum number of field bookings a player profile can
              place across the entire 24-hour cycle.
            </div>
          </div>
        </div>
        <Input
          id="maxBookingsPerDay"
          type="number"
          required
          value={data.maxBookingsPerDay}
          onChange={(e) =>
            onChange({ maxBookingsPerDay: Number(e.target.value) })
          }
          className="h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm"
        />
        <InputFieldError field="maxBookingsPerDay" state={state} />
      </Field>

      {/* Discount Rule Execution Priority */}
      <Field className="flex flex-col space-y-2">
        <div className="flex items-center space-x-1.5 group relative">
          <FieldLabel
            htmlFor="discountPriority"
            className="text-xs font-black tracking-wider text-slate-600 uppercase"
          >
            Discount Rule Execution Priority *
          </FieldLabel>
          <div className="cursor-help text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold p-0.5">
            ⓘ
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-3 bg-slate-900 text-white font-normal normal-case text-xs rounded-xl shadow-xl z-10 leading-relaxed border border-slate-800">
              Determines how concurrent promotions layer out if field discounts,
              business codes, and customer vouchers overlap.
            </div>
          </div>
        </div>

        <Select
          value={data.discountPriority || "HIGHEST_ONLY"}
          onValueChange={(value) => onChange({ discountPriority: value })}
        >
          <SelectTrigger
            id="discountPriority"
            className="w-full h-[56px] px-5 rounded-2xl border-2 border-slate-100 text-sm font-semibold outline-none bg-white text-slate-800 shadow-sm transition-colors focus:ring-0 focus:border-green-600 uppercase"
          >
            <SelectValue placeholder="Select discount priority" />
          </SelectTrigger>

          <SelectContent className="rounded-xl border bg-white border-slate-100 shadow-md max-h-[300px]">
            <SelectItem
              value="HIGHEST_ONLY"
              className="text-sm text-slate-700 font-semibold cursor-pointer focus:bg-slate-50 focus:text-slate-900 rounded-lg m-1 uppercase"
            >
              HIGHEST ONLY (DEFAULT)
            </SelectItem>
            <SelectItem
              value="PROMO_ONLY"
              className="text-sm text-slate-700 font-semibold cursor-pointer focus:bg-slate-50 focus:text-slate-900 rounded-lg m-1 uppercase"
            >
              PROMO ONLY
            </SelectItem>
            <SelectItem
              value="BUSINESS_FIRST"
              className="text-sm text-slate-700 font-semibold cursor-pointer focus:bg-slate-50 focus:text-slate-900 rounded-lg m-1 uppercase"
            >
              BUSINESS FIRST
            </SelectItem>
            <SelectItem
              value="FIELD_FIRST"
              className="text-sm text-slate-700 font-semibold cursor-pointer focus:bg-slate-50 focus:text-slate-900 rounded-lg m-1 uppercase"
            >
              FIELD FIRST
            </SelectItem>
            <SelectItem
              value="USER_ALWAYS_APPLY"
              className="text-sm text-slate-700 font-semibold cursor-pointer focus:bg-slate-50 focus:text-slate-900 rounded-lg m-1 uppercase"
            >
              USER ALWAYS APPLY
            </SelectItem>
          </SelectContent>
        </Select>
        <InputFieldError field="discountPriority" state={state} />
      </Field>
    </FieldGroup>
  );
}
