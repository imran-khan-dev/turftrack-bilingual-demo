/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import VerificationQueueList from "./VerificationQueueList";
import ActiveNumberController from "./ActiveNumberController";
import OtpVerificationForm from "./OtpVerificationForm";
import { sendOtp } from "@/services/auth/sendOtp";
import { verifyOtpAction } from "@/services/auth/verifyOtpAction";
import { updatePendingPhone } from "@/services/auth/updatePendingPhone";
import { useTranslations } from "next-intl";

interface VerifyBusinessFormProps {
  businessId: string;
  initialOwnerPhone: string;
  initialBusinessPhone: string;
  initialBkashPhone: string;
  isPhoneVerified: boolean;
  isContactVerified: boolean;
  isBkashVerified: boolean;
}

const getFriendlyModeLabel = (mode: string, t: (key: string) => string) => {
  switch (mode) {
    case "USER_VERIFICATION":
      return t("accountNumber");
    case "BUSINESS_VERIFICATION":
      return t("customerHotline");
    case "BKASH_VERIFICATION":
      return t("payoutNumber");
    default:
      return t("phoneNumber");
  }
};

export default function VerifyBusinessForm({
  businessId,
  initialOwnerPhone,
  initialBusinessPhone,
  initialBkashPhone,
  isPhoneVerified,
  isContactVerified,
  isBkashVerified,
}: VerifyBusinessFormProps) {
  const router = useRouter();
  const t = useTranslations("errors.businessVerification");

  const [phones, setPhones] = useState({
    owner: initialOwnerPhone,
    business: initialBusinessPhone,
    bkash: initialBkashPhone,
  });

  const [verificationStatuses, setVerificationStatuses] = useState({
    ownerVerified: isPhoneVerified,
    businessVerified: isContactVerified,
    bkashVerified: isBkashVerified,
  });

  // Dynamic Queue Calculations
  const dynamicQueue = useMemo(() => {
    const base = [
      {
        mode: "USER_VERIFICATION" as const,
        number: phones.owner,
        label: "Your Account",
        key: "owner" as const,
        isVerified: verificationStatuses.ownerVerified,
      },
      {
        mode: "BUSINESS_VERIFICATION" as const,
        number: phones.business,
        label: "Customer Hotline",
        key: "business" as const,
        isVerified: verificationStatuses.businessVerified,
      },
      {
        mode: "BKASH_VERIFICATION" as const,
        number: phones.bkash,
        label: "bKash Payout Number",
        key: "bkash" as const,
        isVerified: verificationStatuses.bkashVerified,
      },
    ].filter((item) => Boolean(item.number));

    return base.filter(
      (item) =>
        !(item.mode === "BKASH_VERIFICATION" && item.number === phones.owner),
    );
  }, [phones, verificationStatuses]);

  const isAllVerified = useMemo(
    () => dynamicQueue.every((step) => step.isVerified),
    [dynamicQueue],
  );

  const [currentMode, setCurrentMode] = useState<
    "USER_VERIFICATION" | "BUSINESS_VERIFICATION" | "BKASH_VERIFICATION"
  >(() => {
    const firstPending = dynamicQueue.find((step) => !step.isVerified);
    return firstPending ? firstPending.mode : "USER_VERIFICATION";
  });

  const currentStep = useMemo(() => {
    return (
      dynamicQueue.find((step) => step.mode === currentMode) ||
      dynamicQueue[0] || {
        mode: "USER_VERIFICATION",
        number: "",
        label: "",
        key: "owner",
      }
    );
  }, [dynamicQueue, currentMode]);

  const activeNumber = currentStep.number;
  const currentQueueIndex = dynamicQueue.findIndex(
    (step) => step.mode === currentMode,
  );

  // OTP Processing State parameters
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expirationTime, setExpirationTime] = useState(300);
  const [isEditing, setIsEditing] = useState(false);

  // Sync Global Redirection Hooks
  useEffect(() => {
    if (isAllVerified) {
      toast.success(t("allNumbersRedirecting"));
      router.refresh();
      const timer = setTimeout(() => router.push("/owner/dashboard"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAllVerified, router, t]);

  // Handle Internal Local Storage Session Expiry Management
  useEffect(() => {
    setIsEditing(false);
    if (!activeNumber) {
      setIsOtpSent(false);
      setResendCooldown(0);
      setExpirationTime(300);
      setOtp(new Array(6).fill(""));
      return;
    }

    const storageKey = `otp_expiry_${String(activeNumber).trim()}`;
    const savedExpiry = localStorage.getItem(storageKey);

    if (savedExpiry) {
      const expiryTimestamp = parseInt(savedExpiry, 10);
      const now = Date.now();
      if (expiryTimestamp > now) {
        setIsOtpSent(true);
        const remainingSeconds = Math.floor((expiryTimestamp - now) / 1000);
        setExpirationTime(remainingSeconds);
        setOtp(new Array(6).fill(""));
        setResendCooldown(
          300 - remainingSeconds < 60 ? 60 - (300 - remainingSeconds) : 0,
        );
      } else {
        localStorage.removeItem(storageKey);
        setIsOtpSent(false);
        setResendCooldown(0);
        setExpirationTime(300);
        setOtp(new Array(6).fill(""));
      }
    } else {
      setIsOtpSent(false);
      setResendCooldown(0);
      setExpirationTime(300);
      setOtp(new Array(6).fill(""));
    }
  }, [activeNumber, currentMode]);

  // Timers
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (!isOtpSent || expirationTime <= 0) return;
    if (expirationTime <= 1 && isOtpSent) {
      setExpirationTime(0);
      setIsOtpSent(false);
      localStorage.removeItem(`otp_expiry_${String(activeNumber).trim()}`);
      toast.error(
        t("codeExpiredSendAgain"),
      );
      return;
    }
    const timer = setTimeout(() => setExpirationTime((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOtpSent, expirationTime, activeNumber, t]);

  // Network Requests
  const handleSendOtp = async () => {
    if (isSendingOtp || !activeNumber || isAllVerified) return;

    try {
      setIsSendingOtp(true);

      const response = await sendOtp({
        purpose: currentMode,
        businessId,
        activeNumber,
      });

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      const serverSecondsLeft = response.data?.secondsRemaining || 300;
      const cleanNumber = String(activeNumber).trim();

      // Preserve persistent client-side tracking state boundaries
      localStorage.setItem(
        `otp_expiry_${cleanNumber}`,
        (Date.now() + serverSecondsLeft * 1000).toString(),
      );

      setIsOtpSent(true);
      setResendCooldown(59);
      setExpirationTime(serverSecondsLeft);
      setOtp(new Array(6).fill(""));

      toast.success(t("codeSentTo", { destination: getFriendlyModeLabel(currentMode, t) }));
    } catch (err) {
      console.error("Critical orchestration failure within OTP flow:", err);
      toast.error(t("networkUnavailable"));
    } finally {
      setIsSendingOtp(false);
    }
  };

  // const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const handleSaveChanges = async (cleanNumber: string) => {
    if (!cleanNumber || cleanNumber.trim().length < 11) {
      toast.error(t("validPhoneRequired"));
      return;
    }
    try {
      // const res = await fetch(`${backendUrl}/auth/update-pending-phones`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     purpose: currentMode,
      //     number: cleanNumber.trim(),
      //   }),
      //   credentials: "include",
      // });

      const res = await updatePendingPhone({
        purpose: currentMode,
        number: cleanNumber.trim(),
      });

      if (res.data.ok) {
        localStorage.removeItem(`otp_expiry_${String(activeNumber).trim()}`);
        setPhones((prev) => ({
          ...prev,
          [currentStep.key]: cleanNumber.trim(),
        }));
        setIsEditing(false);
        setIsOtpSent(false);
        setResendCooldown(0);
        setExpirationTime(300);
        setOtp(new Array(6).fill(""));
        toast.success(t("phoneUpdated"));
      } else {
        const errData = await res.data.json().catch(() => ({}));
        toast.error(errData.message || t("updatePhoneFailed"));
      }
    } catch {
      toast.error(t("networkUnavailable"));
    }
  };

  const handleVerifyOtp = async (verificationCode: string) => {
    if (expirationTime <= 0 || !isOtpSent || isAllVerified) {
      toast.error(t("verificationSessionExpired"));
      return;
    }

    try {
      setIsVerifying(true);
      const startTime = Date.now();

      const response = await verifyOtpAction({
        purpose: currentMode,
        code: verificationCode,
        businessId,
        activeNumber,
      });

      // Enforce a minimum loader duration of 1 second for a smooth UX
      const remainingWait = Math.max(0, 1000 - (Date.now() - startTime));
      await new Promise((resolve) => setTimeout(resolve, remainingWait));

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      // Clean up local tracking storage keys
      localStorage.removeItem(`otp_expiry_${String(activeNumber).trim()}`);

      // Compute and synchronize fresh status flags
      const updatedStatuses = {
        ownerVerified:
          phones.owner === activeNumber
            ? true
            : verificationStatuses.ownerVerified,
        businessVerified:
          phones.business === activeNumber
            ? true
            : verificationStatuses.businessVerified,
        bkashVerified:
          phones.bkash === activeNumber
            ? true
            : verificationStatuses.bkashVerified,
      };
      setVerificationStatuses(updatedStatuses);

      // Filter dynamic cascading wizard step arrays
      const remainingSteps = [
        {
          mode: "USER_VERIFICATION" as const,
          number: phones.owner,
          isVerified: updatedStatuses.ownerVerified,
        },
        {
          mode: "BUSINESS_VERIFICATION" as const,
          number: phones.business,
          isVerified: updatedStatuses.businessVerified,
        },
        {
          mode: "BKASH_VERIFICATION" as const,
          number: phones.bkash,
          isVerified: updatedStatuses.bkashVerified,
        },
      ].filter(
        (item, index, self) =>
          Boolean(item.number) &&
          self.slice(0, index).every((p) => p.number !== item.number),
      );

      const nextPendingStep = remainingSteps.find((step) => !step.isVerified);

      if (nextPendingStep) {
        toast.success(t("numberVerifiedNext"));
        setCurrentMode(nextPendingStep.mode);
      } else {
        toast.success(t("allNumbersVerified"));
      }

      // Tells Next.js to re-fetch Server Components and evaluate updated cookie headers
      router.refresh();
    } catch (err) {
      console.error("Critical error inside OTP parsing pipelines:", err);
      toast.error(t("networkUnavailable"));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl w-full bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
      {/* LEFT PANEL */}
      <div className="md:col-span-5 bg-slate-50 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
        <div className="space-y-8">
          <div>
            <span className="block text-[11px] font-black uppercase tracking-[0.25em] text-green-500 mb-2">
              Business Verification
            </span>
            <h1 className="text-3xl font-black italic uppercase tracking-tight text-slate-900">
              Verify Your Business
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
              Please verify your phone numbers to activate your account and
              secure your business profile.
            </p>
          </div>

          <VerificationQueueList
            dynamicQueue={dynamicQueue}
            currentMode={currentMode}
            isAllVerified={isAllVerified}
          />
        </div>

        <div className="pt-6 border-t border-slate-200 hidden md:block">
          <p className="text-xs font-medium text-slate-400 leading-relaxed">
            We verify each number to ensure your payments, bookings and business
            information remain secure.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-center space-y-8">
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-green-500">
            {isAllVerified
              ? "Verification Complete"
              : `Step ${currentQueueIndex + 1} of ${dynamicQueue.length}`}
          </span>
          <h2 className="text-3xl font-black italic tracking-tight text-slate-900 mt-2">
            {isAllVerified ? "All Set!" : `Verify ${currentStep.label}`}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">
            {isAllVerified
              ? "All your identification numbers are completely authorized and verified."
              : !isOtpSent
              ? "Verify your number to secure this channel parameters."
              : "We have issued your temporary entry token validation code. Check your inbox messages."}
          </p>
        </div>

        <ActiveNumberController
          activeNumber={activeNumber}
          isOtpSent={isOtpSent}
          isSendingOtp={isSendingOtp}
          isAllVerified={isAllVerified}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSendOtp={handleSendOtp}
          onSaveChanges={handleSaveChanges}
        />

        {isOtpSent && !isAllVerified && (
          <OtpVerificationForm
            otp={otp}
            setOtp={setOtp}
            isEditing={isEditing}
            isVerifying={isVerifying}
            expirationTime={expirationTime}
            resendCooldown={resendCooldown}
            isLastStep={currentQueueIndex === dynamicQueue.length - 1}
            onVerifyOtp={handleVerifyOtp}
            onResendOtp={handleSendOtp}
          />
        )}
      </div>
    </div>
  );
}
