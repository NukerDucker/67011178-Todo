import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // Public routes that don't need auth
    if (pathname === "/" || pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // If NOT logged in and trying to access protected areas
    if (!sessionCookie && (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding"))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If IS logged in and trying to access login/register
    if (sessionCookie && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register", "/onboarding"],
};