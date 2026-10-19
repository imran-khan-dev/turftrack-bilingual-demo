"use client";

import { User, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

interface CustomerDetailsFormProps {
  name: string;
  phone: string;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  isPhoneValid: boolean;
  disabled: boolean;
  managerView?: boolean;
}

export default function CustomerDetailsForm({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  isPhoneValid,
  disabled,
  managerView = false,
}: CustomerDetailsFormProps) {
  const t = useTranslations("manager.manualBooking");
  return (
    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
      <div className="relative flex-1 sm:w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder={managerView ? t("customerName") : "Customer Name"}
          value={name}
          disabled={disabled}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full h-9 pl-9 pr-3 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none font-medium disabled:opacity-60"
        />
      </div>
      <div className="relative flex-1 sm:w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
        <Phone
          size={14}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${phone ? (isPhoneValid ? "text-emerald-500" : "text-rose-500") : "text-zinc-400"}`}
        />
        <input
          type="tel"
          placeholder={managerView ? t("customerPhone") : "Phone (e.g. 017XXXXXXXX)"}
          value={phone}
          disabled={disabled}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full h-9 pl-9 pr-3 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none font-medium disabled:opacity-60"
        />
      </div>
    </div>
  );
}
