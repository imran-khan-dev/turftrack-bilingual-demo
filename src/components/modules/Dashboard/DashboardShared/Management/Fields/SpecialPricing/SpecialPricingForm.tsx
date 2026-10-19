"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SpecialPricing, SpecialPricingInput } from "@/types/specialPricing";
import { useTranslations } from "next-intl";

interface SpecialPricingFormProps {
  editingItem: SpecialPricing | null;
  isSaving: boolean;
  onSubmit: (data: SpecialPricingInput) => Promise<boolean>;
  onCancel: () => void;
}

const EMPTY_FORM: SpecialPricingInput = {
  specificDate: "",
  startTime: "18:00",
  endTime: "22:00",
  price: 0,
};

const toDateInputValue = (raw: string): string => raw.split("T")[0] ?? raw;

const toTimeInputValue = (raw: string): string => {
  if (!raw.includes("T")) return raw;
  return raw.split("T")[1]?.slice(0, 5) ?? raw;
};

const SpecialPricingForm = ({
  editingItem,
  isSaving,
  onSubmit,
  onCancel,
}: SpecialPricingFormProps) => {
  const t = useTranslations("owner.fieldSettings");
  const [form, setForm] = useState<SpecialPricingInput>(EMPTY_FORM);

  // Tracks which item (by id, or null for "add mode") is currently loaded
  // into the form. Used to adjust `form` during render when `editingItem`
  // changes, instead of in a useEffect — this is React's recommended
  // pattern for "reset/derive local state when a prop changes". React
  // discards the render where the setState fires and immediately re-renders
  // with the updated state, so there's no extra effect/commit round trip.
  const [loadedItemId, setLoadedItemId] = useState<string | null>(null);

  const editingId = editingItem?.id ?? null;

  if (editingId !== loadedItemId) {
    setLoadedItemId(editingId);
    setForm(
      editingItem
        ? {
            specificDate: toDateInputValue(editingItem.specificDate),
            startTime: toTimeInputValue(editingItem.startTime),
            endTime: toTimeInputValue(editingItem.endTime),
            price: Number(editingItem.price),
          }
        : EMPTY_FORM,
    );
  }

  const handleChange = (key: keyof SpecialPricingInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.specificDate || !form.startTime || !form.endTime) return;
    const success = await onSubmit(form);
    if (success && !editingItem) {
      setForm(EMPTY_FORM);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-3 p-3 bg-slate-50/60 border border-slate-200 rounded-xl"
    >
      <Field className="space-y-1.5 col-span-2">
        <FieldLabel className="text-xs font-semibold text-slate-600">
          {t("specificDate")}
        </FieldLabel>
        <Input
          type="date"
          value={form.specificDate}
          onChange={(e) => handleChange("specificDate", e.target.value)}
          required
          className="h-9 rounded-lg border-slate-200 text-sm"
        />
      </Field>

      <Field className="space-y-1.5">
        <FieldLabel className="text-xs font-semibold text-slate-600">
          {t("startTime")}
        </FieldLabel>
        <Input
          type="time"
          value={form.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
          required
          className="h-9 rounded-lg border-slate-200 text-sm"
        />
      </Field>

      <Field className="space-y-1.5">
        <FieldLabel className="text-xs font-semibold text-slate-600">
          {t("endTime")}
        </FieldLabel>
        <Input
          type="time"
          value={form.endTime}
          onChange={(e) => handleChange("endTime", e.target.value)}
          required
          className="h-9 rounded-lg border-slate-200 text-sm"
        />
      </Field>

      <Field className="space-y-1.5 col-span-2">
        <FieldLabel className="text-xs font-semibold text-slate-600">
          {t("price")}
        </FieldLabel>
        <Input
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          required
          className="h-9 rounded-lg border-slate-200 text-sm"
        />
      </Field>

      <div className="col-span-2 flex justify-end gap-2 pt-1">
        {editingItem && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
            className="h-8 rounded-lg text-xs"
          >
            {t("cancel")}
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={isSaving}
          className="h-8 rounded-lg text-xs bg-slate-900 text-white hover:bg-slate-800"
        >
          {isSaving ? t("saving") : editingItem ? t("updateRule") : t("addRule")}
        </Button>
      </div>
    </form>
  );
};

export default SpecialPricingForm;
