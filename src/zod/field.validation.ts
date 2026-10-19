import { z } from "zod";
import { FIELD_TYPES } from "@/types/field";

const MAX_PERIODS_PER_DAY = 20;

// --- Shared pricing pieces -----
const timeSlotPricingSchema = z.object({
    start: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must be in HH:mm format"),
    end: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "End time must be in HH:mm format"),
    price: z.coerce.number().nonnegative("Price must be zero or greater"),
});

const daySlotsSchema = z
    .array(timeSlotPricingSchema)
    .max(MAX_PERIODS_PER_DAY, `Maximum ${MAX_PERIODS_PER_DAY} periods per day`)
    .default([]);

const weeklyPricingObjectSchema = z.object({
    "0": daySlotsSchema,
    "1": daySlotsSchema,
    "2": daySlotsSchema,
    "3": daySlotsSchema,
    "4": daySlotsSchema,
    "5": daySlotsSchema,
    "6": daySlotsSchema,
});

// Reusable JSON transform pipe to handle FormData string conversions safely
const parseJsonPricingPipe = z
    .string({ error: "Weekly pricing schedule is required" })
    .transform((val, ctx) => {
        try {
            return JSON.parse(val);
        } catch {
            ctx.addIssue({
                code: "custom",
                message: "Weekly pricing schedule is not valid JSON",
            });
            return z.NEVER;
        }
    })
    .pipe(weeklyPricingObjectSchema);

// --- Create schema ----------------------------------------------------
export const createFieldValidationZodSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Field name must be at least 2 characters")
        .max(100, "Field name must be under 100 characters"),
    description: z
        .string()
        .trim()
        .max(1000, "Description must be under 1000 characters")
        .optional()
        .or(z.literal("")),
    fieldType: z.enum(FIELD_TYPES as unknown as [string, ...string[]], {
        message: "Please select a valid field type",
    }),
    pricePerSlot: z.coerce
        .number({ error: "Price per slot must be a number" })
        .nonnegative("Price per slot must be zero or greater"),
    slotBreak: z.coerce
        .number({ error: "Slot break must be a number" })
        .int("Slot break must be a whole number of minutes")
        .nonnegative("Slot break must be zero or greater"),
    amenities: z.array(z.string().trim().min(1)).default([]),
    inputPricing: parseJsonPricingPipe, // Shared clean transform structure
});

export type CreateFieldValidationInput = z.infer<typeof createFieldValidationZodSchema>;

// --- Update schema ----------------------------------------------------
export const updateFieldValidationZodSchema = z.object({
    name: z
        .string({ error: "Field name must be text" })
        .min(1, { error: "Field name cannot be empty" })
        .optional(),

    description: z
        .string({ error: "Description must be text" })
        .optional(),

    fieldType: z
        .string({ error: "Field type must be text" })
        .min(1, { error: "Field type cannot be empty" })
        .optional(),

    pricePerSlot: z.coerce
        .number({ error: "Price per slot must be a number" })
        .nonnegative({ error: "Price per slot cannot be negative" })
        .optional(),

    slotBreak: z.coerce
        .number({ error: "Slot break must be a number" })
        .int({ error: "Slot break must be a whole number" })
        .nonnegative({ error: "Slot break cannot be negative" })
        .optional(),

    isActive: z
        .enum(["ACTIVE", "INACTIVE"], {
            error: "Status must be ACTIVE or INACTIVE",
        })
        .optional(),

    addAmenities: z.array(z.string().min(1)).optional(),
    removeAmenities: z.array(z.string().min(1)).optional(),

    inputPricing: parseJsonPricingPipe.optional(),
});

export type UpdateFieldValidationInput = z.infer<
    typeof updateFieldValidationZodSchema
>;