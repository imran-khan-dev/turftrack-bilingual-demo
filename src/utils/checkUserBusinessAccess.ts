import { IAuthUser } from "@/types/user";

export const checkUserBusinessAccess = (
    user: IAuthUser,
    businessId: string,
) => {

    if (!user.id || !businessId) {
        return {
            isConnected: false,
            isSpecial: false,
            status: "ACTIVE",
        };
    }

    const access = user.playerBusinessAccesses.find(
        (item) => item.business.id === businessId,
    );

    // User has no connection with this business
    if (!access) {
        return {
            isConnected: false,
            isSpecial: false,
            status: "ACTIVE",
        };
    }

    // User connected
    return {
        isConnected: true,
        isSpecial: access.isSpecial,
        status: access.status,
    };
};