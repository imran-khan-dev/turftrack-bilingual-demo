/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;


export function createRegisterPlayerValidationSchema(messages: AuthValidationMessages) {
    return z
    .object({
        fullName: z.string().min(1, {
            message: messages.nameRequired,
        }),

        address: z.string().optional(),

        email: z.preprocess(
            (val) => {
                if (val === "" || val === null) return undefined;
                return val;
            },
            z.email({ message: messages.validEmail }).optional()
        ),

        phone: z.string().regex(bdPhoneRegex, {
            message:
                messages.validPhone,
        }),

        clubName: z.string().optional(),

        password: z
            .string()
            .min(6, {
                error: messages.passwordRequired,
            })
            .max(100, {
                error: messages.passwordTooLong,
            }),

        confirmPassword: z.string().min(6, {
            error:
                messages.confirmPasswordRequired,
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: messages.passwordsMismatch,
        path: ["confirmPassword"],
    });

}

export function createLoginValidationSchema(messages: AuthValidationMessages) {
return z.object({
    emailOrPhone: z.union([
        z.email({
            message: messages.validEmail,
        }),

        z.string().regex(bdPhoneRegex, {
            message:
                messages.validPhone,
        }),
    ]),

    password: z
        .string()
        .min(6, {
            error: messages.passwordRequired,
        })
        .max(100, {
            error: messages.passwordTooLong,
        }),
});
}

export type AuthValidationMessages = {
    validEmail: string;
    validPhone: string;
    nameRequired: string;
    passwordRequired: string;
    passwordTooLong: string;
    confirmPasswordRequired: string;
    passwordsMismatch: string;
};

export const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z
            .string()
            .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const forgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address"),
});

export const changePasswordSchema = z
    .object({
        oldPassword: z.string().min(6, "Password must be at least 6 characters"),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z
            .string()
            .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });
