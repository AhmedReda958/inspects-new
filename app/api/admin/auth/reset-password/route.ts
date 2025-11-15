import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth";
import { z } from "zod";

// Use Node.js runtime for bcrypt and database operations
export const runtime = "nodejs";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { token, password } = validation.data;

    // Reset password
    const result = await resetPassword(token, password);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to reset password" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Password has been reset successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

