interface NavItem {
    to: string;
    label: string;
    icon?: string;        // icon-এর name string
    authRequired?: boolean;
    roles?: string[];
  }
  
  export const navItems: NavItem[] = [
    { to: "/", label: "Home", icon: "Home" },
    { to: "/events", label: "Events", icon: "Event" },
    { to: "/trendingitems", label: "Trends", icon: "TrendingUp" },
    { to: "/blogs", label: "Blogs", icon: "BookOpen" },
    { to: "/about", label: "About", icon: "Info" },
    { to: "/contact", label: "Contact", icon: "Mail" },

    { to: "/dashboard", label: "Dashboard", icon: "LayoutDashboard", authRequired: true },
    { to: "/admin", label: "Admin Panel", icon: "Shield", authRequired: true, roles: ["Admin"] },
  ];