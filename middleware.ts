import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "./lib/auth";

// Paths that require authentication
const protectedPaths = ["/admin", "/api/admin"];

// Paths that should skip auth (login page, public API)
const publicPaths = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/api/admin/auth/login",
  "/api/admin/auth/forgot-password",
  "/api/admin/auth/reset-password",
  "/api/calculate-price",
  "/api/calculator/config",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract token from cookies or Authorization header
  const token =
    request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // If accessing login page and already authenticated, redirect to dashboard
  if (pathname.startsWith("/admin/login")) {
    if (token) {
      const payload = await verifyTokenEdge(token);
      if (payload) {
        // User is authenticated, redirect to dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
    // Not authenticated or invalid token, allow access to login page
    return NextResponse.next();
  }

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Allow public paths
  if (!isProtectedPath || isPublicPath) {
    return NextResponse.next();
  }

  // No token found, redirect to login
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Verify token (using Edge-compatible function)
  const payload = await verifyTokenEdge(token);
  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
    // response.cookies.delete("admin_token");
    return response;
  }

  // Token is valid, allow request
  const response = NextResponse.next();

  // Add user info to headers for API routes
  response.headers.set("x-user-id", payload.userId);
  response.headers.set("x-user-email", payload.email);
  response.headers.set("x-user-role", payload.role);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
