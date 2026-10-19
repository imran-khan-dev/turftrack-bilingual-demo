"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { validateReLockBooking } from "@/services/booking/validateReLockBooking";
import { cancelPendingBooking } from "@/services/booking/cancelPendingBooking";
import { useTranslations } from "next-intl";

interface UseBookingTimerProps {
    initialNow: number;
    expiresAt?: string;
    serverNow?: string;
    cartId: string | null;
    businessSlug?: string;
    fromRoute: string;
    onExtensionSuccess: () => Promise<void>;
}

export const useBookingTimer = ({
    initialNow,
    expiresAt,
    serverNow,
    cartId,
    businessSlug,
    onExtensionSuccess,
}: UseBookingTimerProps) => {
    const t = useTranslations("booking");
    const router = useRouter();

    const [currentTime, setCurrentTime] = useState(initialNow);
    const [expiredRedirected, setExpiredRedirected] = useState(false);
    const [extensionAttempted, setExtensionAttempted] = useState(false);

    const [extensionMessage, setExtensionMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // --- TIMING ANCHORS (State-based for render safety) ---
    const [baselines, setBaselines] = useState<{
        server: number;
        client: number;
    } | null>(null);

    // Update the baseline anchor keys every time serverNow changes (initial mount + after extensions)
    useEffect(() => {
        if (serverNow) {
            queueMicrotask(() => {
                setBaselines({
                    server: new Date(serverNow).getTime(),
                    client: Date.now(),
                });
            });
        }
    }, [serverNow]);

    // Timer Engine ticker driving the state update re-renders
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Countdown Calculator
    const timeLeft = useMemo(() => {
        if (!expiresAt) return 0;

        const expires = new Date(expiresAt).getTime();

        // If our baseline sync tokens are active, calculate exact elapsed time using state values
        if (baselines) {
            // How long has the user been looking at this specific response frame?
            const elapsedClientMs = currentTime - baselines.client;
            const currentServerTimeEstimation = baselines.server + elapsedClientMs;

            return Math.max(Math.floor((expires - currentServerTimeEstimation) / 1000), 0);
        }

        // Direct fallback before the useEffect hook populates baseline reference keys
        return Math.max(Math.floor((expires - currentTime) / 1000), 0);
    }, [expiresAt, currentTime, baselines]);

    // Extend booking session action
    const handleExtendBookingTime = useCallback(async () => {
        try {
            if (!cartId) return;

            // const response = await fetch(
            //     `${backendUrl}/booking/validate-re-lock/${cartId}`,
            //     {
            //         method: "PATCH",
            //         credentials: "include",
            //     }
            // );

            // const result = await response.json();

            const result = await validateReLockBooking(cartId);

            if (!result.data.success) {
                setExtensionMessage({
                    type: "error",
                    text: result.data.message || t("extendBookingFailedWithPeriod"),
                });
                return;
            }

            setExtensionMessage({
                type: "success",
                text: t("bookingTimeExtended"),
            });

            // Wipe out baseline tracking states so they recalibrate cleanly 
            // when onExtensionSuccess finishes driving your parent fetch operations
            setBaselines(null);

            await onExtensionSuccess();
        } catch (error) {
            console.error("Extension Error:", error);
            setExtensionMessage({
                type: "error",
                text: t("extendBookingFailed"),
            });
        }
    }, [cartId, onExtensionSuccess, t]);

    // Auto extend watchdog at 30s remaining
    useEffect(() => {
        if (timeLeft === 30 && !extensionAttempted) {
            queueMicrotask(() => {
                setExtensionAttempted(true);
                handleExtendBookingTime();
            });
        }
    }, [timeLeft, extensionAttempted, handleExtendBookingTime]);

    // Expiration cleanup session release + redirect tracker
    useEffect(() => {
        if (!expiresAt) return;
        if (timeLeft > 0 || expiredRedirected) return;

        queueMicrotask(() => {
            setExpiredRedirected(true);
        });

        const handleCancellationAndRoute = async () => {
            if (cartId) {
                try {
                    // await fetch(
                    //     `${backendUrl}/booking/${cartId}/cancel-pending`,
                    //     {
                    //         method: "PATCH",
                    //         headers: {
                    //             "Content-Type": "application/json",
                    //         },
                    //         credentials: "include",
                    //         body: JSON.stringify({ cartId }),
                    //     }
                    // );

                    await cancelPendingBooking(cartId);
                } catch (error) {
                    console.error("Auto-cancel failed:", error);
                }
            }

            router.push(
                `/book/${businessSlug}/result/cancel?reason=expired&cartId=${cartId}`
            );
        };

        handleCancellationAndRoute();
    }, [
        timeLeft,
        expiredRedirected,
        expiresAt,
        router,
        businessSlug,
        cartId,
    ]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return {
        timeLeft,
        formattedTime: formatTime(timeLeft),
        extensionMessage,
        setExtensionMessage,
        handleExtendBookingTime,
    };
};
