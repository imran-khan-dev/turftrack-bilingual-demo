/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { cancelPendingBooking } from "@/services/booking/cancelPendingBooking";
import { useTranslations } from "next-intl";

interface UseBookingCancelProps {
    cartId: string | null;
    backendUrl?: string;
    businessSlug: string;
    from: string;
    onBeforeRedirect?: () => void;
}

export const useBookingCancel = ({
    cartId,
    backendUrl,
    businessSlug,
    from,
    onBeforeRedirect,
}: UseBookingCancelProps) => {
    const t = useTranslations("booking");
    const router = useRouter();

    const [cancelLoading, setCancelLoading] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

    const cancelBooking = useCallback(
        async (source: "back" | "manual") => {
            if (!cartId || !backendUrl) return;

            try {
                setCancelLoading(true);
                setCancelError(null);

                // const response = await fetch(
                //     `${backendUrl}/booking/${cartId}/cancel-pending`,
                //     {
                //         method: "PATCH",
                //         headers: {
                //             "Content-Type": "application/json",
                //         },
                //         credentials: "include"
                //     }
                // );

                // const result = await response.json();

                // if (!result.success) {
                //     throw new Error(
                //         result.message || "Failed to release transaction blocks"
                //     );
                // }

                const result = await cancelPendingBooking(cartId);

                if (!result.data.success) {
                    throw new Error(
                        result.data.message || t("releaseTransactionFailed")
                    );
                }

                // preserve your allowBackRef logic
                onBeforeRedirect?.();

                if (source === "back") {
                    router.push(from);
                    return;
                }

                router.push(
                    `/book/${businessSlug}/result/cancel?cartId=${cartId}`
                );
            } catch (error: any) {
                console.error("Cancel booking failed:", error);
                setCancelError(
                    error?.message || t("releaseTransactionFailedCleanly")
                );
            } finally {
                setCancelLoading(false);
            }
        },
        [cartId, backendUrl, businessSlug, from, router, onBeforeRedirect, t]
    );

    return {
        cancelBooking,
        cancelLoading,
        cancelError,
    };
};
