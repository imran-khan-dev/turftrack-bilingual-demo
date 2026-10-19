import { DiscountSource } from "@/types/discount";

export const getDiscountSourceLabel = (source?: DiscountSource) => {
    if (!source) return "discountSource.specialRate";

    switch (source) {
        case "HIGHEST_ONLY = PROMO":
        case "PROMO_ONLY":
            return "discountSource.promoOffer";
        case "HIGHEST_ONLY = USER":
        case "USER_ALWAYS_APPLY":
            return "discountSource.loyaltyDiscount";
        case "HIGHEST_ONLY = BUSINESS":
        case "BUSINESS_FIRST":
            return "discountSource.venuePromotion";
        case "HIGHEST_ONLY = FIELD":
        case "FIELD_FIRST":
            return "discountSource.fieldDiscount";
        default:
            return "discountSource.specialOfferApplied";
    }
};
