import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths (accessible without authentication)
  const isPublicPath =
    path === "/" || path === "/login" || path === "/signup" || path === "/verifyemail";

  // Get the token from cookies
  const token = request.cookies.get("token")?.value || "";

  // Redirect authenticated users away from public paths (e.g., login, signup)
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl)); // Redirect to profile if authenticated
  }

  // Redirect unauthenticated users away from private paths (e.g., profile, changepassword)
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl)); // Redirect to login if not authenticated
  }

  // Allow the request to proceed if no redirection is needed
  return NextResponse.next();
}

// Matcher configuration
export const config = {
  matcher: [
    "/profile",
    "/changepassword",
    "/login",
    "/signup",
    "/verifyemail",
  ],
};