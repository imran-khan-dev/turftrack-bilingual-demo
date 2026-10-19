"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import getSpecialPricingsByField from "@/services/specialPricing/getSpecialPricingsByField";
import addSpecialPricing from "@/services/specialPricing/addSpecialPricing";
import updateSpecialPricing from "@/services/specialPricing/updateSpecialPricing";
import deleteSpecialPricing from "@/services/specialPricing/deleteSpecialPricing";
import { SpecialPricing, SpecialPricingInput } from "@/types/specialPricing";
import { useTranslations } from "next-intl";

interface UseSpecialPricingsResult {
    items: SpecialPricing[];
    isLoading: boolean;
    isSaving: boolean;
    deletingId: string | null;
    refresh: () => Promise<void>;
    addItem: (data: SpecialPricingInput) => Promise<boolean>;
    updateItem: (id: string, data: SpecialPricingInput) => Promise<boolean>;
    removeItem: (id: string) => Promise<void>;
}

export function useSpecialPricings(
    fieldId: string | null,
): UseSpecialPricingsResult {
    const t = useTranslations("errors.specialPricing");
    const [loadedItems, setLoadedItems] = useState<SpecialPricing[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const items = fieldId ? loadedItems : [];
    const setItems = (updater: (prev: SpecialPricing[]) => SpecialPricing[]) => {
        setLoadedItems(updater);
    };

    const refresh = useCallback(async () => {
        if (!fieldId) return;
        setIsLoading(true);
        const data = await getSpecialPricingsByField(fieldId);
        if (data === null) {
            toast.error(t("loadFailed"));
            setLoadedItems([]);
        } else {
            setLoadedItems(data);
        }
        setIsLoading(false);
    }, [fieldId, t]);

    useEffect(() => {
        if (!fieldId) {
            return;
        }

        let isMounted = true;

        const loadSpecialPricings = async () => {
            setIsLoading(true);
            const data = await getSpecialPricingsByField(fieldId);

            if (!isMounted) {
                return;
            }

            if (data === null) {
                toast.error(t("loadFailed"));
                setLoadedItems([]);
            } else {
                setLoadedItems(data);
            }

            setIsLoading(false);
        };

        loadSpecialPricings();

        return () => {
            isMounted = false;
        };
    }, [fieldId, t]);

    const addItem = useCallback(
        async (data: SpecialPricingInput) => {
            if (!fieldId) return false;
            setIsSaving(true);

            const created = await addSpecialPricing(fieldId, data);
            setIsSaving(false);

            if (!created) {
                toast.error(t("addFailed"));
                return false;
            }

            setItems((prev) => [...prev, created]);
            toast.success(t("added"));
            return true;
        },
        [fieldId, t],
    );

    const updateItem = useCallback(async (id: string, data: SpecialPricingInput) => {
        setIsSaving(true);
        const updated = await updateSpecialPricing(id, data);
        setIsSaving(false);

        if (!updated) {
            toast.error(t("updateFailed"));
            return false;
        }

        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        toast.success(t("updated"));
        return true;
    }, [t]);

    const removeItem = useCallback(async (id: string) => {
        setDeletingId(id);
        const success = await deleteSpecialPricing(id);
        setDeletingId(null);

        if (!success) {
            toast.error(t("deleteFailed"));
            return;
        }

        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success(t("deleted"));
    }, [t]);

    return {
        items,
        isLoading,
        isSaving,
        deletingId,
        refresh,
        addItem,
        updateItem,
        removeItem,
    };
}
