import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth";
import { z } from "zod";

// Use Node.js runtime for nodemailer support
export const runtime = "nodejs";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Request password reset (always returns true for security)
    await requestPasswordReset(email);

    // Always return success to prevent email enumeration
    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
