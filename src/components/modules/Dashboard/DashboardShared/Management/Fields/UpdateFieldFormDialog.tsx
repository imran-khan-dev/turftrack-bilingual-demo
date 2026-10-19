/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash, X } from "lucide-react";
import React, {
  useActionState,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";
import { FIELD_TYPES, FieldType } from "@/types/field";
import { useTranslations } from "next-intl";
import updateField from "@/services/fields/updateField";
import { useRouter } from "next/navigation";

interface TimeSlotPricing {
  start: string;
  end: string;
  price: number;
}

// Shape returned by the API for each row in `fieldPricings`
interface FieldPricingRow {
  id: string;
  fieldId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  price: number | string;
}

interface IField {
  id: string;
  fieldName?: string;
  description?: string;
  fieldType?: FieldType;
  pricePerSlot?: number | string;
  slotBreak?: number | string;
  amenities?: string[];
  inputPricing?: Record<string, TimeSlotPricing[]>;
  fieldPricings?: FieldPricingRow[];
  isActive?: boolean | "ACTIVE" | "INACTIVE";
}

interface IUpdateFieldFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  field: IField | null;
}

type FieldState = {
  success: boolean;
  message?: string;
  formData?: FormData;
};

const MAX_PERIODS_PER_DAY = 5;

const DAYS_OF_WEEK = [
  { index: "0", label: "Sunday" },
  { index: "1", label: "Monday" },
  { index: "2", label: "Tuesday" },
  { index: "3", label: "Wednesday" },
  { index: "4", label: "Thursday" },
  { index: "5", label: "Friday" },
  { index: "6", label: "Saturday" },
];

const EMPTY_PRICING: Record<string, TimeSlotPricing[]> = {
  "0": [],
  "1": [],
  "2": [],
  "3": [],
  "4": [],
  "5": [],
  "6": [],
};

const buildInputPricingFromFieldPricings = (
  fieldPricings: FieldPricingRow[],
): Record<string, TimeSlotPricing[]> => {
  const grouped: Record<string, TimeSlotPricing[]> = {
    "0": [],
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": [],
  };

  fieldPricings.forEach((row) => {
    const dayKey = String(row.dayOfWeek);
    if (grouped[dayKey]) {
      grouped[dayKey].push({
        start: row.startTime,
        end: row.endTime,
        price: Number(row.price) || 0,
      });
    }
  });

  return grouped;
};

const toActiveString = (value: IField["isActive"]): "ACTIVE" | "INACTIVE" => {
  if (value === false || value === "INACTIVE") return "INACTIVE";
  return "ACTIVE";
};

