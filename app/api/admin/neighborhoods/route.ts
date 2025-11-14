import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const neighborhoodSchema = z.object({
  cityId: z.string().min(1, "City ID is required"),
  name: z.string().min(1, "Neighborhood name is required"),
  nameEn: z.string().optional(),
  level: z.string().min(1, "Level is required"),
  multiplier: z.number().positive("Multiplier must be positive"),
  isActive: z.boolean().default(true),
  applyAboveArea: z.number().int().default(500),
  displayOrder: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId");

    const where = cityId ? { cityId } : {};

    const neighborhoods = await prisma.neighborhood.findMany({
      where,
      orderBy: { displayOrder: "asc" },
      include: {
        city: true,
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json({ success: true, data: neighborhoods });
  } catch (error) {
    console.error("Error fetching neighborhoods:", error);
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
    const validation = neighborhoodSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const newNeighborhood = await prisma.neighborhood.create({
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "CREATE",
      tableName: "neighborhoods",
      recordId: newNeighborhood.id,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: newNeighborhood }, { status: 201 });
  } catch (error) {
    console.error("Error creating neighborhood:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

