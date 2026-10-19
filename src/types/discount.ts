/* eslint-disable @typescript-eslint/no-explicit-any */

export type DiscountSource =
    | "HIGHEST_ONLY = PROMO"
    | "PROMO_ONLY"
    | "HIGHEST_ONLY = USER"
    | "USER_ALWAYS_APPLY"
    | "HIGHEST_ONLY = BUSINESS"
    | "BUSINESS_FIRST"
    | "HIGHEST_ONLY = FIELD"
    | "FIELD_FIRST";


export interface DiscountMeta {
    source?: DiscountSource;
    type?: "PERCENT" | "FLAT";
    discountValue?: number;
    discount: any;
}