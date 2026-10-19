/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { bookingCheckoutCalculate } from "@/services/booking/bookingCheckoutCalculate";
import { CheckoutData } from "@/types/checkout";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface UseCheckoutProps {
    cartId?: string | null;
    oneBookingId?: string | null;
    businessId?: string;
    backendUrl?: string;
    initialData?: any;
}

// Reusable baseline fallback definition
const defaultPartialPaymentTier = {
    fullPaymentAvailable: true,
    tiers: [],
};

export const useCheckout = ({
    cartId,
    oneBookingId,
    businessId,
    backendUrl,
    initialData,
}: UseCheckoutProps) => {
    const t = useTranslations("booking");
    const [data, setData] = useState<CheckoutData>({
        cartId: cartId || null,
        sumUpTotalAmount: initialData?.sumUpTotalAmount || 0,
        finalDiscount: initialData?.finalDiscount || 0,
        payableAmount: initialData?.payableAmount || 0,
        totalPlatFormFee: initialData?.totalPlatFormFee || 0,
        refundAmount: initialData?.refundAmount || 0,
        createdAt: initialData?.createdAt || "",
        expiresAt: initialData?.expiresAt || "",
        serverNow: initialData?.serverNow || "",
        // FIX: Match the initial object structural shape
        partialPaymentTier: initialData?.partialPaymentTier || defaultPartialPaymentTier,
        slotPricingDetails: initialData?.slotPricingDetails || [],
        discountMeta: initialData?.discountMeta || undefined,
    });
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [checkoutError, setCheckoutError] = useState<string | null>(null);

    const [promoMessage, setPromoMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // FETCH CHECKOUT
    const fetchCheckoutData = useCallback(
        async (codeToApply?: string, initial = false) => {
            if (!backendUrl || (!cartId && !oneBookingId)) return;

            try {
                if (initial) {
                    setPageLoading(true);
                } else {
                    setCheckoutLoading(true);
                }

                setCheckoutError(null);

                // const payload = cartId
                //     ? {
                //         cartId,
                //         promoCode: codeToApply || undefined,
                //     }
                //     : {
                //         promoCode: codeToApply || undefined,
                //         newBookingId: oneBookingId || undefined,
                //     };

                // const response = await fetch(
                //     `${backendUrl}/booking/calculate-checkout`,
                //     {
                //         method: "POST",
                //         credentials: "include",
                //         headers: {
                //             "Content-Type": "application/json",
                //         },
                //         body: JSON.stringify(payload),
                //     }
                // );

                const result = await bookingCheckoutCalculate({
                    cartId: cartId || undefined,
                    newBookingId: oneBookingId || undefined,
                    promoCode: codeToApply || undefined,
                });


                // promo-specific errors only
                if (!result.success) {

                    if (codeToApply) {
                        const code = result.data.raw?.code;

                        if (
                            code === "PROMO_NOT_ACTIVE" ||
                            code === "PROMO_EXPIRED" ||
                            code === "PROMO_NOT_FOUND"
                        ) {
                            setPromoMessage({
                                type: "error",
                                text: result.message,
                            });
                            return;
                        }
                    }

                    setCheckoutError(
                        process.env.NODE_ENV === "production"
                            ? t("failedCalculatePricing")
                            : result.message || t("checkoutInputInvalid")
                    );

                    return;
                }

                // business validation
                const responseBusinessId =
                    result?.data?.slotPricingDetails?.[0]?.businessId;

                if (
                    businessId &&
                    responseBusinessId &&
                    businessId !== responseBusinessId
                ) {
                    setCheckoutError(t("businessValidationFailed"));
                    return;
                }

                // update checkout state
                if (result.data) {
                    setData({
                        cartId: result.data.cartId || cartId,
                        sumUpTotalAmount: result.data.sumUpTotalAmount ?? 0,
                        finalDiscount: result.data.finalDiscount ?? 0,
                        payableAmount: result.data.payableAmount ?? 0,
                        totalPlatFormFee: result.data.totalPlatFormFee ?? 0,
                        refundAmount: result.data.refundAmount ?? 0,
                        createdAt: result.data.createdAt,
                        expiresAt: result.data.expiresAt,
                        serverNow: result.data.serverNow,
                        // FIX: Safely parse object payload values instead of assuming a top-level array
                        partialPaymentTier: result.data.partialPaymentTier
                            ? {
                                fullPaymentAvailable: !!result.data.partialPaymentTier.fullPaymentAvailable,
                                tiers: Array.isArray(result.data.partialPaymentTier.tiers)
                                    ? result.data.partialPaymentTier.tiers
                                    : [],
                            }
                            : defaultPartialPaymentTier,
                        slotPricingDetails: Array.isArray(
                            result.data.slotPricingDetails
                        )
                            ? result.data.slotPricingDetails
                            : [],
                        discountMeta: result.data.discountMeta || undefined,
                    });

                    if (codeToApply && result.data.finalDiscount > 0) {
                        setPromoMessage({
                            type: "success",
                            text: t("promoAppliedSaved", { amount: result.data.finalDiscount }),
                        });
                    }
                }
            } catch (error: any) {
                console.error("Checkout Sync Pipeline Error:", error);

                setCheckoutError(
                    error?.message ||
                    t("pricingUpdateError")
                );
            } finally {
                setCheckoutLoading(false);
                setPageLoading(false);
            }
        },
        [cartId, oneBookingId, businessId, backendUrl, t]
    );

    // initial fetch
    useEffect(() => {
        fetchCheckoutData(undefined, true);
    }, [fetchCheckoutData]);

    // promo cleanup
    useEffect(() => {
        if (!promoMessage) return;

        const timer = setTimeout(() => {
            setPromoMessage(null);
        }, 4000);

        return () => clearTimeout(timer);
    }, [promoMessage]);

    // promo apply
    const applyPromo = useCallback(
        (promoCode: string) => {
            if (!promoCode.trim()) {
                setPromoMessage({
                    type: "error",
                    text: t("enterValidPromo"),
                });
                return;
            }

            fetchCheckoutData(promoCode.toUpperCase());
        },
        [fetchCheckoutData, t]
    );

    return {
        data,
        setData,
        checkoutLoading,
        pageLoading,
        checkoutError,
        promoMessage,
        fetchCheckoutData,
        applyPromo,
    };
};
