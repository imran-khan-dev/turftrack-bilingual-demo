/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AccessibleBusiness {
    id: string;
    name: string;
    slug: string;
    refundAllowed: boolean;
    refundPercent: number;
}

export function getAccessibleBusinesses(user: any): AccessibleBusiness[] {
    if (!user) return [];

    const role = user.role;

    if (role === "OWNER" && Array.isArray(user.businesses)) {


        return user.businesses.map((b: any) => ({
            id: b.id,
            name: b.name || "Unnamed Business",
            slug: b.slug || "",
            refundAllowed: b.refundAllowed,
            refundPercent: b.refundPercent,
        }));
    }

    if (role === "MANAGER" && Array.isArray(user.staffs)) {
        return user.staffs
            .filter((staff: any) => staff?.business)
            .map((staff: any) => ({
                id: staff.business.id,
                name: staff.business.name || "Unnamed Business",
                slug: staff.business.slug || "",
                refundAllowed: staff.business.refundAllowed,
                refundPercent: staff.business.refundPercent,
                fields: staff.business.fields
            }));
    }

    if (role === "PLAYER" && Array.isArray(user.playerBusinessAccesses)) {
        return user.playerBusinessAccesses
            .filter((business: any) => business?.business)
            .map((business: any) => ({
                id: business.business.id,
                name: business.business.name || "Unnamed Business",
                slug: business.business.slug || "",
                refundAllowed: business.business.refundAllowed,
                refundPercent: business.business.refundPercent,
                fields: business.business.fields
            }));
    }
    return [];
}