import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const multiplierSchema = z.object({
  purpose: z.string().min(1, "Purpose is required"),
  purposeEn: z.string().optional(),
  multiplier: z.number().positive("Multiplier must be positive"),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const multipliers = await prisma.inspectionPurposeMultiplier.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: multipliers });
  } catch (error) {
    console.error("Error fetching inspection purpose multipliers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = multiplierSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const newMultiplier = await prisma.inspectionPurposeMultiplier.create({
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "CREATE",
      tableName: "inspection_purpose_multipliers",
      recordId: newMultiplier.id,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: newMultiplier }, { status: 201 });
  } catch (error) {
    console.error("Error creating inspection purpose multiplier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

