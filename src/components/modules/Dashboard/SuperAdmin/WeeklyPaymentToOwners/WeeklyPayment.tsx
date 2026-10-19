"use client";

import { useState, useTransition } from "react";
import { RefreshCw, Wallet, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { weeklyPayment } from "@/services/finance/weeklyPayment";
import { useTranslations } from "next-intl";

interface WeeklyPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName?: string;
  onSuccess?: () => void;
}

function generateTransactionRef() {
  const timePart = Date.now().toString(36).toUpperCase().slice(-4);
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${timePart}${randomPart}`;
}

export default function WeeklyPaymentModal({
  isOpen,
  onClose,
  businessId,
  businessName,
  onSuccess,
}: WeeklyPaymentModalProps) {
  const t = useTranslations("admin.wallets");
  const common = useTranslations("common");
  const [amount, setAmount] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setAmount("");
    setTransactionRef("");
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
    setTransactionRef(generateTransactionRef());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const parsedAmount = Number(amount);

    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(t("validAmount"));
      return;
    }

    if (!transactionRef.trim()) {
      setError(
        t("referenceRequired"),
      );
      return;
    }

    startTransition(async () => {
      const res = await weeklyPayment(businessId, {
        amount: parsedAmount,
        transactionRef: transactionRef.trim(),
        note: note.trim() || undefined,
      });

      if (!res.success) {
        const message = res.error || t("submitPaymentFailed");
        setError(message);
        toast.error(message);
        return;
      }

      toast.success(t("weeklyPaymentRecorded"));
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
            <div className="h-8 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {t("weeklyPaymentTitle")}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {businessName
                  ? t("weeklySettlementForBusiness", { businessName })
                  : t("weeklySettlement")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Amount */}
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
              placeholder={t("exampleAmount")}
              className="h-9 text-xs"
              disabled={isPending}
            />
          </div>

          {/* Transaction Ref — generate button + editable input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              {t("transactionReference")}
            </Label>
            <div className="flex gap-2">
              <Input
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder={t("exampleReference")}
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
              {t("generateOrEnterReference")}
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
              placeholder={t("settlementWeekExample")}
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
              {t("paymentRecorded")}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
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
              className="h-9 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5" />
                  {t("submitPayment")}
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
