""
import { NavSection } from "@/types/dashboard";
import { getDefaultDashboardRoute } from "./auth-utils";
import { UserRole } from "@/types/user";

export const getOnlyDashboardNav = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);

    return [
        {
            items: [
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                    roles: ["PLAYER", "OWNER", "MANAGER", "ADMIN"],
                }
            ]
        }
    ]
}
export const superAdminNavItems = async (): Promise<NavSection[]> => {
    return [
        {
            title: "Management",
            items: [
                {
                    title: "Users",
                    href: "/super-admin/dashboard/users",
                    icon: "Users",
                    roles: ["SUPER_ADMIN"],
                },
                {
                    title: "Businesses",
                    href: "/super-admin/dashboard/businesses",
                    icon: "Building2",
                    roles: ["SUPER_ADMIN"],
                },
                // {
                //     title: "Admins",
                //     href: "/admin/dashboard/admins",
                //     icon: "Shield",
                //     roles: ["ADMIN"],
                // },
            ],
        },
        {
            title: "Finance",
            items: [
                {
                    title: "Payout Summary",
                    href: "/super-admin/dashboard/payout-summary",
                    icon: "Wallet",
                    roles: ["SUPER_ADMIN"],
                },
                {
                    title: "Business Performance",
                    href: "/super-admin/dashboard/business-performance",
                    icon: "Trophy",
                    roles: ["SUPER_ADMIN"],
                },
                {
                    title: "Business Statements",
                    href: "/super-admin/dashboard/business-statements",
                    icon: "FileText",
                    roles: ["SUPER_ADMIN"],
                },
                {
                    title: "All Wallets",
                    href: "/super-admin/dashboard/all-wallets",
                    icon: "Landmark",
                    roles: ["SUPER_ADMIN"],
                },
                // {
                //     title: "Weekly Payments",
                //     href: "/super-admin/dashboard/weekly-payment",
                //     icon: "CalendarRange",
                //     roles: ["SUPER_ADMIN"],
                // },
                // {
                //     title: "Settle App Fee",
                //     href: "/super-admin/dashboard/settle-app-fee",
                //     icon: "BadgeDollarSign",
                //     roles: ["SUPER_ADMIN"],
                // },
            ],
        },
        // {
        //     title: "Marketing",
        //     items: [
        //         {
        //             title: "Notifications",
        //             href: "/admin/dashboard/marketing",
        //             icon: "Megaphone",
        //             roles: ["ADMIN"],
        //         },
        //     ],
        // },
        // {
        //     title: "System",
        //     items: [
        //         {
        //             title: "Audit Logs",
        //             href: "/admin/dashboard/audit-logs",
        //             icon: "Logs",
        //             roles: ["ADMIN"],
        //         },
        //         {
        //             title: "Configurations",
        //             href: "/admin/dashboard/configurations",
        //             icon: "Settings2",
        //             roles: ["ADMIN"],
        //         },
        //     ],
        // },
        {
            title: "Profile",
            items: [
                {
                    title: "My Profile",
                    href: `/super-admin/dashboard/my-profile`,
                    icon: "User",
                    roles: ["SUPER_ADMIN"],
                },
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/super-admin/dashboard/change-password",
                    icon: "Settings",
                    roles: ["SUPER_ADMIN"],
                },
            ],
        },
    ]
};

export const getOwnerNavItems = async (): Promise<NavSection[]> => {
    return [
        {
            title: "Bookings",
            items: [
                {
                    title: "Public Booking Link",
                    href: "/owner/dashboard/public-booking",
                    icon: "Plus",
                    roles: ["OWNER"],
                },
                {
                    title: "Quick Booking",
                    href: "/owner/dashboard/create-booking",
                    icon: "Plus",
                    roles: ["OWNER"],
                },
                {
                    title: "Manage Bookings",
                    href: "/owner/dashboard/manage-bookings",
                    icon: "Calendar",
                    roles: ["OWNER"],
                },
                {
                    title: "Block Slots",
                    href: "/owner/dashboard/block-slots",
                    icon: "Lock",
                    roles: ["OWNER"],
                },
                {
                    title: "Finalize Bookings",
                    href: "/owner/dashboard/finalize-bookings",
                    icon: "Clock",
                    roles: ["OWNER"],
                },
                {
                    title: "Pending Refunds",
                    href: "/owner/dashboard/pending-refunds",
                    icon: "RefreshCcw",
                    roles: ["OWNER"],
                },
                {
                    title: "Popular Hours",
                    href: "/owner/dashboard/popular-hours",
                    icon: "BarChart3",
                    roles: ["OWNER"],
                },
                {
                    title: "Utilization",
                    href: "/owner/dashboard/utilization",
                    icon: "Activity",
                    roles: ["OWNER"],
                },
            ],
        },
        {
            title: "Discounts",
            items: [
                // {
                //     title: "Business Discounts",
                //     href: "/owner/dashboard/discounts/business",
                //     icon: "Percent",
                //     roles: ["OWNER"],
                // },
                // {
                //     title: "Field Discounts",
                //     href: "/owner/dashboard/discounts/field",
                //     icon: "Tag",
                //     roles: ["OWNER"],
                // },
                {
                    title: "Promo Discounts",
                    href: "/owner/dashboard/promo-discounts",
                    icon: "TicketPercent",
                    roles: ["OWNER"],
                },
                // {
                //     title: "User Discounts",
                //     href: "/owner/dashboard/discounts/user",
                //     icon: "Gift",
                //     roles: ["OWNER"],
                // },
            ],
        },
        {
            title: "Management",
            items: [
                {
                    title: "Fields",
                    href: "/owner/dashboard/fields",
                    icon: "MapPinned",
                    roles: ["OWNER"],
                },
                {
                    title: "Players",
                    href: "/owner/dashboard/players",
                    icon: "Users",
                    roles: ["OWNER"],
                },
                {
                    title: "Managers",
                    href: "/owner/dashboard/managers",
                    icon: "UserCog",
                    roles: ["OWNER"],
                },
                {
                    title: "Businesses",
                    href: "/owner/dashboard/businesses",
                    icon: "Building",
                    roles: ["OWNER"],
                },
            ],
        },
        {
            title: "Finance",
            items: [
                {
                    title: "Payout Summary",
                    href: "/owner/dashboard/payout-summary",
                    icon: "Wallet",
                    roles: ["OWNER"],
                },
                {
                    title: "Business Performance",
                    href: "/owner/dashboard/business-performance",
                    icon: "Trophy",
                    roles: ["OWNER"],
                },
                // {
                //     title: "Transactions",
                //     href: "/owner/dashboard/transactions",
                //     icon: "Receipt",
                //     roles: ["OWNER"],
                // },
                {
                    title: "Business Statements",
                    href: "/owner/dashboard/business-statements",
                    icon: "FileText",
                    roles: ["OWNER"],
                },
                {
                    title: "My Wallet",
                    href: "/owner/dashboard/wallet",
                    icon: "CreditCard",
                    roles: ["OWNER"],
                },
            ],
        },
        {
            title: "Profile",
            items: [
                {
                    title: "My Profile",
                    href: `/owner/dashboard/my-profile`,
                    icon: "User",
                    roles: ["OWNER"],
                },
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/owner/dashboard/change-password",
                    icon: "Settings",
                    roles: ["OWNER"],
                },
            ],
        },
        // {
        //     title: "Others",
        //     items: [
        //         {
        //             title: "Marketing",
        //             href: "/owner/dashboard/marketing",
        //             icon: "Megaphone",
        //             roles: ["OWNER"],
        //         },
        //         {
        //             title: "Audit Logs",
        //             href: "/owner/dashboard/audit-logs",
        //             icon: "Logs",
        //             roles: ["OWNER"],
        //         },
        //     ],
        // },
    ];
};

