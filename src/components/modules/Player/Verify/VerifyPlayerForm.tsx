"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../../../ui/button";
import { FieldGroup, FieldLabel } from "../../../ui/field";
import { logoutUnverifed } from "@/services/auth/logout";
import { AlertTriangle, ArrowRight, RefreshCw, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface PlayerVerifyFormProps {
  initialPhone: string;
  onVerifyAction: (
    otpCode: string,
  ) => Promise<{ success: boolean; message?: string }>;
  onResendAction: () => Promise<{
    success: boolean;
    message?: string;
    secondsRemaining?: number;
  }>;
  onAbortAction: () => Promise<{ success: boolean; message?: string }>;
}

const PlayerVerifyForm = ({
  initialPhone,
  onVerifyAction,
  onResendAction,
  onAbortAction,
}: PlayerVerifyFormProps) => {
  const t = useTranslations("auth");
  const common = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/player/dashboard";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isPending, setIsPending] = useState(false);
  const [isAborting, setIsAborting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isSendingInitial, setIsSendingInitial] = useState(false);
  const [hasSentCode, setHasSentCode] = useState(false);
  const [otpTimeLeft, setOtpTimeLeft] = useState<number | null>(null);

  const [showAbortModal, setShowAbortModal] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Recover remaining time on mount
  useEffect(() => {
    const savedExpiry = localStorage.getItem(`otp_expiry_${initialPhone}`);
    if (savedExpiry) {
      const expiryTimestamp = parseInt(savedExpiry, 10);
      const now = Date.now();

      if (expiryTimestamp > now) {
        setHasSentCode(true);
        const remainingTime = Math.floor((expiryTimestamp - now) / 1000);
        setOtpTimeLeft(remainingTime);

        const elapsedSinceGeneration = 300 - remainingTime;
        if (elapsedSinceGeneration < 60) {
          setResendCooldown(60 - elapsedSinceGeneration);
        }
      } else {
        localStorage.removeItem(`otp_expiry_${initialPhone}`);
      }
    }
  }, [initialPhone]);

  // Main countdown timer
  useEffect(() => {
    if (otpTimeLeft === null) return;
    if (otpTimeLeft <= 0) {
      setOtpTimeLeft(null);
      setHasSentCode(false);
      localStorage.removeItem(`otp_expiry_${initialPhone}`);
      toast.error(t("yourOtpSessionExpired"));
      return;
    }

    const timer = setTimeout(() => {
      setOtpTimeLeft(otpTimeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpTimeLeft, initialPhone]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/\D/g, "");

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1) || "";
    setOtp(newOtp);

    if (val && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const newOtp = [...otp];

    pasted.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const lastIndex = Math.min(pasted.length - 1, 6 - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleInitialSendOtp = async () => {
    if (isSendingInitial) return;

    setIsSendingInitial(true);
    try {
      const result = await onResendAction();

      if (result.success) {
      toast.success(t("verificationCodeSentSuccessfully"));
        setHasSentCode(true);
        setResendCooldown(60);

        const serverSecondsLeft = result.secondsRemaining || 300;
        const absoluteExpiry = Date.now() + serverSecondsLeft * 1000;

        localStorage.setItem(
          `otp_expiry_${initialPhone}`,
          absoluteExpiry.toString(),
        );
        setOtpTimeLeft(serverSecondsLeft);
      } else {
        toast.error(result.message || t("failedToSendCode"));
      }
    } catch (err) {
      console.error("Unexpected client-side hook failure:", err);
      toast.error(t("errorSendingCode"));
    } finally {
      setIsSendingInitial(false);
    }
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasSentCode || otpTimeLeft === null) {
      toast.error(t("verificationContextExpired"));
      return;
    }

    const fullCode = otp.join("");

    if (fullCode.length < 6) {
      toast.error(t("enterCompleteSixDigitCode"));
      return;
    }

    setIsPending(true);
    try {
      const [result] = await Promise.all([
        onVerifyAction(fullCode),
        delay(1000),
      ]);
      if (result.success) {
        toast.success(t("profileVerified"));
        localStorage.removeItem(`otp_expiry_${initialPhone}`);
        router.push(redirectPath);
      } else {
        toast.error(result.message || t("invalidCodeRetry"));
      }
    } catch (err) {
      console.error("Unexpected client-side hook failure:", err);
      toast.error(t("unexpectedValidationFailure"));
    } finally {
      setIsPending(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      const result = await onResendAction();
      if (result.success) {
        toast.success(t("freshCodeSent"));
        setResendCooldown(60);

        const serverSecondsLeft = result.secondsRemaining || 300;
        const absoluteExpiry = Date.now() + serverSecondsLeft * 1000;

        localStorage.setItem(
          `otp_expiry_${initialPhone}`,
          absoluteExpiry.toString(),
        );
        setOtpTimeLeft(serverSecondsLeft);
      } else {
        toast.error(result.message || t("failedToSendCode"));
      }
    } catch (err) {
      console.error("Unexpected client-side hook failure:", err);
      toast.error(t("errorResendingCode"));
    } finally {
      setIsResending(false);
    }
  };

  const handleAbortSession = async () => {
    if (isAborting) return;

    setIsAborting(true);
    try {
      const result = await onAbortAction();
      if (result.success) {
        await logoutUnverifed();
        localStorage.removeItem(`otp_expiry_${initialPhone}`);

        toast.info(t("registrationSessionCleared"));
        setShowAbortModal(false);
        router.push(
          `/user/player/register?prefill=${encodeURIComponent(initialPhone)}`,
        );
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Unexpected client-side hook failure:", err);
      toast.error(t("secureResetError"));
    } finally {
      setIsAborting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="space-y-1 text-center">
        <span className="text-xs font-semibold tracking-wider text-green-600 uppercase">
          {t("matchmaking.pass")}
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {hasSentCode ? t("enterVerificationCode") : t("verifyPhoneNumber")}
        </h1>
        <p className="text-sm text-slate-500">
          {hasSentCode ? (
            <>
              {t.rich("codeSentToPhone", {
                phone: initialPhone,
                strong: (chunks) => (
                  <span className="font-semibold text-slate-800">{chunks}</span>
                ),
              })}
            </>
          ) : (
            <>
              {t.rich("clickToSendCodeToPhone", {
                phone: initialPhone,
                strong: (chunks) => (
                  <span className="font-semibold text-slate-800">{chunks}</span>
                ),
              })}
            </>
          )}
        </p>
      </div>

      {/* --- STEP CARD --- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-6">
        <form onSubmit={handleVerifySubmit} className="space-y-5">
          <FieldGroup className="flex flex-col items-center justify-center space-y-3">
            <div className="flex justify-between items-center w-full px-0.5">
              <FieldLabel className="text-xs font-medium text-slate-700">
                {t("activation.pin")}
              </FieldLabel>

              {otpTimeLeft !== null && (
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  {t("expiresInTime", { time: formatTime(otpTimeLeft) })}
                </span>
              )}
            </div>

            {/* 6-Digit Inputs */}
            <div className="flex gap-2 sm:gap-3 justify-center items-center w-full">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  disabled={
                    isPending ||
                    isAborting ||
                    isResending ||
                    isSendingInitial ||
                    !hasSentCode
                  }
                  ref={(el) => {
                    if (el) inputRefs.current[idx] = el;
                  }}
                  onChange={(e) => handleOtpChange(e.target, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  className="w-11 h-12 sm:w-12 sm:h-12 text-center text-xl font-bold rounded-xl border border-slate-200 focus:border-green-500 bg-slate-50/50 focus:bg-white text-slate-900 transition-all outline-none disabled:opacity-40"
                />
              ))}
            </div>
          </FieldGroup>

          {/* Form Trigger */}
          <div>
            {!hasSentCode ? (
              <Button
                type="button"
                onClick={handleInitialSendOtp}
                disabled={isSendingInitial || isAborting}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] border-none text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSendingInitial
                  ? t("sendingCode")
                  : t("sendVerificationCode")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  isPending || isAborting || isResending || otp.includes("")
                }
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none border-none text-white text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isPending ? t("verifying") : t("verifyContinue")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>

        {/* --- DYNAMIC UTILITIES --- */}
        <div className="border-t border-slate-100 pt-4 space-y-3 text-center">
          <div>
            {resendCooldown > 0 ? (
              <p className="text-xs text-slate-400">
                {t("resendCodeIn")}{" "}
                <span className="text-slate-700 font-semibold">
                  {resendCooldown}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                disabled={
                  isPending || isAborting || isResending || !hasSentCode
                }
                onClick={handleResendOtp}
                className="text-xs font-semibold text-green-600 hover:text-green-700 disabled:opacity-40 transition-colors cursor-pointer bg-transparent border-none inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                {isResending ? t("resendingCode") : t("resend.code")}
              </button>
            )}
          </div>

          <div>
            <button
              type="button"
              disabled={
                isPending || isAborting || isResending || isSendingInitial
              }
              onClick={() => setShowAbortModal(true)}
              className="text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors cursor-pointer bg-transparent border-none disabled:opacity-30 inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              {t("wrongNumberStartOver")}
            </button>
          </div>
        </div>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {showAbortModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {t("startOverRegistration")}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                {t("this.will.clear.your.temporary.progress.and.allow.you.to.ent")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                disabled={isAborting}
                onClick={() => setShowAbortModal(false)}
                className="h-10 bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                {common("cancel")}
              </button>

              <button
                type="button"
                disabled={isAborting}
                onClick={handleAbortSession}
                className="h-10 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                {isAborting ? t("resetting") : t("yesStartOver")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerVerifyForm;
