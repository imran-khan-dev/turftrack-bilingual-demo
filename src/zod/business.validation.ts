import { z } from "zod";

const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;


export const businessOnboardingSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is explicitly required"),
    phone: z.string().regex(bdPhoneRegex, {
        message:
            "Valid Bangladeshi phone number is required (e.g. 01712345678 or +8801712345678)",
    }),
    businessName: z
        .string()
        .trim()
        .min(1, "Business / venue name is explicitly required"),
    slug: z
        .string()
        .trim()
        .min(1, "Custom live URL path slug is explicitly required"),
    location: z
        .string()
        .trim()
        .min(1, "Physical venue geographic address is explicitly required"),
    contactNumber: z.string().regex(bdPhoneRegex, {
        message:
            "Valid Bangladeshi phone number is required (e.g. 01712345678 or +8801712345678)",
    }),
    bkashNumber: z.string().regex(bdPhoneRegex, {
        message:
            "Valid Bangladeshi phone number is required (e.g. 01712345678 or +8801712345678)",
    }),
    bkashAccountType: z
        .enum(["PERSONAL", "MERCHANT"], { message: "bKash structural account type destination is required" }),
    bankName: z
        .string()
        .trim()
        .min(1, "Settlement clearance bank corporate entity name is required"),
    branchName: z
        .string()
        .trim()
        .min(1, "Associated settlement branch location name is required"),
    accountName: z
        .string()
        .trim()
        .min(1, "Legal recipient bank account holder title name is required"),
    accountNumber: z
        .string()
        .trim()
        .min(8, "Account number is too short")
        .max(17, "Account number is too long")
        .regex(/^\d+$/, "Account number must contain only digits"),

    businessTerms: z.array(z.object({
        title: z
            .string()
            .trim()
    })).min(1, "At least one business term is required"),

    // --- CONDITIONAL / OPTIONAL ---
    email: z
        .string()
        .trim()
        .or(z.literal(""))
        .transform((val) => (val === "" || val === null || val === undefined ? undefined : val))
        .pipe(z.string().email("Invalid email address formatting").optional()),

    password: z.string().min(1, "Please configure your password"),
    confirmPassword: z.string().min(1, "Please confirm your password configuration"),
    address: z.string().trim().or(z.literal(undefined)),
    businessEmail: z
        .string()
        .trim()
        .or(z.literal(""))
        .transform((val) => (val === "" || val === null || val === undefined ? undefined : val))
        .pipe(z.string().email("Invalid email address formatting").optional()),
    googleMapLink: z.string().trim().url("Invalid navigation map address routing path").or(z.literal(undefined)),
    facebookLink: z.string().trim().url("Invalid facebook link").or(z.literal(undefined)),
    instagramLink: z.string().trim().url("Invalid instagram link").or(z.literal(undefined)),
    whatsappLink: z.string().trim().url("Invalid whatsapp link").or(z.literal(undefined)),

    // --- SYSTEM PREFERENCE PARAMETERS AND DEFAULTS ---
    features: z.array(z.object({
        title: z
            .string()
            .trim()
            .min(1, "At least one feature is required"),
    })).default([]),

    allowPlayerCancel: z.string().default("true"),
    cancelWindowHours: z.coerce.number().int().nonnegative().default(96),
    allowPlayerReschedule: z.string().default("true"),
    rescheduleWindowHours: z.coerce.number().int().nonnegative().default(96),
    rescheduleLimitCount: z.coerce.number().int().nonnegative().default(2),
    // multipleRescheduleCountLimit: z.coerce.number().int().nonnegative().default(1),
    refundAllowed: z.string().default("true"),
    refundPercent: z.coerce.number().min(0).max(100).default(0.0),
    minDepositPercent: z.coerce.number().min(20).max(100).default(20.0),
    maxDepositPercent: z.coerce.number().min(30).max(100).default(30.0),
    maxSlotsPerBooking: z.coerce.number().int().positive().default(10),
    maxBookingsPerDay: z.coerce.number().int().positive().default(3),
    bookingHorizonDays: z.coerce.number().int().positive().default(30),
    discountPriority: z
        .enum(["HIGHEST_ONLY", "PROMO_ONLY", "BUSINESS_FIRST", "FIELD_FIRST", "USER_ALWAYS_APPLY"], {
            message: "Business discount priority is required",
        }).default("HIGHEST_ONLY"),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

export type BusinessOnboardingInput = z.infer<typeof businessOnboardingSchema>;


