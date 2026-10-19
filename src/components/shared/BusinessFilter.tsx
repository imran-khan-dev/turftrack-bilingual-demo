"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

export interface AccessibleBusiness {
  id: string;
  name: string;
  slug: string;
  refundAllowed: boolean;
  refundPercent: string | number;
}

interface BusinessFilterProps {
  businesses: AccessibleBusiness[];
  paramKey?: string;
  placeholder?: string;
}

// Not choosing a business means "all venues" — so selecting the "All
// Venues" option deletes the businessId param entirely rather than
// setting it to some sentinel value like "all".
const ALL_VENUES_VALUE = "__all__";

export default function BusinessFilter({
  businesses,
  paramKey = "businessId",
  placeholder
}: BusinessFilterProps) {
  const t = useTranslations("common");
  const resolvedPlaceholder = placeholder ?? t("allVenues");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const businessId = searchParams.get(paramKey) || ALL_VENUES_VALUE;

  const handleChange = (value: string) => {
    if (isPending) return;
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL_VENUES_VALUE) {
      params.delete(paramKey);
    } else {
      params.set(paramKey, value);
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Select
      value={businessId}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger
        className={cn(
          "h-9 w-full sm:w-[200px] rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs px-3",
          businessId !== ALL_VENUES_VALUE && "border-green-200 bg-white",
        )}
      >
        {isPending ? (
          <span className="flex items-center gap-2 text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t("loading")}
          </span>
        ) : (
          <SelectValue placeholder={resolvedPlaceholder} />
        )}
      </SelectTrigger>
      <SelectContent className="rounded-xl border-slate-200 shadow-md bg-white p-1">
        <SelectItem
          value={ALL_VENUES_VALUE}
          className="text-xs font-semibold rounded-lg cursor-pointer focus:bg-slate-50"
        >
          {resolvedPlaceholder}
        </SelectItem>
        {businesses.map((b) => (
          <SelectItem
            key={b.id}
            value={b.id}
            className="text-xs font-semibold rounded-lg cursor-pointer focus:bg-slate-50"
          >
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
