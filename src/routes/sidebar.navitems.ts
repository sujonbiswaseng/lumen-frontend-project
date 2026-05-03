

import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { NavSection } from "@/types/dashboard.types";
import { Role } from "@/types/user.types";



export const getCommonNavItems = (role : Role) : NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            items : [
                {
                    title : "Home",
                    href : "/",
                    icon : "Home"
                },
                {
                    title : "Dashboard",
                    href : defaultDashboard,
                    icon : "LayoutDashboard"

                }
            ]
        }
    ]
}


export const UserNavItems : NavSection[] = [
    {
        title: "Event Management",
        items: [
            {
                title: "My-Events",
                href: "/user/dashboard/my-events",
                icon: "Calendar"
            },
            {
                title: "Create Event",
                href: "/user/dashboard/create-event",
                icon: "PlusSquare"
            },
            {
                title: "Invitations",
                href: "/user/dashboard/invitations",
                icon: "Mail"
            }
        ]
    },
    {
        title: "User Management",
        items: [
            {
                title: "My Participant",
                href: "/user/dashboard/my-participant",
                icon: "Users"
            },
            {
                title: "My Reviews",
                href: "/user/dashboard/my-reviews",
                icon: "Star"
            },
            {
                title: "Settings",
                href: "/user/dashboard/settings",
                icon: "Settings"
            }
        ]
    }
]




export const ManagerNavItems: NavSection[] = [
    {
        title: "Event Management",
        items: [
            {
                title: "Events",
                href: "/manager/dashboard/events",
                icon: "Calendar"
            },
            {
                title: "Invitations",
                href: "/manager/dashboard/invitations",
                icon: "Mail"
            }
        ]
    },
    {
        title: "Blog Management",
        items: [
            {
                title: "Blogs",
                href: "/manager/dashboard/blogs",
                icon: "FileText"
            },
            {
                title: "Create Blog",
                href: "/manager/dashboard/create-blog",
                icon: "PlusSquare"
            }
        ]
    },
    {
        title: "User Management",
        items: [
            {
                title: "users",
                href: "/manager/dashboard/users",
                icon: "UserCog"
            },
            {
                title: "Newsletter",
                href: "/manager/dashboard/newsletters",
                icon: "MailOpen"
            },
       
            {
                title: "Participants",
                href: "/manager/dashboard/participants",
                icon: "Users"
            },
            {
                title: "Reviews",
                href: "/manager/dashboard/reviews",
                icon: "Star"
            }
        ]
    },
    {
        title: "Category Management",
        items: [
            {
                title: "Categories",
                href: "/admin/dashboard/categories",
                icon: "Layers"
            },
            {
                title: "Create Category",
                href: "/admin/dashboard/create-category",
                icon: "PlusSquare"
            }
        ]
    },
    {
        title: "Highlight Management",
        items: [
            {
                title: "Highlights",
                href: "/admin/dashboard/highlights",
                icon: "FileText"
            },
            {
                title: "Create Highlight",
                href: "/admin/dashboard/create-highlight",
                icon: "PlusSquare"
            }
        ]
    },
    {
        title: "System",
        items: [
            {
                title: "Payment",
                href: "/manager/dashboard/payment",
                icon: "CreditCard"
            },
            {
                title: "Settings",
                href: "/manager/dashboard/setting",
                icon: "Settings"
            }
        ]
    }
]



export const adminNavItems: NavSection[] = [
    {
        title: "Event Management",
        items: [
            {
                title: "Events",
                href: "/admin/dashboard/events",
                icon: "Calendar"
            },
            {
                title: "Invitations",
                href: "/admin/dashboard/invitations",
                icon: "Mail"
            }
        ]
    },
    {
        title: "Blog Management",
        items: [
            {
                title: "Blogs",
                href: "/admin/dashboard/blogs",
                icon: "FileText"
            },
            {
                title: "Create Blog",
                href: "/admin/dashboard/create-blog",
                icon: "PlusSquare"
            }
        ]
    },
    {
        title: "Category Management",
        items: [
            {
                title: "Categories",
                href: "/admin/dashboard/categories",
                icon: "Layers"
            },
            {
                title: "Create Category",
                href: "/admin/dashboard/create-category",
                icon: "PlusSquare"
            }
        ]
    },
    {
        title: "Highlight Management",
        items: [
            {
                title: "Highlights",
                href: "/admin/dashboard/highlights",
                icon: "FileText"
            },
            {
                title: "Create Highlight",
                href: "/admin/dashboard/create-highlight",
                icon: "PlusSquare"
            }
        ]
    },
    {
        title: "User Management",
        items: [
            {
                title: "Users",
                href: "/admin/dashboard/users",
                icon: "UserCog"
            },
            {
                title: "Participants",
                href: "/admin/dashboard/participants",
                icon: "Users"
            },
            {
                title: "Newsletter",
                href: "/admin/dashboard/newsletters",
                icon: "MailOpen"
            },
            {
                title: "Reviews",
                href: "/admin/dashboard/reviews",
                icon: "Star"
            }
        ]
    },
    {
        title: "System",
        items: [
            {
                title: "Payment",
                href: "/admin/dashboard/payment",
                icon: "CreditCard"
            },
            {
                title: "Settings",
                href: "/admin/dashboard/setting",
                icon: "Settings"
            }
        ]
    }
]


export const getNavItemsByRole = (role : Role) => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];

        case "USER":
            return [...commonNavItems, ...UserNavItems];
        case "MANAGER":
            return [...commonNavItems, ...ManagerNavItems];
    }


}