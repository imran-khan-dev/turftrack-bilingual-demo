/* eslint-disable @typescript-eslint/no-explicit-any */

// 1. Export the interface so InputFieldError component can import it
export interface IInputErrorState {
    success?: boolean;
    message?: string;
    errors?:
    | Array<{ field: string; message: string }>
    | Record<string, string | string[] | undefined>
    | null;
    [key: string]: any;
}

// 2. Type the state parameter using IInputErrorState
export const getInputFieldError = (
    fieldName: string,
    state?: IInputErrorState | null
): string | null => {
    if (!state || !state.errors) return null;

    // APPROACH 1: If state.errors is an ARRAY of objects [{ field: "...", message: "..." }]
    if (Array.isArray(state.errors)) {
        const errorObj = state.errors.find((err: any) => err.field === fieldName);
        return errorObj ? errorObj.message : null;
    }

    // APPROACH 2: If state.errors is an OBJECT map { businessTerms: ["..."] }
    if (typeof state.errors === "object") {
        // Direct key lookup
        if (Array.isArray(state.errors[fieldName]) && state.errors[fieldName].length > 0) {
            return state.errors[fieldName][0];
        }

        // Fallback for string values instead of arrays within the object
        if (typeof state.errors[fieldName] === "string") {
            return state.errors[fieldName];
        }

        // Nested dot notation fallback (e.g., 'businessTerms.0.title')
        const nestedKey = Object.keys(state.errors).find(key => key.startsWith(`${fieldName}.`));
        if (nestedKey && Array.isArray(state.errors[nestedKey])) {
            return state.errors[nestedKey][0];
        }
    }

    return null;
};