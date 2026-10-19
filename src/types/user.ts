/* eslint-disable @typescript-eslint/no-explicit-any */

export type UserRole =
    | "OWNER"
    | "MANAGER"
    | "SUPER_ADMIN"
    | "ADMIN"
    | "PLAYER"
    | null;

export interface IAuthUser {
    id: string;
    fullName: string;
    name?: string; // duplicate of fullName in the response — confirm if intentional
    email: string;
    phone: string;
    address?: string;
    photo?: string | null;
    role: UserRole;
    isActive: "ACTIVE" | "INACTIVE" | "BLOCKED" | string;
    isVerified: boolean;
    isPhoneVerified: boolean;
    isDeleted: boolean;
    tokenVersion: number;
    clubName?: string;
    createdAt: string;
    updatedAt: string;
    playerBusinessAccesses: PlayerBusinessAccess[];
    businesses: Business[];
    staffs: Staff[];
}

export interface Business {
    id: string;
    name: string;
    location: string;
    contactNumber: string;
    isContactVerified: boolean;
    refundAllowed: boolean;
    refundPercent: string;
    logo?: string;
    ownerId: string;
    slug: string;
    bkashNumber?: string;
    isBkashVerified: boolean;
    fields: BusinessField[];
}

export interface BusinessField {
    id: string;
    businessId: string;
    businessSlug: string;
    name: string;
    fieldType: string;
    pricePerSlot: string;
    slotBreak: number;
    isActive: "ACTIVE" | "INACTIVE" | string;
    isDeleted: boolean;
    description: string | null;
    amenities: string[];
    discountId: string | null;
    createdAt: string;
    updatedAt: string;
}

export type BusinessAccessStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface PlayerBusinessAccess {
    playerId: string;
    business: {
        id: string;
        name: string;
        contactNumber: string;
        slug: string;
        refundAllowed: boolean;
        refundPercent: number;
        fields: Record<string, unknown> | null;
    };
    status: BusinessAccessStatus;
    isSpecial: boolean;
    discountId: string | null;
    createdAt: string;
    updatedAt: string;
}


export interface StaffBusiness {
    id: string;
    name: string;
}

export interface Staff {
    id: string;
    business: StaffBusiness;
}

export interface User {
    id: string;
    fullName: string;
    phone: string;
    email: string | null;
    role: "SUPER_ADMIN" | "OWNER" | "MANAGER" | "PLAYER" | string;
    isActive: "ACTIVE" | "INACTIVE" | string;
    photo: string | null;
    isVerified: boolean;
    isPhoneVerified: boolean;
    clubName: string | null;
    createdAt: string;
    _count: {
        bookings: number;
    };
    staffs: Staff[];
    playerBusinessAccesses: PlayerBusinessAccess[];
    isSpecialInScope: boolean;
}