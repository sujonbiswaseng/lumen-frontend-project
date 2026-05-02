import { NextRequest, NextResponse } from "next/server";
import { getSessionAction } from "./actions/auth.actions";

export type TUserRole = "USER" | "ADMIN" | "MANAGER";

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  try {
    const isPaymentSuccessRoute =
      pathname.startsWith("/payment/") ||
      pathname.includes("/payment/:*");

    if (isPaymentSuccessRoute) {
      return NextResponse.next();
    }
    const SessionToken = request.cookies.get("better-auth.session_token")?.value;

    if (!SessionToken) {
      return NextResponse.redirect(new URL("/login?You_are_not_logged_in,_please_log_in_first.", request.url));
    }
    const userSession = await getSessionAction();
    if (!userSession?.success || !userSession?.data) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const user = userSession.data;
    if (user.status === "BLOCKED") {
      return NextResponse.redirect(new URL("/login?Your_account_is_blocked.please contact support", request.url));
    }
    const role = user.role as TUserRole;
    if (pathname.startsWith("/admin")) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login?Access_denied_Admins_only", request.url));
      }
    }

    if (pathname.startsWith("/manager")) {
      if (role !== "MANAGER") {
        return NextResponse.redirect(new URL("/login?Access_denied_Admins_only", request.url));
      }
    }

    if (pathname.startsWith("/payment")) {
      if (role !== "ADMIN" && role !== "USER") {
        return NextResponse.redirect(new URL("/login?Access_denied_Only_users_and_admins_can_access_payment_routes.", request.url));
      }
    }

    if (pathname.startsWith("/user")) {
      if (role !== "USER") {
        return NextResponse.redirect(new URL("/login?Access_denied_Only_users.", request.url));
      }
    }

    if (pathname.startsWith("/dashboard")) {

      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (role === "USER") {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
      }
      else if (role === "MANAGER") {
        return NextResponse.redirect(new URL("/manager/dashboard", request.url));
      }
    }

    if (pathname === "/user") {
      return NextResponse.redirect(new URL("/user/dashboard", request.url));
    }
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (pathname === "/manager") {
      return NextResponse.redirect(new URL("/manager/dashboard", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return NextResponse.redirect(new URL("/login?Something_went_wrong_while_verifying_authentication", request.url));
  }
};

export const config = {
  matcher: ["/admin/:path*","/manager/:path*", "/user/:path*", "/dashboard/:path*"],
};