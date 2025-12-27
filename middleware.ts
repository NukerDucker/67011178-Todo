import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    // 1. Get the session cookie from the request
    const sessionCookie = getSessionCookie(request);

    // 2. Define your logic
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
    const isAuthRoute = request.nextUrl.pathname.startsWith("/login") ||
                        request.nextUrl.pathname.startsWith("/register");

    // Redirect to login if trying to access dashboard without a session
    if (!sessionCookie && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to dashboard if already logged in and trying to access login/register
    if (sessionCookie && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

// 3. Configure the Matcher
// This ensures the middleware doesn't run on images, static files, or the API
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
        "/register"
    ],
};