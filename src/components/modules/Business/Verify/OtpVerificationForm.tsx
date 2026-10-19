"use client";

import { useRef } from "react";
import { Button } from "../../../ui/button";

interface OtpVerificationFormProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  isEditing: boolean;
  isVerifying: boolean;
  expirationTime: number;
  resendCooldown: number;
  isLastStep: boolean;
  onVerifyOtp: (otpCode: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
}

export default function OtpVerificationForm({
  otp,
  setOtp,
  isEditing,
  isVerifying,
  expirationTime,
  resendCooldown,
  isLastStep,
  onVerifyOtp,
  onResendOtp,
}: OtpVerificationFormProps) {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const formatExpirationTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.substring(value.length - 1);
    setOtp(updatedOtp);

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      const updatedOtp = [...otp];
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        updatedOtp[index - 1] = "";
        setOtp(updatedOtp);
        inputRefs.current[index - 1].focus();
      } else {
        updatedOtp[index] = "";
        setOtp(updatedOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .substring(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(""));
      if (inputRefs.current[5]) inputRefs.current[5].focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifyOtp(otp.join(""));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 animate-in fade-in duration-200"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 block">
            Verification Code
          </label>
          {expirationTime > 0 ? (
            <span className="text-xs font-bold text-amber-600">
              Expires in: {formatExpirationTime(expirationTime)}
            </span>
          ) : (
            <span className="text-xs font-black text-rose-500 uppercase tracking-wider">
              Code Expired
            </span>
          )}
        </div>

        <div className="flex justify-between items-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              disabled={isEditing || expirationTime <= 0}
              maxLength={1}
              pattern="[0-9]*"
              inputMode="numeric"
              value={digit}
              ref={(el) => {
                if (el) inputRefs.current[idx] = el;
              }}
              onChange={(e) => handleOtpChange(e.target, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className="w-full h-16 border-2 rounded-2xl text-center text-2xl font-black text-slate-900 focus:border-green-500 focus:bg-white focus:shadow-lg focus:shadow-green-500/10 outline-none transition-all border-slate-200 bg-white disabled:bg-slate-50 disabled:opacity-40"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          disabled={
            isVerifying ||
            isEditing ||
            otp.join("").length !== 6 ||
            expirationTime <= 0
          }
          className="w-full h-14 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none border-none text-white text-sm font-bold uppercase tracking-wider rounded-2xl shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center"
        >
          {isVerifying
            ? "Checking Code..."
            : isLastStep
              ? "Submit & Finish"
              : "Verify & Continue"}
        </Button>

        <div className="text-center">
          {resendCooldown > 0 ? (
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Resend code in{" "}
              <span className="text-slate-700">{resendCooldown}s</span>
            </p>
          ) : (
            <button
              type="button"
              disabled={isEditing}
              onClick={onResendOtp}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-green-600 hover:text-green-500 cursor-pointer bg-transparent border-none disabled:opacity-30 outline-none"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
