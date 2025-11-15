import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const tierSchema = z.object({
  minArea: z.number().positive("Minimum area must be positive"),
  maxArea: z.number().positive("Maximum area must be positive").nullable(),
  pricePerSqm: z.number().positive("Price per square meter must be positive"),
  isActive: z.boolean().default(true),
});

// GET - List all tiers for a package
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const packageData = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const tiers = await prisma.areaPriceTier.findMany({
      where: { packageId: params.id },
      orderBy: { minArea: "asc" },
    });

    return NextResponse.json({ success: true, data: tiers });
  } catch (error) {
    console.error("Error fetching area price tiers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new tier for a package
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const packageData = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const body = await request.json();
    const validation = tierSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Check for overlapping tiers
    const existingTiers = await prisma.areaPriceTier.findMany({
      where: { packageId: params.id, isActive: true },
    });

    const newTier = validation.data;
    for (const existing of existingTiers) {
      const existingMin = Number(existing.minArea);
      const existingMax = existing.maxArea
        ? Number(existing.maxArea)
        : Infinity;
      const newMin = newTier.minArea;
      const newMax = newTier.maxArea || Infinity;

      if (
        (newMin >= existingMin && newMin <= existingMax) ||
        (newMax >= existingMin && newMax <= existingMax) ||
        (newMin <= existingMin && newMax >= existingMax)
      ) {
        return NextResponse.json(
          { error: "Tier overlaps with existing tier" },
          { status: 400 }
        );
      }
    }

    const createdTier = await prisma.areaPriceTier.create({
      data: {
        packageId: params.id,
        minArea: newTier.minArea,
        maxArea: newTier.maxArea,
        pricePerSqm: newTier.pricePerSqm,
        isActive: newTier.isActive,
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "CREATE",
      tableName: "area_price_tiers",
      recordId: createdTier.id,
      newValues: validation.data,
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(
      { success: true, data: createdTier },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating area price tier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
