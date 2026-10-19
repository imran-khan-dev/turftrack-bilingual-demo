"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectFilterProps {
  paramName: string;
  placeholder: string;
  defaultValue?: string;
  options: { label: string; value: string }[];
  hideAllOption?: boolean; // ADDED: allows disabling the "All X" fallback option
}

export default function SelectFilter({
  paramName,
  placeholder,
  defaultValue,
  options,
  hideAllOption = false, // ADDED
}: SelectFilterProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // CHANGED: fall back to defaultValue when the param isn't in the URL yet,
  // instead of always falling back to undefined
  const currentValue = searchParams.get(paramName) || defaultValue || undefined;

  // ADDED: if a defaultValue is provided and the param is missing from the URL,
  // write it into the URL on mount so it's always explicitly present
  // (important for cases like isOverPaidRefunded, where "absent" and "false"
  // mean different things to the backend)
  useEffect(() => {
    if (defaultValue && !searchParams.get(paramName)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramName, defaultValue);

      startTransition(() => {
        router.replace(`?${params.toString()}`);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramName, defaultValue]);

  const handleValueChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (val && val !== "all") {
      params.set(paramName, val);
      params.set("page", "1");
    } else if (defaultValue) {
      // CHANGED: if this filter has a required default, "clearing" it
      // should reset to defaultValue rather than removing the param entirely
      params.set(paramName, defaultValue);
      params.set("page", "1");
    } else {
      params.delete(paramName);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Select
      key={currentValue ?? "empty"}
      value={currentValue}
      onValueChange={handleValueChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-auto min-w-[150px] h-9 text-xs font-semibold text-slate-700 bg-slate-50 border-green-200 rounded-xl px-3 focus:ring-1 focus:ring-green-400 focus:border-green-400 transition-colors cursor-pointer">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl bg-white border-slate-200 shadow-md">
        {/* CHANGED: "All X" option only renders when hideAllOption is false */}
        {!hideAllOption && (
          <SelectItem
            value="all"
            className="text-xs text-slate-500 font-medium rounded-lg focus:bg-slate-50"
          >
            {t("allWithEntity", { entity: `${placeholder}s` })}
          </SelectItem>
        )}
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-xs text-slate-800 font-semibold rounded-lg cursor-pointer focus:bg-slate-50 focus:text-slate-900"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
