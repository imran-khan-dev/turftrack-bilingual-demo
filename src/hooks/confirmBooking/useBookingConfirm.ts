/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { bookPayLater } from "@/services/booking/bookPayLater";
import { initiatePayment } from "@/services/payment/initiatePayment";
import { useTranslations } from "next-intl";

interface UseBookingConfirmProps {
    cartId: string | null;
    businessSlug: string;
}

type PaymentMode = "FULL" | "TIER" | "LATER";

export const useBookingConfirm = ({
    cartId,
    businessSlug,
}: UseBookingConfirmProps) => {
    const t = useTranslations("booking");
    const router = useRouter();

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmError, setConfirmError] = useState<string | null>(null);

    const confirmBooking = useCallback(
        async ({
            paymentMode,
            amountToPayNow,
            timeLeft,
        }: {
            paymentMode: PaymentMode;
            amountToPayNow: number;
            timeLeft: number;
        }) => {
            if (!cartId) return;

            if (timeLeft <= 0) {
                throw new Error(t("sessionExpired"));
            }

            try {
                setConfirmLoading(true);
                setConfirmError(null);

                // ---------------- PAY LATER ----------------
                if (paymentMode === "LATER") {

                    const result = await bookPayLater(cartId);

                    if (result.success === false) {
                        throw new Error(
                            result.error || t("payLaterFailed")
                        );
                    }

                    router.push(
                        `/book/${businessSlug}/result/success?mode=later&cartId=${cartId}`
                    );

                    return;
                }

                const result = await initiatePayment({
                    cartId,
                    chosenAmount: Number(amountToPayNow),
                })

                if (!result.success) {
                    throw new Error(
                        result.data?.message || t("paymentInitiationFailed")
                    );
                }

                // redirect to SSLCommerz
                if (result.data?.paymentUrl) {
                    window.location.href = result.data.paymentUrl;
                }
            } catch (error: any) {
                console.error("Booking Execution Error:", error);

                setConfirmError(
                    error?.message ||
                    t("confirmationUnexpectedError")
                );

                throw error;
            } finally {
                setConfirmLoading(false);
            }
        },
        [cartId, businessSlug, router, t]
    );

    return {
        confirmBooking,
        confirmLoading,
        confirmError,
    };
};
