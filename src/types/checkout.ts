/* eslint-disable @typescript-eslint/no-explicit-any */

import { DiscountMeta } from "./discount";

export interface CheckoutData {
    cartId: string | null;
    sumUpTotalAmount: number;
    finalDiscount: number;
    payableAmount: number;
    totalPlatFormFee: number;
    refundAmount: number;
    createdAt: string;
    expiresAt: string;
    serverNow: string;
    partialPaymentTier: {
        fullPaymentAvailable: boolean;
        tiers: number[];
    };
    slotPricingDetails: any[];
    discountMeta?: DiscountMeta;
}