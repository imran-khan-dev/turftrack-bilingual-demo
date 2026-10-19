/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { BadgeCheck, Loader2, Pencil, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { verifyOtpAction } from "@/services/auth/verifyOtpAction";
import { updateBusinessNumbers } from "@/services/business/updateBusinessNumbers";
import { useTranslations } from "next-intl";

type NumberField = "contact" | "bkash";

interface NumberVerifyFieldProps {
  businessId: string;
  field: NumberField;
  label: string;
  currentNumber: string;
  isVerified: boolean;
  onVerified: (newNumber: string) => void;
  ownerView?: boolean;
  adminView?: boolean;
}

type Stage = "LOCKED" | "EDITING" | "SENDING" | "OTP_PENDING" | "CONFIRMING";

export default function NumberVerifyField({
  businessId,
  field,
  label,
  currentNumber,
  isVerified,
  onVerified,
  ownerView = false,
  adminView = false,
}: NumberVerifyFieldProps) {
  const t = useTranslations("owner.business");
  const translatedView = ownerView || adminView;
  const ui = (key: string, fallback: string) => translatedView ? t(key) : fallback;
  const [stage, setStage] = useState<Stage>(isVerified ? "LOCKED" : "EDITING");
  const [value, setValue] = useState(currentNumber || "");
  const [otpCode, setOtpCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown for the 5-minute OTP window
  useEffect(() => {
    if (stage !== "OTP_PENDING" || secondsLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage, secondsLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleVerifyClick = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      toast.error(ui("enterNumber", "Please enter a number."));
      return;
    }

    setStage("SENDING");

    try {
      const result = await updateBusinessNumbers({
        businessId,
        purpose:
          field === "contact"
            ? "UPDATE_BUSINESS_VERIFICATION"
            : "UPDATE_BKASH_VERIFICATION",
        number: trimmed,
      });

      // 1. Check if the server action failed
      if (!result?.success) {
        toast.error(result?.error || ui("processNumberFailed", "Failed to process number."));
        setStage("EDITING");
        return;
      }

      // Safely extract payload returned from backend API
      const responseData = result.data?.data ?? result.data;

      // 2. If backend auto-verified without sending OTP
      if (!responseData?.isOtpSent) {
        toast.success(translatedView ? t("numberVerified", { label }) : `${label} verified.`);
        onVerified(trimmed);
        setStage("LOCKED");
        return;
      }

      // 3. OTP was sent — move to OTP input
      toast.success(translatedView ? t("otpSent", { number: trimmed }) : `OTP sent to ${trimmed}.`);
      setSecondsLeft(5 * 60);
      setStage("OTP_PENDING");
    } catch (err: any) {
      console.error("error from client:", err);
      toast.error(err?.message || ui("verificationGenericError", "Something went wrong."));
      setStage("EDITING");
    }
  };

  const handleConfirmOtp = async () => {
    const trimmedCode = otpCode.trim();
    if (!trimmedCode) {
      toast.error(ui("enterSentCode", "Please enter the code sent to your number."));
      return;
    }

    setStage("CONFIRMING");

    try {
      const result = await verifyOtpAction({
        businessId,
        purpose:
          field === "contact"
            ? "UPDATE_BUSINESS_VERIFICATION"
            : "UPDATE_BKASH_VERIFICATION",
        activeNumber: value.trim(),
        code: trimmedCode,
      });

      if (!result?.success) {
        toast.error(
          result?.data?.message || ui("incorrectCode", "Incorrect code. Please try again."),
        );
        setStage("OTP_PENDING");
        return;
      }

      toast.success(translatedView ? t("numberVerified", { label }) : `${label} verified.`);
      onVerified(value.trim());
      setOtpCode("");
      setStage("LOCKED");
    } catch (error: any) {
      toast.error(error?.message || ui("verificationFailed", "Verification failed."));
      setStage("OTP_PENDING");
    }
  };

  const handleChangeNumber = () => {
    setValue(""); // clear so the owner enters a fresh number, old verified value stays in DB until a new one is confirmed
    setOtpCode("");
    setStage("EDITING");
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-slate-600">{label}</Label>
        {stage === "LOCKED" && (
          <button
            type="button"
            onClick={handleChangeNumber}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
          >
            <Pencil className="w-3 h-3" />
            {ui("changeNumber", "Change Number")}
          </button>
        )}
      </div>

      {/* LOCKED state — verified, read-only */}
      {stage === "LOCKED" && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
          <span className="text-xs font-semibold text-emerald-800">
            {currentNumber}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
            <BadgeCheck className="w-3.5 h-3.5" />
            {ui("verified", "Verified")}
          </span>
        </div>
      )}

      {/* EDITING / SENDING state — input + verify button */}
      {(stage === "EDITING" || stage === "SENDING") && (
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={ui("phoneExample", "e.g. 01871624233")}
            className="h-9 text-xs flex-1"
            disabled={stage === "SENDING"}
          />
          <Button
            type="button"
            onClick={handleVerifyClick}
            disabled={stage === "SENDING"}
            className="h-9 text-xs bg-black hover:bg-black/80 text-white shrink-0"
          >
            {stage === "SENDING" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              ui("verify", "Verify")
            )}
          </Button>
        </div>
      )}

      {/* OTP_PENDING / CONFIRMING state — code entry with countdown */}
      {(stage === "OTP_PENDING" || stage === "CONFIRMING") && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5">
            <span className="text-[11px] text-slate-500">
              {translatedView ? t("codeSentTo", { number: value }) : <>Code sent to <span className="font-semibold">{value}</span></>}
            </span>
            <span
              className={cn(
                "text-[11px] font-bold tabular-nums",
                secondsLeft <= 30 ? "text-rose-600" : "text-slate-600",
              )}
            >
              {secondsLeft > 0 ? formatTime(secondsLeft) : ui("expired", "Expired")}
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder={ui("otpPlaceholder", "Enter 6-digit code")}
              className="h-9 text-xs flex-1"
              disabled={stage === "CONFIRMING" || secondsLeft <= 0}
              maxLength={6}
            />
            <Button
              type="button"
              onClick={handleConfirmOtp}
              disabled={stage === "CONFIRMING" || secondsLeft <= 0}
              className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            >
              {stage === "CONFIRMING" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          {secondsLeft <= 0 && (
            <button
              type="button"
              onClick={handleVerifyClick}
              className="text-[11px] font-semibold text-blue-600 hover:underline"
            >
              {ui("resendCode", "Resend code")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
