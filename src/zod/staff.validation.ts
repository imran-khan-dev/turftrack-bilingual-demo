import { z } from "zod";

const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;


export const createManagerValidationSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, "Full name is required")
        .max(100, "Full name must not exceed 100 characters"),

    email: z.preprocess(
        (val) => {
            if (val === "" || val === null) return undefined;
            return val;
        },
        z.email().optional()
    ),

    password: z
        .string()
        .min(6, {
            error: "Password is required and must be at least 6 characters long",
        })
        .max(100, {
            error: "Password must be at most 100 characters long",
        }),

    confirmPassword: z.string().min(6, {
        error:
            "Confirm Password is required and must be at least 6 characters long",
    }),

    phone: z.string().regex(bdPhoneRegex, {
        message:
            "Valid Bangladeshi phone number is required (e.g. 01712345678 or +8801712345678)",
    }),

    address: z
        .string()
        .trim()
        .min(1, "Address is required")
        .max(255, "Address must not exceed 255 characters"),

    businessId: z
        .string()
        .uuid("Business is required"),
});

export type CreateManagerInput = z.infer<
    typeof createManagerValidationSchema
>;