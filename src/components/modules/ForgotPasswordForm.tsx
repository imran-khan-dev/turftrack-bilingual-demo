/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/services/auth/forgotPassword";
import { cn } from "@/lib/utils";
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  RotateCcw,
  ShieldAlert,
  Lock,
  Phone,
} from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { forgotPasswordVerifyOtp } from "@/services/auth/forgotPasswordOtpVerify";
import { useTranslations } from "next-intl";

const DEFAULT_OTP_DURATION = 5 * 60; // 5 minutes default

type Step = "form" | "otp";

const ForgotPasswordSection = () => {
  const t = useTranslations("auth");
  const [step, setStep] = useState<Step>("form");
  const [isPending, startTransition] = useTransition();
  const [isVerifying, startVerifyTransition] = useTransition();

  const [phone, setPhone] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_OTP_DURATION);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = (durationInSeconds?: number) => {
    clearTimer();
    const initialSeconds = durationInSeconds || DEFAULT_OTP_DURATION;
    setSecondsLeft(initialSeconds);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          handleExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const resetToForm = () => {
    clearTimer();
    setStep("form");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleExpired = () => {
    toast.error(t("otpExpiredRequestAgain"));
    resetToForm();
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone) {
      toast.error(t("enterRegisteredPhone"));
      return;
    }

    if (!newPassword) {
      toast.error(t("enterNewPassword"));
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t("use.at.least.6.characters"));
      return;
    }

    if (passwordMismatch) {
      toast.error(t("passwords.do.not.match"));
      return;
    }

    startTransition(async () => {
      const res = await forgotPassword({
        phone,
        newPassword,
      });

      if (res.success) {
        toast.success(
          res.message || t("verificationCodeSentToPhone"),
        );
        setStep("otp");
        startTimer(res.data?.secondsRemaining);
      } else {
        toast.error(res.message || t("passwordResetFailed"));
      }
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      toast.error(t("enterCompleteCode"));
      return;
    }

    startVerifyTransition(async () => {
      // Calls forgotPasswordVerifyOtp passing OTP code and activeNumber (phone)
      const res = await forgotPasswordVerifyOtp({
        code: otp,
        activeNumber: phone,
      });

      if (res.success) {
        toast.success(res.data?.message || t("passwordResetSuccessfully"));
        clearTimer();
        window.location.href = "/login";
      } else {
        toast.error(res.error || t("invalidOtpRetry"));
      }
    });
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Info Panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 h-fit space-y-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <Lock className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {t("account.recovery")}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("reset.your.password.securely.by.verifying.your.registered.ph")}
            </p>
          </div>

          <ul className="space-y-2.5 pt-2 border-t border-slate-100">
            <li className="flex items-start gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
              {t("use.at.least.6.characters")}
            </li>
            <li className="flex items-start gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
              {t("otp.is.valid.for.5.minutes")}
            </li>
          </ul>
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {t("forgot.password.variant1")}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {step === "form"
                  ? t("enterPhoneAndNewPassword")
                  : t("enterCodeSentToPhone")}
                </p>
              </div>
            </div>
          </div>

          {step === "form" ? (
            <form onSubmit={handleSubmitForm} className="px-6 py-5 space-y-4">
              {/* Phone Field */}
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="phone"
                  className="text-xs font-semibold text-slate-600"
                >
                    {t("phoneNumber")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="phone"
                    type="text"
                    placeholder="01871624537"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-emerald-500 pl-9"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </Field>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="space-y-1.5">
                  <FieldLabel
                    htmlFor="newPassword"
                    className="text-xs font-semibold text-slate-600"
                  >
                    {t("new.password")}
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((p) => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </Field>

                <Field className="space-y-1.5">
                  <FieldLabel
                    htmlFor="confirmPassword"
                    className="text-xs font-semibold text-slate-600"
                  >
                    {t("confirm.new.password")}
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </Field>
              </div>

              {passwordMismatch && (
                <div className="flex items-center gap-1.5 -mt-1 text-xs font-medium text-rose-600">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  {t("passwords.do.not.match")}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/login"
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {t("back.to.login")}
                </Link>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-10 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 transition-colors px-5 text-xs"
                >
                  {isPending ? t("sendingOtp") : t("getOtpCode")}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {t.rich("codeSentToMaskedPhone", {
                    phone: phone
                      ? `${phone.slice(0, 4)}••••${phone.slice(-2)}`
                      : t("phoneValue"),
                    strong: (chunks) => (
                      <span className="font-semibold text-slate-600">{chunks}</span>
                    ),
                  })}
                </span>
                <span
                  className={cn(
                    "font-bold tabular-nums",
                    secondsLeft <= 30 ? "text-rose-600" : "text-slate-500",
                  )}
                >
                  {timeLabel}
                </span>
              </div>

              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="otp"
                  className="text-xs font-semibold text-slate-600"
                >
                  Verification Code
                </FieldLabel>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder={t("otpPlaceholder")}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="h-11 rounded-xl border-slate-200 focus:ring-1 focus:ring-emerald-500 text-center tracking-[0.3em] font-bold text-base"
                />
              </Field>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetToForm}
                  disabled={isVerifying}
                  className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 gap-1.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t("start.over")}
                </Button>
                <Button
                  type="submit"
                  disabled={isVerifying || secondsLeft === 0}
                  className="flex-1 h-10 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 transition-colors gap-1.5 text-xs"
                >
                  {isVerifying ? (
                    t("verifying")
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      {t("verify.reset.password")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSection;
