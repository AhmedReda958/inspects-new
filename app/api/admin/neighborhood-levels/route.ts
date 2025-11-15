import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const levelSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  nameEn: z.string().optional(),
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

    const levels = await prisma.neighborhoodLevel.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: levels });
  } catch (error) {
    console.error("Error fetching neighborhood levels:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = levelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const newLevel = await prisma.neighborhoodLevel.create({
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "CREATE",
      tableName: "neighborhood_levels",
      recordId: newLevel.id,
      newValues: validation.data,
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(
      { success: true, data: newLevel },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating neighborhood level:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
