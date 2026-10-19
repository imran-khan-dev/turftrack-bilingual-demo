/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
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
import { getPromoById } from "@/services/discount/getPromoById";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { updatePromo } from "@/services/discount/updatePromo";
import { useTranslations } from "next-intl";

interface IUpdatePromoFormDialogProps {
  open: boolean;
  promoId: string;
  onClose: () => void;
  onSuccess: () => void;
}

type PromoState = {
  success: boolean;
  message?: string;
};

const UpdatePromoFormDialog = ({
  open,
  promoId,
  onClose,
  onSuccess,
}: IUpdatePromoFormDialogProps) => {
  const t = useTranslations("owner.promo");
  const formRef = useRef<HTMLFormElement>(null);
  const prevStateRef = useRef<PromoState | null>(null);

  const [loading, setLoading] = useState(false);
  const [prefillFailed, setPrefillFailed] = useState(false);

  const [discountType, setDiscountType] = useState("FLAT");
  const [discountValue, setDiscountValue] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [maxUsage, setMaxUsage] = useState("");
  const [maxUsagePerUser, setMaxUsagePerUser] = useState("");
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<PromoState, FormData>(
    async (_prevState: PromoState, formData: FormData) => {
      const result = await updatePromo(promoId, _prevState, formData);
      router.refresh();
      return result as PromoState;
    },
    { success: false },
  );

  useEffect(() => {
    if (!open || !promoId) return;

    let cancelled = false;
    setLoading(true);
    setPrefillFailed(false);

    (async () => {
      try {
        const result = await getPromoById(promoId);
        if (cancelled) return;
        const promo = result.data;
        if (promo) {
          setDiscountType(promo?.discountType || "FLAT");
          setDiscountValue(
            promo?.discountValue !== undefined
              ? String(promo.discountValue)
              : "",
          );
          setDateRange({
            from: promo?.validFrom ? new Date(promo.validFrom) : undefined,
            to: promo?.validUntil ? new Date(promo.validUntil) : undefined,
          });
          setMaxUsage(
            promo?.maxUsage !== undefined ? String(promo.maxUsage) : "",
          );
          setMaxUsagePerUser(
            promo?.maxUsagePerUser !== undefined
              ? String(promo.maxUsagePerUser)
              : "",
          );
        } else {
          setPrefillFailed(true);
        }
      } catch {
        if (!cancelled) setPrefillFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, promoId]);

  // Handle server action result
  useEffect(() => {
    if (state === prevStateRef.current) return;
    prevStateRef.current = state;
    if (state?.success) {
      toast.success(state.message || t("updated"));
      onSuccess();
      onClose();
    } else if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onSuccess, onClose]);

  // Keep percent discount within 0-100
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

  const handleClose = useCallback(() => {
    formRef.current?.reset();
    onClose();
  }, [onClose]);

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
            {t("updateTitle")}
          </DialogTitle>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col flex-1 min-h-0"
        >
          <input type="hidden" name="discountType" value={discountType} />
          <input type="hidden" name="validFrom" value={validFromISO} />
          <input type="hidden" name="validUntil" value={validUntilISO} />

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500">{t("loadingDetails")}</p>
            ) : (
              <>
                {prefillFailed && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    {t("prefillFailed")}
                  </p>
                )}

                {/* Discount type + value */}
                <div className="grid grid-cols-2 gap-4">
                  <Field className="space-y-1.5">
                    <FieldLabel
                      htmlFor="discountType"
                      className="text-xs font-semibold text-slate-600"
                    >
                      {t("discountType")}
                    </FieldLabel>
                    <Select
                      value={discountType}
                      onValueChange={setDiscountType}
                    >
                      <SelectTrigger
                        id="discountType"
                        className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium px-3"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-lg bg-white p-1">
                        <SelectItem
                          value="FLAT"
                          className="text-sm rounded-lg cursor-pointer"
                        >
                          {t("flat")}
                        </SelectItem>
                        <SelectItem
                          value="PERCENT"
                          className="text-sm rounded-lg cursor-pointer"
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
                      className="h-10 rounded-xl border-slate-200"
                    />
                    <InputFieldError field="discountValue" state={state} />
                  </Field>
                </div>

                {/* Valid date range */}
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
                          "h-10 w-full justify-start text-left font-medium rounded-xl border-slate-200 bg-slate-50 text-slate-700 text-sm px-3",
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

                {/* Usage limits */}
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
              </>
            )}
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
              disabled={isPending || loading}
              className="h-10 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 px-5"
            >
              {isPending ? t("saving") : t("update")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePromoFormDialog;
