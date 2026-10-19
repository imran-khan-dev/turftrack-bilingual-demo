import { z } from "zod";

export const updateProfileValidationSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is required")
        .max(100, "Full name must not exceed 100 characters")
        .optional(),

    address: z
        .string()
        .trim()
        .max(255, "Address must not exceed 255 characters")
        .optional(),

    clubName: z
        .string()
        .trim()
        .max(100, "Club name must not exceed 100 characters")
        .optional(),
})

export type UpdateMyProfileInput = z.infer<typeof updateProfileValidationSchema>;

export const togglePlayerSpecialSchema = z.object({
    businessId: z.string().min(1, "businessId is required"),
    id: z.string().optional(),
    phone: z
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
        .optional(),
    isManual: z.boolean().optional(),
}).refine((data) => data.id || data.phone, {
    message: "Either id or phone is required to identify the player",
    path: ["phone"], // Attaches error path to phone if both are missing
});

export type TogglePlayerSpecialPayload = z.infer<typeof togglePlayerSpecialSchema>;