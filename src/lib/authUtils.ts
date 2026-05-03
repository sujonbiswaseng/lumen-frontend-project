import { Role } from "@/types/user.types";

/** Same as `Role` enum — used for casts in sidebar / dashboard navigation. */
export type UserRole = Role;

export const getDefaultDashboardRoute = (role: Role) => {
    if(role === "ADMIN") {
        return "/admin/dashboard";
    }
    if(role === "USER") {
        return "/user/dashboard";
    }
    return "/";
}