/**
 * 1. Read-only Array source for runtime iterations (e.g., Select options, validation schemas)
 */
export const FIELD_TYPES = [
    "FIVE_A_SIDE",
    "SIX_A_SIDE",
    "SEVEN_A_SIDE",
    "EIGHT_A_SIDE",
    "NINE_A_SIDE",
    "ELEVEN_A_SIDE",
    "FUTSAL",
    "CRICKET_NETS",
    "BOX_CRICKET",
    "PADEL",
    "TENNIS",
    "BADMINTON",
    "BASKETBALL",
    "VOLLEYBALL",
    "MULTI_PURPOSE",
    "CUSTOM",
] as const;

/**
 * 2. Pure TypeScript Union Type extracted directly from the read-only array
 * Equivalent to: "FIVE_A_SIDE" | "SIX_A_SIDE" | ...
 */
export type FieldType = typeof FIELD_TYPES[number];

/**
 * 3. Strongly-typed dictionary mapping each FieldType key to its user-friendly UI display label
 */
export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
    FIVE_A_SIDE: "5-a-side",
    SIX_A_SIDE: "6-a-side",
    SEVEN_A_SIDE: "7-a-side",
    EIGHT_A_SIDE: "8-a-side",
    NINE_A_SIDE: "9-a-side",
    ELEVEN_A_SIDE: "11-a-side",
    FUTSAL: "Futsal",
    CRICKET_NETS: "Cricket Nets",
    BOX_CRICKET: "Box Cricket",
    PADEL: "Padel Tennis",
    TENNIS: "Tennis Court",
    BADMINTON: "Badminton Court",
    BASKETBALL: "Basketball Court",
    VOLLEYBALL: "Volleyball Court",
    MULTI_PURPOSE: "Multi-Purpose Court",
    CUSTOM: "Custom Layout",
};
