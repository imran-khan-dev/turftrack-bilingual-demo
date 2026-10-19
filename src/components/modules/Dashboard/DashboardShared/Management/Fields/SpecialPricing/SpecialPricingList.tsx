"use client";

import { SpecialPricing } from "@/types/specialPricing";
import SpecialPricingRow from "./SpecialPricingRow";
import { useTranslations } from "next-intl";

interface SpecialPricingListProps {
  items: SpecialPricing[];
  isLoading: boolean;
  deletingId: string | null;
  onEdit: (item: SpecialPricing) => void;
  onDelete: (id: string) => void;
}

const SpecialPricingList = ({
  items,
  isLoading,
  deletingId,
  onEdit,
  onDelete,
}: SpecialPricingListProps) => {
  const t = useTranslations("owner.fieldSettings");
  if (isLoading) {
    return (
      <p className="text-xs text-slate-400 italic text-center py-6">
        {t("loadingSpecialPricing")}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-xs text-slate-400 italic text-center py-6">
        {t("noSpecialPricing")}
      </p>
    );
  }

  const sorted = [...items].sort((a, b) =>
    a.specificDate.localeCompare(b.specificDate),
  );

  return (
    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
      {sorted.map((item) => (
        <SpecialPricingRow
          key={item.id}
          item={item}
          isDeleting={deletingId === item.id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SpecialPricingList;
