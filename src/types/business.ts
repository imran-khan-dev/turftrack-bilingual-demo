export interface BusinessFeature {
    title: string;
}

export interface BusinessField {
    id: string;
    name: string;
    description: string;
    slug: string;
    imageUrl: string[];
}

export interface BusinessTerm {
    id: string;
    businessId: string;
    title: string;
    description: string | null;
}

export interface Business {
    id: string;
    name: string;
    isActive: "ACTIVE" | "INACTIVE" | "SUSPENDED";

    slug: string;

    // CONTACT
    location: string;
    contactNumber: string;
    businessEmail: string;

    // BRANDING
    logo: string;
    heroImage: string;
    heroTitle: string;

    // SOCIAL LINKS
    facebookLink: string;
    instagramLink: string;
    whatsappLink: string;
    googleMapLink: string;

    // ABOUT
    aboutTitle: string;
    aboutDesc: string;
    aboutImg: string;

    // FOOTER
    footerText: string;

    // BOOKING SETTINGS
    allowPlayerReschedule: boolean;
    rescheduleWindowHours: number;
    rescheduleLimitCount: number;
    allowPlayerCancel: boolean;
    cancelWindowHours: number;
    minDepositPercent: number;
    maxDepositPercent: number;

    maxSlotsPerBooking: number;
    maxBookingsPerDay: number;
    bookingHorizonDays: number;
    refundAllowed: boolean;
    refundPercent: number;

    // RELATIONS
    features: BusinessFeature[];
    fields: BusinessField[];
    businessTerms: BusinessTerm[];
}

export interface PublicBusiness extends Business {
    name: string;
    isOwner: boolean;
    isManager: boolean;
}