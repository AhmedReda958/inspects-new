import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    // Validation
    if (!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.trim().length === 0) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Basic phone number validation (at least 5 characters)
    const trimmedPhone = phoneNumber.trim();
    if (trimmedPhone.length < 5) {
      return NextResponse.json(
        { error: "Phone number is too short" },
        { status: 400 }
      );
    }

    // Extract IP address and user agent
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || null;

    // Save to database
    const reportDownload = await prisma.reportDownload.create({
      data: {
        phoneNumber: trimmedPhone,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      data: reportDownload,
    });
  } catch (error) {
    console.error("Error saving report download:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

