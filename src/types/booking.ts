/* eslint-disable @typescript-eslint/no-explicit-any */

import { format, parseISO } from "date-fns";

// Single slot interface
export interface IBookingSlot {
    startTime: string;
    endTime: string;
}

// Single booking item interface
export interface IBookingItem {
    fieldId: string;
    date: string;
    slots: IBookingSlot[];

}

export interface IManualPlayerData {
    name: string;
    phone: string;
}

// Final create booking payload interface
export interface ICreateBookingPayload {
    bookingItems: IBookingItem[];
    manualPlayerData?: IManualPlayerData;
}

export interface Slot {
    startTime: string;
    endTime: string;
    price: number;
    available: boolean;
    id: string;
    fieldId: string;
    date: string;
}

export interface SelectedSlot {
    date: string;
    fieldId: string;
    startTime: string;
    endTime: string;
    price: number;
}


export interface SlotPricing {
    bookingId: string;
    fieldId: string;
    fieldName: string;
    userId: string;
    businessId: string;
    discountType: string;
    startTime: string;
    endTime: string;
    finalPayable: number;
}

export interface BookingData {
    cartId: string | null;
    sumUpTotalAmount: number;
    finalDiscount: number;
    payableAmount: number;
    totalPlatFormFee: number;
    refundAmount: number;
    createdAt: string;
    expiresAt: string;
    serverNow: string;

    partialPaymentTier: {
        fullPaymentAvailable: boolean;
        tiers: number[];
    };

    slotPricingDetails: SlotPricing[];
    discountMeta?: any;
}


export const formatTo12Hour = (value: string | Date) => {
    let hours: number;
    let minutes: number;

    if (value instanceof Date) {
        hours = value.getHours();
        minutes = value.getMinutes();
    } else {
        const [h, m] = value.split(":").map(Number);
        hours = h;
        minutes = m;
    }

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-BD", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

export const renderCurrentBookingWindow = (booking: ActiveBooking) => {
    try {
        const start = parseISO(booking.startTime);
        const end = parseISO(booking.endTime);
        return `${booking.fieldName} • ${format(start, "MMM d, yyyy")} (${formatTo12Hour(start)} - ${formatTo12Hour(end)})`;
    } catch {
        return "Unable to parse current dynamic range details.";
    }
};

export interface ActiveBooking {
    id: string;
    reference_id: string;
    startTime: string;
    endTime: string;
    fieldName: string;
    fieldId: string;
    status: string;
    manualPlayerName?: string;
    manualPlayerPhone?: string;
    business: {
        id: string;
        slug: string;
        name: string;
        location: string;
    };
}

export interface BusinessField {
    id: string;
    name: string;
    locationDetails?: string;
}

export interface AvailabilitySlot {
    startTime: string;
    endTime: string;
    price: number;
    available: boolean;
}

export interface CalculationDetails {
    cartId: string;
    newBookingId: string;
    totalAmount: number;
    finalDiscount: number;
    payableAmount: number;
    remainingPayable: number;
    refundAmount: number;
    partialPaymentTier: number[];
    note?: string;
}