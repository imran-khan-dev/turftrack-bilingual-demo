/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { getBusinessData } from "@/services/business/getBusinessData";
import {
  getAccessibleBusinesses,
  AccessibleBusiness,
} from "@/utils/getAccessibleBusinesses";
import createPromo from "@/services/discount/createPromo";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface IPromoFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface IField {
  id: string;
  name: string;
}

type PromoState = {
  success: boolean;
  message?: string;
  formData?: FormData;
};

const PromoFormDialog = ({
  open,
  onClose,
  onSuccess,
}: IPromoFormDialogProps) => {
  const t = useTranslations("owner.promo");
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<PromoState, FormData>(
    createPromo,
    { success: false },
  );

  const prevStateRef = useRef(state);

  const [businesses, setBusinesses] = useState<AccessibleBusiness[]>([]);
  const [fields, setFields] = useState<IField[]>([]);
  const [fieldsLoading, setFieldsLoading] = useState(false);

  const [businessId, setBusinessId] = useState("");
  const [fieldId, setFieldId] = useState("");
  const [discountType, setDiscountType] = useState("FLAT");
  const [discountValue, setDiscountValue] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [maxUsage, setMaxUsage] = useState("");
  const [maxUsagePerUser, setMaxUsagePerUser] = useState("");

  // Load businesses accessible to the current user
  useEffect(() => {
    if (!open) return;
    (async () => {
      const result = await getUserInfo();

      const user =
        result.status !== "error" && result.status !== "unauthenticated"
          ? result.user
          : null;

      setBusinesses(getAccessibleBusinesses(user));
    })();
  }, [open]);

  // Load fields for the currently selected business via getBusinessData(slug)
  useEffect(() => {
    if (!businessId) {
      setFields([]);
      return;
    }
    const slug = businesses.find((b) => b.id === businessId)?.slug;
    if (!slug) {
      setFields([]);
      return;
    }
    setFieldsLoading(true);
    (async () => {
      try {
        const business = await getBusinessData(slug);
        setFields(business?.fields || []);
      } catch {
        setFields([]);
      } finally {
        setFieldsLoading(false);
      }
    })();
  }, [businessId, businesses]);

  // Reset fieldId if it no longer belongs to the selected business
  useEffect(() => {
    if (fieldId && !fields.some((f) => f.id === fieldId)) {
      setFieldId("");
    }
  }, [fields, fieldId]);

  const handleClose = useCallback(() => {
    formRef.current?.reset();
    setBusinessId("");
    setFieldId("");
    setDiscountType("FLAT");
    setDiscountValue("");
    setMaxUsage("");
    setMaxUsagePerUser("");
    setDateRange(undefined);
    onClose();
  }, [onClose]);

  // Handle server actions sync
  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;
    if (state?.success) {
      toast.success(state.message || t("created"));
      handleClose();
      onSuccess();
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onSuccess, handleClose]);

  // Handle dynamic type updates to ensure values remain valid
  useEffect(() => {
    if (discountType === "PERCENT" && Number(discountValue) > 100) {
      setDiscountValue("100");
    }
  }, [discountType, discountValue]);

  const handleDiscountValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;
    if (discountType === "PERCENT" && Number(val) > 100) {
      setDiscountValue("100");
    } else {
      setDiscountValue(val);
    }
  };

  const validFromISO = dateRange?.from
    ? new Date(
        Date.UTC(
          dateRange.from.getFullYear(),
          dateRange.from.getMonth(),
          dateRange.from.getDate(),
          0,
          0,
          0,
          0,
        ),
      ).toISOString()
    : "";

  const validUntilISO = dateRange?.to
    ? new Date(
        Date.UTC(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth(),
          dateRange.to.getDate(),
          23,
          59,
          59,
          999,
        ),
      ).toISOString()
    : "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 border border-slate-200 bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-lg font-bold text-slate-800">
            {t("createTitle")}
          </DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col flex-1 min-h-0"
        >
          <input type="hidden" name="businessId" value={businessId} />
          <input type="hidden" name="fieldId" value={fieldId} />
          <input type="hidden" name="discountType" value={discountType} />
          <input type="hidden" name="validFrom" value={validFromISO} />
          <input type="hidden" name="validUntil" value={validUntilISO} />

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Business Dropdown Layout */}
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="businessId"
                className="text-xs font-semibold text-slate-600"
              >
                {t("business")}
              </FieldLabel>
              <Select value={businessId} onValueChange={setBusinessId}>
                <SelectTrigger
                  id="businessId"
                  className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium px-3 focus:ring-1 focus:ring-green-500 hover:bg-slate-100/50 transition-colors"
                >
                  <SelectValue placeholder={t("selectBusiness")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white p-1">
                  {businesses.map((b) => (
                    <SelectItem
                      key={b.id}
                      value={b.id}
                      className="text-sm rounded-lg focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
                    >
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputFieldError field="businessId" state={state} />
            </Field>

            {/* Field Dropdown Layout */}
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="fieldId"
                className="text-xs font-semibold text-slate-600"
              >
                {t("field")}
              </FieldLabel>
              <Select
                value={fieldId}
                onValueChange={setFieldId}
                disabled={!businessId || fieldsLoading}
              >
                <SelectTrigger
                  id="fieldId"
                  className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium px-3 focus:ring-1 focus:ring-green-500 hover:bg-slate-100/50 disabled:opacity-60 transition-colors"
                >
                  <SelectValue
                    placeholder={
                      !businessId
                        ? t("selectBusinessFirst")
                        : fieldsLoading
                          ? t("loadingFields")
                          : t("selectField")
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white p-1">
                  {fields.map((f) => (
                    <SelectItem
                      key={f.id}
                      value={f.id}
                      className="text-sm rounded-lg focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
                    >
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputFieldError field="fieldId" state={state} />
            </Field>

            {/* Discount configurations */}
            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="discountType"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("discountType")}
                </FieldLabel>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger
                    id="discountType"
                    className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium px-3 transition-colors"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white p-1">
                    <SelectItem
                      value="FLAT"
                      className="text-sm rounded-lg focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
                    >
                      {t("flat")}
                    </SelectItem>
                    <SelectItem
                      value="PERCENT"
                      className="text-sm rounded-lg focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
                    >
                      {t("percent")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <InputFieldError field="discountType" state={state} />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="discountValue"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("discountValue")} {discountType === "PERCENT" ? "(%)" : ""}
                </FieldLabel>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min={0}
                  max={discountType === "PERCENT" ? 100 : undefined}
                  step="any"
                  placeholder={discountType === "PERCENT" ? "10" : "50"}
                  value={discountValue}
                  onChange={handleDiscountValueChange}
                  className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500"
                />
                <InputFieldError field="discountValue" state={state} />
              </Field>
            </div>

            {/* Valid Period Date Range Display */}
            <Field className="space-y-1.5">
              <FieldLabel
                htmlFor="dateRange"
                className="text-xs font-semibold text-slate-600"
              >
                {t("validPeriod")}
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateRange"
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-10 w-full justify-start text-left font-medium rounded-xl border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100/50 text-sm px-3",
                      !dateRange && "text-slate-400",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-400 shrink-0" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>{t("pickDateRange")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                {/* Fixed explicitly with clean white bg to block layering translucent leaks */}
                <PopoverContent
                  className="w-auto p-0 border border-slate-200 shadow-xl rounded-xl bg-white"
                  align="start"
                >
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    initialFocus
                    className="bg-white"
                  />
                </PopoverContent>
              </Popover>
              <InputFieldError field="validFrom" state={state} />
              <InputFieldError field="validUntil" state={state} />
            </Field>

            {/* Usage Metrics Configs */}
            <div className="grid grid-cols-2 gap-4">
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="maxUsage"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("maxUsage")}
                </FieldLabel>
                <Input
                  id="maxUsage"
                  name="maxUsage"
                  type="number"
                  min={1}
                  placeholder="100"
                  value={maxUsage}
                  onChange={(e) => setMaxUsage(e.target.value)}
                  className="h-10 rounded-xl border-slate-200"
                />
                <InputFieldError field="maxUsage" state={state} />
              </Field>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="maxUsagePerUser"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("maxUsagePerUser")}
                </FieldLabel>
                <Input
                  id="maxUsagePerUser"
                  name="maxUsagePerUser"
                  type="number"
                  min={1}
                  placeholder="2"
                  value={maxUsagePerUser}
                  onChange={(e) => setMaxUsagePerUser(e.target.value)}
                  className="h-10 rounded-xl border-slate-200"
                />
                <InputFieldError field="maxUsagePerUser" state={state} />
              </Field>
            </div>
          </div>

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
              {isPending ? t("saving") : t("create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PromoFormDialog;