export const getManagerNavItems = async (): Promise<NavSection[]> => {
    return [
        {
            title: "Bookings",
            items: [
                {
                    title: "Public Booking Link",
                    href: "/manager/dashboard/public-booking",
                    icon: "Plus",
                    roles: ["MANAGER"],
                },
                {
                    title: "Quick Booking",
                    href: "/manager/dashboard/create-booking",
                    icon: "Plus",
                    roles: ["MANAGER"],
                },
                {
                    title: "Manage Bookings",
                    href: "/manager/dashboard/manage-bookings",
                    icon: "Calendar",
                    roles: ["MANAGER"],
                },
                {
                    title: "Block Slots",
                    href: "/manager/dashboard/block-slots",
                    icon: "Lock",
                    roles: ["MANAGER"],
                },
                {
                    title: "Finalize Bookings",
                    href: "/manager/dashboard/finalize-bookings",
                    icon: "Clock",
                    roles: ["MANAGER"],
                },
                {
                    title: "Pending Refunds",
                    href: "/manager/dashboard/pending-refunds",
                    icon: "RefreshCcw",
                    roles: ["MANAGER"],
                },
                {
                    title: "Popular Hours",
                    href: "/manager/dashboard/popular-hours",
                    icon: "BarChart3",
                    roles: ["MANAGER"],
                },
                {
                    title: "Utilization",
                    href: "/manager/dashboard/utilization",
                    icon: "Activity",
                    roles: ["MANAGER"],
                },
            ],
        },
        {
            title: "Management",
            items: [
                {
                    title: "Players",
                    href: "/manager/dashboard/players",
                    icon: "Users",
                    roles: ["MANAGER"],
                }
            ],
        },
        {
            title: "Profile",
            items: [
                {
                    title: "My Profile",
                    href: `/manager/dashboard/my-profile`,
                    icon: "User",
                    roles: ["MANAGER"],
                },
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/manager/dashboard/change-password",
                    icon: "Settings",
                    roles: ["MANAGER"],
                },
            ],
        },

    ];
};

export const getPlayerNavItems = async (): Promise<NavSection[]> => {
    return [
        {
            title: "Bookings",
            items: [
                {
                    title: "Booking Link",
                    href: "/player/dashboard/booking-link",
                    icon: "Plus",
                    roles: ["PLAYER"],
                },
                {
                    title: "My Bookings",
                    href: "/player/dashboard/manage-bookings",
                    icon: "Calendar",
                    roles: ["PLAYER"],
                },
            ],
        },
        {
            title: "Finance",
            items: [
                {
                    title: "Refunds",
                    href: "/player/dashboard/refunds",
                    icon: "CreditCard",
                    roles: ["PLAYER"],
                },
            ],
        },
        {
            title: "Profile",
            items: [
                {
                    title: "My Profile",
                    href: `/player/dashboard/my-profile`,
                    icon: "User",
                    roles: ["PLAYER"],
                },
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/player/dashboard/change-password",
                    icon: "Settings",
                    roles: ["PLAYER"],
                },
            ],
        },
    ];
};

export const getNavItemsByRole = async (role: UserRole): Promise<NavSection[]> => {
    const onlyDashboardNav = getOnlyDashboardNav(role);

    switch (role) {
        case "SUPER_ADMIN":
            return [...onlyDashboardNav, ...(await superAdminNavItems())];

        case "OWNER":
            return [...onlyDashboardNav, ...(await getOwnerNavItems())];

        case "MANAGER":
            return [...onlyDashboardNav, ...(await getManagerNavItems())];

        case "PLAYER":
            return [...onlyDashboardNav, ...(await getPlayerNavItems())];

        default:
            return [...onlyDashboardNav];
    }
}