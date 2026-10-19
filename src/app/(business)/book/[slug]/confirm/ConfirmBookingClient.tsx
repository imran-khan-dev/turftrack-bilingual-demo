/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { CheckCircle2, AlertCircle, Timer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { IAuthUser } from "@/types/user";
import ConfirmBookingSkeleton from "./BookingConfirmSkeleton";
import { useBookingTimer } from "@/hooks/confirmBooking/useBookingTimer";
import { useBookingCancel } from "@/hooks/confirmBooking/useBookingCancel";
import { useCheckout } from "@/hooks/confirmBooking/useCheckout";
import { useBookingConfirm } from "@/hooks/confirmBooking/useBookingConfirm";
import { getDiscountSourceLabel } from "@/hooks/confirmBooking/useDiscountSourceLabel";
import { CancelBookingModal } from "@/components/modules/Business/ConfirmBooking/CancelBookingModal";
import { MobileCheckoutDock } from "@/components/modules/Business/ConfirmBooking/MobileCheckoutDock";
import { BookingSummarySidebar } from "@/components/modules/Business/ConfirmBooking/BookingSummarySidebar";
import { PromoSection } from "@/components/modules/Business/ConfirmBooking/PromoSection";
import { PaymentSection } from "@/components/modules/Business/ConfirmBooking/PaymentSelector";
import SelectedSlotsSection from "@/components/modules/Business/ConfirmBooking/SelectedSlotsSection";
import { toast } from "sonner";

type BookingUser = Pick<
  IAuthUser,
  | "id"
  | "fullName"
  | "email"
  | "role"
  | "phone"
  | "isActive"
  | "createdAt"
  | "updatedAt"
  | "photo"
  | "playerBusinessAccesses"
> & {
  isSpecial: boolean;
};

interface Props {
  businessInfo: {
    id: string;
    slug: string;
    name: string;
    logo?: string;
    [key: string]: any;
  };
  initialData: any;
  user: BookingUser;
  cartId: string | null;
  oneBookingId: string | null;
  paymentMethod: "bkash" | "ssl" | "ziniPay";
}

export default function ConfirmBookingClient({
  businessInfo,
  initialData,
  user,
  cartId,
  oneBookingId,
  paymentMethod,
}: Props) {
  const allowBackRef = useRef(false);
  const searchParams = useSearchParams();
  const backendUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const from = searchParams.get("from") || "/";

  const {
    data,
    checkoutLoading,
    pageLoading,
    checkoutError,
    promoMessage,
    fetchCheckoutData,
    applyPromo,
  } = useCheckout({
    cartId,
    oneBookingId,
    businessId: businessInfo.id,
    backendUrl,
    initialData,
  });

  const [promoCode, setPromoCode] = useState("");

  const [paymentMode, setPaymentMode] = useState<"FULL" | "TIER" | "LATER">(
    () => {
      const isFullDisabled =
        initialData?.data?.partialPaymentTier?.fullPaymentAvailable === false;
      if (isFullDisabled) {
        return "TIER";
      }
      return "FULL";
    },
  );

  // Adjust payment mode during render if data changes and invalidates current selection
  const isFullDisabled =
    data?.partialPaymentTier &&
    (data.partialPaymentTier as any).fullPaymentAvailable === false;
  if (isFullDisabled && paymentMode === "FULL") {
    setPaymentMode("TIER");
  }

  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [cancelSource, setCancelSource] = useState<"back" | "manual" | null>(
    null,
  );

  // --- MODAL & ACTION STATES ---
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { cancelBooking, cancelLoading } = useBookingCancel({
    cartId: data.cartId,
    backendUrl,
    businessSlug: businessInfo.slug,
    from,
    onBeforeRedirect: () => {
      allowBackRef.current = true;
      setShowCancelModal(false);
    },
  });

  const { confirmBooking, confirmError } = useBookingConfirm({
    cartId: data.cartId,
    businessSlug: businessInfo.slug,
  });

  useEffect(() => {
    // fake entry so browser back doesn't instantly leave
    window.history.pushState({ confirmPage: true }, "", window.location.href);

    const handleBack = () => {
      if (allowBackRef.current) return;

      // browser back triggered modal
      setCancelSource("back");
      setShowCancelModal(true);

      // keep user on confirm page
      window.history.pushState({ confirmPage: true }, "", window.location.href);
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const openCancelModal = () => {
    setCancelSource("manual");
    setShowCancelModal(true);
  };

  const { timeLeft, formattedTime, extensionMessage } = useBookingTimer({
    initialNow: useMemo(() => new Date().getTime(), []),
    expiresAt: data.expiresAt,
    serverNow: data.serverNow,
    cartId: data.cartId,
    businessSlug: businessInfo.slug,
    fromRoute: from,
    onExtensionSuccess: async () => {
      await fetchCheckoutData();
    },
  });

  const handleConfirm = async () => {
    try {
      await confirmBooking({
        paymentMode,
        amountToPayNow,
        timeLeft,
      });
    } catch {
      console.error("booking confirm error", confirmError);
      toast.error(confirmError);
    }
  };

  const handleCancelBooking = async () => {
    await cancelBooking(cancelSource || "manual");
  };

  const amountToPayNow =
    paymentMode === "TIER" && selectedTier
      ? selectedTier
      : paymentMode === "LATER"
      ? 0
      : data.payableAmount;

  const isActionDisabled =
    timeLeft === 0 ||
    checkoutLoading ||
    (paymentMode === "TIER" && !selectedTier);

  if (pageLoading) {
    return <ConfirmBookingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* REUSABLE ABORT TRANSACTION MODAL */}
      {showCancelModal && (
        <CancelBookingModal
          open={showCancelModal}
          cancelLoading={cancelLoading}
          onClose={() => setShowCancelModal(false)}
          onKeepBooking={() => setShowCancelModal(false)}
          onCancelBooking={handleCancelBooking}
        />
      )}

      <main className="container mx-auto px-6 py-12">
        {extensionMessage && (
          <div
            className={`mx-auto mb-8 p-4 rounded-2xl border flex items-center gap-3 text-sm font-semibold ${
              extensionMessage.type === "success"
                ? "bg-green-50 border-green-200 text-green-600"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {extensionMessage.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{extensionMessage.text}</span>
          </div>
        )}

        <div className="lg:hidden fixed top-4 left-1/2 -translate-x-1/2 z-60">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xl border backdrop-blur-md ${
              timeLeft < 60
                ? "bg-red-500/90 border-red-400 text-white animate-pulse"
                : "bg-white/90 border-slate-200 text-slate-900"
            }`}
          >
            <Timer size={14} />
            <span className="text-xs font-bold tabular-nums">
              {formattedTime}
            </span>
          </div>
        </div>

        {checkoutError && (
          <div className="mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-semibold">
            <AlertCircle size={18} />
            <span>{checkoutError}</span>
          </div>
        )}

        <div className="mx-auto grid lg:grid-cols-[1fr_420px] gap-10 mb-16 md:mb-0">
          {/* LEFT SECTION */}
          <div className="space-y-8">
            <SelectedSlotsSection
              slotPricingDetails={data.slotPricingDetails}
              checkoutLoading={checkoutLoading}
            />

            {/* DYNAMIC PROMO CONFIGURATION AND METADATA VISUALIZER */}
            <PromoSection
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              checkoutLoading={checkoutLoading}
              applyPromo={applyPromo}
              promoMessage={promoMessage}
              data={data}
            />

            {/* PAYMENT COMPONENT SELECTOR */}
            <PaymentSection
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              selectedTier={selectedTier}
              setSelectedTier={setSelectedTier}
              user={user}
              data={data}
            />
          </div>

          {/* RIGHT FIXED DESKTOP SIDEBAR */}
          <BookingSummarySidebar
            timeLeft={timeLeft}
            formattedTime={formattedTime}
            totalAmount={data.sumUpTotalAmount}
            finalDiscount={data.finalDiscount}
            amountToPayNow={amountToPayNow}
            paymentMode={paymentMode}
            paymentMethod={paymentMethod}
            checkoutLoading={checkoutLoading}
            isActionDisabled={isActionDisabled}
            onConfirm={handleConfirm}
            onCancel={openCancelModal}
          />
        </div>
      </main>

      {/* MOBILE CHECKOUT DOCK */}
      <MobileCheckoutDock
        checkoutLoading={checkoutLoading}
        amountToPayNow={amountToPayNow}
        timeLeft={timeLeft}
        formattedTime={formattedTime}
        finalDiscount={data.finalDiscount}
        discountSource={data.discountMeta?.source}
        paymentMode={paymentMode}
        isActionDisabled={isActionDisabled}
        onConfirm={handleConfirm}
        onCancel={openCancelModal}
        getDiscountSourceLabel={getDiscountSourceLabel}
      />
    </div>
  );
}