// Reusable preprocessors for values arriving as strings from FormData
const toNumber = (val: unknown) => (val === undefined || val === "" ? undefined : Number(val));

const toBoolean = (val: unknown) => {
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return undefined;
};

const toJsonArray = (val: unknown) => {
    if (typeof val === "string") {
        try {
            return JSON.parse(val);
        } catch {
            return undefined;
        }
    }
    return val;
};
export const updateBusinessSchema = z
    .object({
        businessName: z
            .string()
            .min(2, "Business name must be at least 2 characters")
            .trim()
            .optional(),

        // slug: z
        //     .string()
        //     .min(2, "Slug is required")
        //     .regex(/^[a-z0-9-]+$/, "Slug must be lowercase and hyphenated")
        //     .optional(),

        location: z
            .string()
            .min(2, "Location is required")
            .trim()
            .optional(),

        businessEmail: z
            .string()
            .email("Invalid email address")
            .optional()
            .or(z.literal("")),

        accountName: z
            .string()
            .min(2, "Account name must be at least 2 characters")
            .optional()
            .or(z.literal("")),

        accountNumber: z
            .string()
            .min(8, "Account number is too short")
            .max(25, "Account number is too long")
            .optional()
            .or(z.literal("")),

        bankName: z
            .string()
            .min(2, "Bank name is required")
            .optional()
            .or(z.literal("")),

        branchName: z
            .string()
            .min(2, "Branch name is required")
            .optional()
            .or(z.literal("")),

        businessTerms: z.preprocess(
            toJsonArray,
            z
                .array(
                    z.object({
                        title: z.string().min(2, "Feature title is required").trim(),
                    })
                )
                .optional()
        ),

        features: z.preprocess(
            toJsonArray,
            z
                .array(
                    z.object({
                        title: z.string().min(2, "Feature title is required").trim(),
                    })
                )
                .optional()
        ),

        cancelWindowHours: z.preprocess(
            toNumber,
            z
                .number()
                .int()
                .min(24, "Cancel window must be at least 24 hours")
                .max(72, "Cancel window must not exceed 72 hours")
                .optional()
        ),

        allowPlayerCancel: z.preprocess(toBoolean, z.boolean().optional()),

        allowPlayerReschedule: z.preprocess(toBoolean, z.boolean().optional()),

        rescheduleWindowHours: z.preprocess(toNumber, z.number().int().optional()),

        refundAllowed: z.preprocess(toBoolean, z.boolean().optional()),

        refundPercent: z.preprocess(toNumber, z.number().min(0).max(100).optional()),

        facebookLink: z.string().url("Invalid URL").optional().or(z.literal("")),
        instagramLink: z.string().url("Invalid URL").optional().or(z.literal("")),
        whatsappLink: z.string().url("Invalid URL").optional().or(z.literal("")),

        aboutDesc: z.string().optional(),
        googleMapLink: z.string().url("Invalid URL").optional().or(z.literal("")),

        minDepositPercent: z.preprocess(toNumber, z.number().min(0).max(100).optional()),
        maxDepositPercent: z.preprocess(toNumber, z.number().min(0).max(100).optional()),
        maxSlotsPerBooking: z.preprocess(toNumber, z.number().min(0).optional()),
        maxBookingsPerDay: z.preprocess(toNumber, z.number().min(0).optional()),

        bookingHorizonDays: z.preprocess(
            toNumber,
            z.number().min(1).max(365).optional()
        ),

        // --- Super Admin only fields — mirrors backend validation exactly ---

        isActive: z.enum(["ACTIVE", "INACTIVE"]).optional(),

        outstandingDebtLimit: z.preprocess(
            toNumber,
            z.number().min(0).optional()
        ),

        marketingLimitCount: z.preprocess(
            toNumber,
            z.number().min(0).optional()
        ),

        marketingLimitWindowHours: z.preprocess(
            toNumber,
            z.number().min(0).optional()
        ),

        noAppFeeWindow: z.preprocess(
            toNumber,
            z.number().min(0).optional()
        ),

        customFeeRate: z.preprocess(
            toNumber,
            z.number().min(0).max(100).optional()
        ),

        platformFeeType: z.enum(["PERCENT", "FLAT"]).optional(),
    })
// .refine((data) => Object.keys(data).length > 0, {
//     message: "At least one field must be provided for update",
// });

export type UpdateBusinessSchemaType = z.infer<typeof updateBusinessSchema>;