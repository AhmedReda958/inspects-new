import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const tierSchema = z.object({
  minArea: z.number().positive("Minimum area must be positive").optional(),
  maxArea: z
    .number()
    .positive("Maximum area must be positive")
    .nullable()
    .optional(),
  pricePerSqm: z
    .number()
    .positive("Price per square meter must be positive")
    .optional(),
  isActive: z.boolean().optional(),
});

// GET - Get single tier
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; tierId: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tier = await prisma.areaPriceTier.findUnique({
      where: { id: params.tierId },
      include: { package: true },
    });

    if (!tier) {
      return NextResponse.json({ error: "Tier not found" }, { status: 404 });
    }

    if (tier.packageId !== params.id) {
      return NextResponse.json(
        { error: "Tier does not belong to this package" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: tier });
  } catch (error) {
    console.error("Error fetching area price tier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update tier
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; tierId: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oldTier = await prisma.areaPriceTier.findUnique({
      where: { id: params.tierId },
    });

    if (!oldTier) {
      return NextResponse.json({ error: "Tier not found" }, { status: 404 });
    }

    if (oldTier.packageId !== params.id) {
      return NextResponse.json(
        { error: "Tier does not belong to this package" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = tierSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Check for overlapping tiers (excluding current tier)
    if (
      validation.data.minArea !== undefined ||
      validation.data.maxArea !== undefined
    ) {
      const existingTiers = await prisma.areaPriceTier.findMany({
        where: {
          packageId: params.id,
          isActive: true,
          id: { not: params.tierId },
        },
      });

      const updatedTier = {
        minArea: validation.data.minArea ?? Number(oldTier.minArea),
        maxArea:
          validation.data.maxArea !== undefined
            ? validation.data.maxArea ?? null
            : oldTier.maxArea
            ? Number(oldTier.maxArea)
            : null,
      };

      for (const existing of existingTiers) {
        const existingMin = Number(existing.minArea);
        const existingMax = existing.maxArea
          ? Number(existing.maxArea)
          : Infinity;
        const newMin = updatedTier.minArea;
        const newMax = updatedTier.maxArea || Infinity;

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
    }

    const updatedTier = await prisma.areaPriceTier.update({
      where: { id: params.tierId },
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "UPDATE",
      tableName: "area_price_tiers",
      recordId: updatedTier.id,
      oldValues: oldTier,
      newValues: validation.data,
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: updatedTier });
  } catch (error) {
    console.error("Error updating area price tier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete tier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; tierId: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tier = await prisma.areaPriceTier.findUnique({
      where: { id: params.tierId },
    });

    if (!tier) {
      return NextResponse.json({ error: "Tier not found" }, { status: 404 });
    }

    if (tier.packageId !== params.id) {
      return NextResponse.json(
        { error: "Tier does not belong to this package" },
        { status: 400 }
      );
    }

    await prisma.areaPriceTier.delete({
      where: { id: params.tierId },
    });

    await createAuditLog({
      userId: user.id,
      action: "DELETE",
      tableName: "area_price_tiers",
      recordId: params.tierId,
      oldValues: tier,
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Tier deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting area price tier:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
