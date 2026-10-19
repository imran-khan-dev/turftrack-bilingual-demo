"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { SpecialPricing } from "@/types/specialPricing";
import {
  formatSpecialPricingDate,
  formatSpecialPricingTimeRange,
} from "@/utils/specialPricingFormat";
import { useTranslations } from "next-intl";

interface SpecialPricingRowProps {
  item: SpecialPricing;
  isDeleting: boolean;
  onEdit: (item: SpecialPricing) => void;
  onDelete: (id: string) => void;
}

const SpecialPricingRow = ({
  item,
  isDeleting,
  onEdit,
  onDelete,
}: SpecialPricingRowProps) => {
  const t = useTranslations("owner.fieldSettings");
  return (
    <div className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-slate-800">
          {formatSpecialPricingDate(item.specificDate)}
        </span>
        <span className="text-xs text-slate-500">
          {formatSpecialPricingTimeRange(item.startTime, item.endTime)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-green-700">
          {item.price}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onEdit(item)}
          aria-label={t("editPricing")}
          className="h-8 w-8 text-slate-400 hover:text-slate-700 rounded-lg"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item.id)}
          aria-label={t("deleteRule")}
          disabled={isDeleting}
          className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg disabled:opacity-50"
        >
          <Trash className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default SpecialPricingRow;
