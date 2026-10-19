/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { verifyOtpAction } from "@/services/auth/verifyOtpAction";
import { getUserInfo } from "@/services/auth/getUserFromToken";
import { cn } from "@/lib/utils";
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  RotateCcw,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { updatePassword } from "@/services/auth/changePassword";
import { useTranslations } from "next-intl";

const OTP_DURATION_SECONDS = 5 * 60; // 5 minutes

type Step = "form" | "otp";

const ChangePasswordSection = () => {
  const t = useTranslations("auth");
  const [step, setStep] = useState<Step>("form");
  const [isPending, startTransition] = useTransition();
  const [isVerifying, startVerifyTransition] = useTransition();

  const [phone, setPhone] = useState<string>("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(OTP_DURATION_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  const sameAsOldPassword =
    !!oldPassword && !!newPassword && oldPassword === newPassword;

  // Load user's registered phone for the OTP context / display
  useEffect(() => {
    (async () => {
      const res = await getUserInfo();
      const user =
        res.status !== "error" && res.status !== "unauthenticated"
          ? res.user
          : null;

      setPhone(user?.phone || "");
    })();
  }, []);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    setSecondsLeft(OTP_DURATION_SECONDS);
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
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleExpired = () => {
    toast.error(t("changePasswordOtpExpired"));
    setStep("form");
    setOtp("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmitPasswords = (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error(t("fillBothPasswordFields"));
      return;
    }

    if (sameAsOldPassword) {
      toast.error(t("newPasswordDifferent"));
      return;
    }

    if (passwordMismatch) {
      toast.error(t("passwordsMismatch"));
      return;
    }

    startTransition(async () => {
      const res = await updatePassword({ oldPassword, newPassword });

      if (res.success) {
        toast.success(res.message || t("otpSentToRegisteredPhone"));
        setStep("otp");
        startTimer();
      } else {
        toast.error(res.message || t("passwordChangeFailed"));
      }
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      toast.error(t("enterOtpSentToPhone"));
      return;
    }

    startVerifyTransition(async () => {
      const res = await verifyOtpAction({
        purpose: "PASSWORD_RESET",
        code: otp,
      });

      if (res?.success) {
        toast.success(
          res.data?.data?.data?.message || t("passwordChangedSuccessfully"),
        );
        clearTimer();
        resetToForm();
      } else {
        toast.error(
          res?.error || res?.data?.message || t("invalidOtpRetry"),
        );
      }
    });
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info / security panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 h-fit space-y-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <Lock className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {t("accountSecurity")}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {t("passwordChangeSecurityDescription")}
            </p>
          </div>

          <ul className="space-y-2.5 pt-2 border-t border-slate-100">
            <li className="flex items-start gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
              {t("use.at.least.6.characters")}
            </li>
            <li className="flex items-start gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
              {t("avoidPasswordReuse")}
            </li>
            <li className="flex items-start gap-2 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
              {t("otp.is.valid.for.5.minutes")}
            </li>
          </ul>
        </div>

        {/* Form panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {t("changePassword")}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {step === "form"
                    ? t("updateAccountPassword")
                    : t("enterCodeSentToPhone")}
                </p>
              </div>
            </div>
          </div>

          {step === "form" ? (
            <form
              onSubmit={handleSubmitPasswords}
              className="px-6 py-5 space-y-4"
            >
              <Field className="space-y-1.5">
                <FieldLabel
                  htmlFor="oldPassword"
                  className="text-xs font-semibold text-slate-600"
                >
                  {t("currentPassword")}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOld ? "text" : "password"}
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((p) => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showOld ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>

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
                      className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500 pr-10"
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
                      className="h-10 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500 pr-10"
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

              {sameAsOldPassword && (
                <div className="flex items-center gap-1.5 -mt-1 text-xs font-medium text-rose-600">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  {t("newPasswordDifferent")}
                </div>
              )}

              {passwordMismatch && (
                <div className="flex items-center gap-1.5 -mt-1 text-xs font-medium text-rose-600">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  {t("passwords.do.not.match")}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-10 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 transition-colors px-5"
                >
                  {isPending ? t("sendingOtp") : t("changePassword")}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {t("code.sent.to")} {" "}
                  <span className="font-semibold text-slate-600">
                    {phone
                      ? `${phone.slice(0, 4)}••••${phone.slice(-2)}`
                      : t("phoneValue")}
                  </span>
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
                  {t("verification.code")}
                </FieldLabel>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  placeholder={t("otpPlaceholder")}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="h-11 rounded-xl border-slate-200 focus:ring-1 focus:ring-green-500 text-center tracking-[0.3em] font-bold text-base"
                />
              </Field>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetToForm}
                  disabled={isVerifying}
                  className="h-10 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t("start.over")}
                </Button>
                <Button
                  type="submit"
                  disabled={isVerifying || secondsLeft === 0}
                  className="flex-1 h-10 rounded-xl bg-slate-900 font-semibold text-white hover:bg-slate-800 transition-colors gap-1.5"
                >
                  {isVerifying ? (
                    t("verifying")
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      {t("verifyAndChangePassword")}
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

export default ChangePasswordSection;
