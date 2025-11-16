import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the admin token cookie with same settings as login
    const isHttps =
      request.url.startsWith("https://") ||
      request.headers.get("x-forwarded-proto") === "https";
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: isHttps, // Match the secure setting from login
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

