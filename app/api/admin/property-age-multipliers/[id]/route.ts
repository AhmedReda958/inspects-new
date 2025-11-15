import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const multiplierSchema = z.object({
  ageRange: z.string().min(1).optional(),
  ageRangeEn: z.string().optional(),
  multiplier: z.number().positive().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = multiplierSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const oldMultiplier = await prisma.propertyAgeMultiplier.findUnique({
      where: { id },
    });

    if (!oldMultiplier) {
      return NextResponse.json({ error: "Multiplier not found" }, { status: 404 });
    }

    const updatedMultiplier = await prisma.propertyAgeMultiplier.update({
      where: { id },
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "UPDATE",
      tableName: "property_age_multipliers",
      recordId: updatedMultiplier.id,
      oldValues: oldMultiplier,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: updatedMultiplier });
  } catch (error) {
    console.error("Error updating property age multiplier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const multiplier = await prisma.propertyAgeMultiplier.findUnique({
      where: { id },
    });

    if (!multiplier) {
      return NextResponse.json({ error: "Multiplier not found" }, { status: 404 });
    }

    const deletedMultiplier = await prisma.propertyAgeMultiplier.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId: user.id,
      action: "DELETE",
      tableName: "property_age_multipliers",
      recordId: id,
      oldValues: multiplier,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: deletedMultiplier });
  } catch (error) {
    console.error("Error deleting property age multiplier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

