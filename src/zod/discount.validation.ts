import { z } from "zod";

const promoCodeBaseSchema = z.object({
    businessId: z
        .string({ error: "Business is required" })
        .uuid({ error: "Invalid business selected" }),

    fieldId: z
        .string({ error: "Field is required" })
        .uuid({ error: "Invalid field selected" }),

    discountType: z.enum(["FLAT", "PERCENT"], {
        error: (issue) =>
            issue.input === undefined
                ? "Discount type is required"
                : "Discount type must be FLAT or PERCENT",
    }),

    discountValue: z.coerce
        .number({ error: "Discount value must be a number" })
        .positive({ error: "Discount value must be greater than 0" }),

    validFrom: z
        .string({ error: "Valid-from date is required" })
        .datetime({ error: "Valid-from must be a valid ISO date" }),

    validUntil: z
        .string({ error: "Valid-until date is required" })
        .datetime({ error: "Valid-until must be a valid ISO date" }),

    maxUsage: z.coerce
        .number({ error: "Max usage must be a number" })
        .int({ error: "Max usage must be a whole number" })
        .positive({ error: "Max usage must be greater than 0" }),

    maxUsagePerUser: z.coerce
        .number({ error: "Max usage per user must be a number" })
        .int({ error: "Max usage per user must be a whole number" })
        .positive({ error: "Max usage per user must be greater than 0" }),
});

export const promoCodeValidationZodSchema = promoCodeBaseSchema

    .refine(
        (data) =>
            data.discountType !== "PERCENT" ||
            (data.discountValue > 0 && data.discountValue <= 100),
        {
            error: "Percent discount must be between 1 and 100",
            path: ["discountValue"],
        },
    )

    .refine(
        (data) =>
            new Date(data.validUntil).getTime() > new Date(data.validFrom).getTime(),
        {
            error: "Valid-until date must be after valid-from date",
            path: ["validUntil"],
        },
    )

    .refine((data) => data.maxUsagePerUser <= data.maxUsage, {
        error: "Max usage per user cannot exceed max usage",
        path: ["maxUsagePerUser"],
    });

export type PromoCodeValidationInput = z.infer<typeof promoCodeBaseSchema>;

const updatePromoBaseSchema = z.object({
    discountType: z
        .enum(["FLAT", "PERCENT"], {
            error: "Discount type must be FLAT or PERCENT",
        })
        .optional(),

    discountValue: z.coerce
        .number({ error: "Discount value must be a number" })
        .positive({ error: "Discount value must be greater than 0" })
        .optional(),

    validFrom: z
        .string({ error: "Valid-from must be a valid ISO date" })
        .datetime({ error: "Valid-from must be a valid ISO date" })
        .optional(),

    validUntil: z
        .string({ error: "Valid-until must be a valid ISO date" })
        .datetime({ error: "Valid-until must be a valid ISO date" })
        .optional(),

    maxUsage: z.coerce
        .number({ error: "Max usage must be a number" })
        .int({ error: "Max usage must be a whole number" })
        .positive({ error: "Max usage must be greater than 0" })
        .optional(),

    maxUsagePerUser: z.coerce
        .number({ error: "Max usage per user must be a number" })
        .int({ error: "Max usage per user must be a whole number" })
        .positive({ error: "Max usage per user must be greater than 0" })
        .optional(),
});

export const updatePromoValidationZodSchema = updatePromoBaseSchema

    .refine(
        (data) =>
            data.discountType !== "PERCENT" ||
            data.discountValue === undefined ||
            (data.discountValue > 0 && data.discountValue <= 100),
        {
            error: "Percent discount must be between 1 and 100",
            path: ["discountValue"],
        },
    )

    .refine(
        (data) =>
            !data.validFrom ||
            !data.validUntil ||
            new Date(data.validUntil).getTime() > new Date(data.validFrom).getTime(),
        {
            error: "Valid-until date must be after valid-from date",
            path: ["validUntil"],
        },
    )

    .refine(
        (data) =>
            data.maxUsagePerUser === undefined ||
            data.maxUsage === undefined ||
            data.maxUsagePerUser <= data.maxUsage,
        {
            error: "Max usage per user cannot exceed max usage",
            path: ["maxUsagePerUser"],
        },
    )

    .refine((data) => Object.keys(data).length > 0, {
        error: "Provide at least one field to update",
    });

export type UpdatePromoValidationInput = z.infer<typeof updatePromoBaseSchema>;