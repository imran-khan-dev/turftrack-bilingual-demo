/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { RefreshCw, Coins, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { settleAppFee } from "@/services/finance/settleAppFee";
import { useTranslations } from "next-intl";

interface SettleFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName?: string;
  onSuccess?: () => void;
}

function generateTransactionRef() {
  const timePart = Date.now().toString(36).toUpperCase().slice(-4);
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SETTLE-${timePart}${randomPart}`;
}

export default function SettleFeeModal({
  isOpen,
  onClose,
  businessId,
  businessName,
  onSuccess,
}: SettleFeeModalProps) {
  const t = useTranslations("admin.wallets");
  const common = useTranslations("common");
  const [amount, setAmount] = useState("");
  const [netAmount, setNetAmount] = useState(""); // ADDED
  const [method, setMethod] = useState<"cash" | "transfer">("cash");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setAmount("");
    setNetAmount(""); // ADDED
    setMethod("cash");
    setReference("");
    setNote("");
    setError(null);
    setSuccess(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const handleGenerateRef = () => {
    setReference(generateTransactionRef());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsedAmount = Number(amount);
    const parsedNetAmount = netAmount ? Number(netAmount) : undefined;

    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(t("validSettlementAmount"));
      return;
    }

    if (!reference.trim()) {
      setError(t("transactionReferenceRequired"));
      return;
    }

    startTransition(async () => {
      const res = await settleAppFee(businessId, {
        amount: parsedAmount,
        netAmount: parsedNetAmount,
        method: method as any,
        reference: reference.trim(),
        note: note.trim() || undefined,
      } as any);

      if (!res.success) {
        const message = res.error || t("settleFeeFailed");
        setError(message);
        toast.error(message);
        return;
      }

      toast.success(t("feeSettled"));
      setSuccess(true);
      resetForm();
      onSuccess?.();
      onClose();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-rose-500 shrink-0" />
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {t("settleAppFeeTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {businessName
                  ? t("recordManualFeeSettlementForBusiness", { businessName })
                  : t("recordManualFeeSettlement")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Grid layout for Amounts */}
          <div className="grid grid-cols-2 gap-3">
            {/* Settlement Amount */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {t("amount")}
              </Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t("exampleSettlementAmount")}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>

            {/* Net Amount */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                {t("netAmount")}
              </Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={netAmount}
                onChange={(e) => setNetAmount(e.target.value)}
                placeholder={t("exampleNetAmount")}
                className="h-9 text-xs"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              {t("paymentMethod")}
            </Label>
            <Select
              value={method}
              onValueChange={(val: "cash" | "transfer") => setMethod(val)}
              disabled={isPending}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={t("selectMethod")} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem
                  value="cash"
                  className="text-xs text-slate-700 focus:bg-slate-900 focus:text-white data-[state=checked]:font-bold"
                >
                  {t("cash")}
                </SelectItem>
                <SelectItem
                  value="transfer"
                  className="text-xs text-slate-700 focus:bg-slate-900 focus:text-white data-[state=checked]:font-bold"
                >
                  {t("bankTransfer")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Reference */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              {t("transactionReference")}
            </Label>
            <div className="flex gap-2">
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={t("exampleTransactionReference")}
                className="h-9 text-xs flex-1 font-mono tracking-wide"
                disabled={isPending}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateRef}
                disabled={isPending}
                className="h-9 px-3 shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="text-[10px] text-slate-400">
              {t("generatePaymentReference")}
            </p>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              {t("optionalNote")}
            </Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("paymentForDebtExample")}
              className="text-xs min-h-[70px]"
              disabled={isPending}
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-rose-600">{error}</p>
          )}

          {success && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("settlementRecorded")}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-1 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-9 text-xs font-semibold"
            >
              {common("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs tracking-wide"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5" />
                  {t("settleFee")}
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
