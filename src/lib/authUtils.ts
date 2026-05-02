import { Role } from "@/types/user.types";

export const getDefaultDashboardRoute = (role : Role) => {
    if(role === "ADMIN") {
        return "/admin/dashboard";
    }
    if(role === "USER") {
        return "/user/dashboard";
    }
    return "/";
}