const UpdateFieldFormDialog = ({
  open,
  onClose,
  onSuccess,
  field,
}: IUpdateFieldFormDialogProps) => {
  const t = useTranslations("owner.fieldSettings");
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<FieldState, FormData>(
    updateField,
    { success: false },
  );

  const prevStateRef = useRef(state);

  // --- Form Local States ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldType, setFieldType] = useState<FieldType | "">("");
  const [pricePerSlot, setPricePerSlot] = useState("");
  const [slotBreak, setSlotBreak] = useState("5");
  const [isActive, setIsActive] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const [originalAmenities, setOriginalAmenities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [currentAmenity, setCurrentAmenity] = useState("");
  const router = useRouter();

  const [inputPricing, setInputPricing] =
    useState<Record<string, TimeSlotPricing[]>>(EMPTY_PRICING);

  const [prevFieldId, setPrevFieldId] = useState<string | null>(null);

  // --- Reset/Close Handlers ---
  const handleClose = useCallback(() => {
    formRef.current?.reset();
    setName("");
    setDescription("");
    setFieldType("");
    setPricePerSlot("");
    setSlotBreak("5");
    setIsActive("ACTIVE");
    setOriginalAmenities([]);
    setAmenities([]);
    setCurrentAmenity("");
    setInputPricing(EMPTY_PRICING);
    setPrevFieldId(null);
    onClose();
  }, [onClose]);

  // --- Adjust state when the prop (field) changes ---
  if (open && field && field.id !== prevFieldId) {
    setPrevFieldId(field.id);

    setName(field.fieldName || "");
    setDescription(field.description || "");
    setFieldType(field.fieldType || "");
    setPricePerSlot(field.pricePerSlot?.toString() || "");
    setSlotBreak(field.slotBreak?.toString() || "5");
    setIsActive(toActiveString(field.isActive));
    setOriginalAmenities(field.amenities || []);
    setAmenities(field.amenities || []);

    if (field.fieldPricings && field.fieldPricings.length > 0) {
      setInputPricing(buildInputPricingFromFieldPricings(field.fieldPricings));
    } else {
      const rawPricing = field.inputPricing || (field as any).pricing;

      if (rawPricing) {
        try {
          const parsedPricing =
            typeof rawPricing === "string"
              ? JSON.parse(rawPricing)
              : rawPricing;

          setInputPricing({
            "0": parsedPricing["0"] || [],
            "1": parsedPricing["1"] || [],
            "2": parsedPricing["2"] || [],
            "3": parsedPricing["3"] || [],
            "4": parsedPricing["4"] || [],
            "5": parsedPricing["5"] || [],
            "6": parsedPricing["6"] || [],
          });
        } catch (e) {
          console.error("Failed to parse field pricing data:", e);
          setInputPricing(EMPTY_PRICING);
        }
      } else {
        setInputPricing(EMPTY_PRICING);
      }
    }
  } else if (!open && prevFieldId !== null) {
    setPrevFieldId(null);
  }

  // Sync state with parent layouts and feedback
  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;
    if (state?.success) {
      toast.success(state.message || t("fieldUpdated"));
      router.refresh();
      onSuccess();
      setTimeout(() => handleClose(), 0);
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onSuccess, handleClose, router]);

  // --- Amenities actions ---
  const handleAddAmenity = () => {
    const trimmed = currentAmenity.trim();
    if (!trimmed) return;
    if (amenities.includes(trimmed)) {
      toast.error(t("duplicateAmenity"));
      return;
    }
    setAmenities((prev) => [...prev, trimmed]);
    setCurrentAmenity("");
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setAmenities((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const addAmenities = amenities.filter((a) => !originalAmenities.includes(a));
  const removeAmenities = originalAmenities.filter(
    (a) => !amenities.includes(a),
  );

  // --- Input Pricing Actions ---
  const handleAddPriceSlot = (dayIndex: string) => {
    const currentSlotsCount = inputPricing[dayIndex]?.length || 0;

    if (currentSlotsCount >= MAX_PERIODS_PER_DAY) {
      toast.error(
        `You can only add up to ${MAX_PERIODS_PER_DAY} periods per day.`,
      );
      return;
    }

    setInputPricing((prev) => ({
      ...prev,
      [dayIndex]: [
        ...(prev[dayIndex] || []),
        { start: "09:00", end: "17:00", price: Number(pricePerSlot) || 1000 },
      ],
    }));
  };

  const handleRemovePriceSlot = (dayIndex: string, slotIdx: number) => {
    setInputPricing((prev) => ({
      ...prev,
      [dayIndex]: (prev[dayIndex] || []).filter((_, idx) => idx !== slotIdx),
    }));
  };

  const handleUpdatePriceSlot = (
    dayIndex: string,
    slotIdx: number,
    key: keyof TimeSlotPricing,
    value: string | number,
  ) => {
    setInputPricing((prev) => {
      const daySlots = [...(prev[dayIndex] || [])];
      if (daySlots[slotIdx]) {
        daySlots[slotIdx] = {
          ...daySlots[slotIdx],
          [key]: key === "price" ? Number(value) : value,
        };
      }
      return { ...prev, [dayIndex]: daySlots };
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 border border-slate-200 bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-lg font-bold text-slate-800">
            {t("updateField")}
          </DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col flex-1 min-h-0"
        >
          {/* ID Binding for server patch queries */}
          <input type="hidden" name="id" value={field?.id || ""} />

          {/* Hidden bindings mirroring state values into standard FormData */}
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="description" value={description} />
          <input type="hidden" name="fieldType" value={fieldType} />
          <input type="hidden" name="pricePerSlot" value={pricePerSlot} />
          <input type="hidden" name="slotBreak" value={slotBreak} />
          <input type="hidden" name="isActive" value={isActive} />
          {field && <input type="hidden" name="fieldId" value={field.id} />}

          {/* Amenities diff, not a full replacement array */}
          {addAmenities.map((amenity, idx) => (
            <input
              key={`add-${idx}`}
              type="hidden"
              name="addAmenities[]"
              value={amenity}
            />
          ))}
          {removeAmenities.map((amenity, idx) => (
            <input
              key={`remove-${idx}`}
              type="hidden"
              name="removeAmenities[]"
              value={amenity}
            />
          ))}

          {/* Stringified JSON mapping schema */}
          <input
            type="hidden"
            name="inputPricing"
            value={JSON.stringify(inputPricing)}
          />

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
            {/* Field Name */}
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="fieldName"
                className="text-xs font-semibold text-slate-600"
              >
                {t("fieldName")}
              </FieldLabel>
              <Input
                id="fieldName"
                type="text"
                required
                placeholder={t("fieldNameExample")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
              />
              <InputFieldError field="name" state={state} />
            </Field>

            {/* Description */}
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="description"
                className="text-xs font-semibold text-slate-600"
              >
                {t("description")}
              </FieldLabel>
              <Textarea
                id="description"
                placeholder={t("fieldDescriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[80px] rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500 resize-y"
              />
              <InputFieldError field="description" state={state} />
            </Field>

            {/* Double Row: fieldType & pricePerSlot */}
            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="fieldType"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("typeSize")}
                </FieldLabel>
                <Select
                  value={fieldType}
                  onValueChange={(val) => setFieldType(val as FieldType)}
                >
                  <SelectTrigger
                    id="fieldType"
                    className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium px-3 focus:ring-1 focus:ring-green-500"
                  >
                    <SelectValue placeholder={t("selectDimension")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white p-1">
                    {FIELD_TYPES.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="text-sm rounded-lg cursor-pointer focus:bg-slate-50"
                      >
                        {t(`type.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputFieldError field="fieldType" state={state} />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="pricePerSlot"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("basePrice")}
                </FieldLabel>
                <Input
                  id="pricePerSlot"
                  type="number"
                  min={0}
                  placeholder="3000"
                  value={pricePerSlot}
                  onChange={(e) => setPricePerSlot(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
                />
                <InputFieldError field="pricePerSlot" state={state} />
              </Field>
            </div>

            {/* Slot break + Active status */}
            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="slotBreak"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("breakTime")}
                </FieldLabel>
                <Input
                  id="slotBreak"
                  type="number"
                  min={0}
                  placeholder="5"
                  value={slotBreak}
                  onChange={(e) => setSlotBreak(e.target.value)}
                  className="h-10 rounded-xl border-slate-200"
                />
                <InputFieldError field="slotBreak" state={state} />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="isActive"
                  className="text-xs font-semibold text-red-600"
                >
                  {t("status")}
                </FieldLabel>
                <Select
                  value={isActive}
                  onValueChange={(val) =>
                    setIsActive(val as "ACTIVE" | "INACTIVE")
                  }
                >
                  <SelectTrigger
                    id="isActive"
                    className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium px-3"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white p-1">
                    <SelectItem
                      value="ACTIVE"
                      className="text-sm rounded-lg cursor-pointer focus:bg-slate-50"
                    >
                      {t("active")}
                    </SelectItem>
                    <SelectItem
                      value="INACTIVE"
                      className="text-sm rounded-lg cursor-pointer focus:bg-slate-50"
                    >
                      {t("inactive")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <InputFieldError field="isActive" state={state} />
              </Field>
            </div>

            {/* Dynamic Amenities Collector Layout */}
            <Field className="space-y-2">
              <FieldLabel className="text-xs font-semibold text-slate-600">
                {t("amenities")}
              </FieldLabel>
              <div className="flex gap-2">
                <Input
                  placeholder={t("amenitiesPlaceholder")}
                  value={currentAmenity}
                  onChange={(e) => setCurrentAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAmenity();
                    }
                  }}
                  className="h-10 rounded-xl border-slate-200"
                />
                <Button
                  type="button"
                  onClick={handleAddAmenity}
                  className="h-10 rounded-xl px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold transition-colors"
                >
                  Add
                </Button>
              </div>

              {/* Added Amenities Badges list */}
              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  {amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(idx)}
                        className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <InputFieldError field="addAmenities" state={state} />
              <InputFieldError field="removeAmenities" state={state} />
            </Field>

            {/* Complex Dynamic Input Pricing Weekly Matrix */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t("weeklySchedule")}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {t("scheduleDescription", { count: MAX_PERIODS_PER_DAY })}
                </p>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 border border-slate-200 rounded-xl p-3 bg-slate-50/40">
                {DAYS_OF_WEEK.map((day) => {
                  const daySlots = inputPricing[day.index] || [];
                  const isLimitReached = daySlots.length >= MAX_PERIODS_PER_DAY;

                  return (
                    <div
                      key={day.index}
                      className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">
                          {t(`day.${day.index}`)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddPriceSlot(day.index)}
                          disabled={isLimitReached}
                          className="h-7 text-xs text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1 font-bold px-2 disabled:opacity-50 disabled:hover:bg-transparent disabled:text-slate-400 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Period{" "}
                          {isLimitReached && `(${MAX_PERIODS_PER_DAY} max)`}
                        </Button>
                      </div>

                      {daySlots.length === 0 ? (
                        <p className="text-[10px] text-slate-400 italic pl-1">
                          No special hours defined. Day falls back to general
                          Slot Pricing.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {daySlots.map((slot, slotIdx) => (
                            <div
                              key={slotIdx}
                              className="grid grid-cols-12 gap-2 items-center"
                            >
                              {/* Start Time */}
                              <div className="col-span-4">
                                <Input
                                  type="time"
                                  value={slot.start}
                                  onChange={(e) =>
                                    handleUpdatePriceSlot(
                                      day.index,
                                      slotIdx,
                                      "start",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8 text-xs rounded-lg border-slate-200 p-1"
                                />
                              </div>
                              {/* End Time */}
                              <div className="col-span-4">
                                <Input
                                  type="time"
                                  value={slot.end}
                                  onChange={(e) =>
                                    handleUpdatePriceSlot(
                                      day.index,
                                      slotIdx,
                                      "end",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8 text-xs rounded-lg border-slate-200 p-1"
                                />
                              </div>
                              {/* Price field */}
                              <div className="col-span-3">
                                <Input
                                  type="number"
                                  placeholder={t("price")}
                                  value={slot.price}
                                  onChange={(e) =>
                                    handleUpdatePriceSlot(
                                      day.index,
                                      slotIdx,
                                      "price",
                                      e.target.value,
                                    )
                                  }
                                  className="h-8 text-xs rounded-lg border-slate-200 px-1.5"
                                />
                              </div>
                              {/* Delete button */}
                              <div className="col-span-1 flex justify-center">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemovePriceSlot(day.index, slotIdx)
                                  }
                                  className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <InputFieldError field="inputPricing" state={state} />
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 transition-colors px-5"
            >
              {isPending ? t("saving") : t("updateField")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFieldFormDialog;
