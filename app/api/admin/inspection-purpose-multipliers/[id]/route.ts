import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const multiplierSchema = z.object({
  purpose: z.string().min(1).optional(),
  purposeEn: z.string().optional(),
  multiplier: z.number().positive().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const oldMultiplier = await prisma.inspectionPurposeMultiplier.findUnique({
      where: { id: params.id },
    });

    if (!oldMultiplier) {
      return NextResponse.json({ error: "Multiplier not found" }, { status: 404 });
    }

    const updatedMultiplier = await prisma.inspectionPurposeMultiplier.update({
      where: { id: params.id },
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "UPDATE",
      tableName: "inspection_purpose_multipliers",
      recordId: updatedMultiplier.id,
      oldValues: oldMultiplier,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: updatedMultiplier });
  } catch (error) {
    console.error("Error updating inspection purpose multiplier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const multiplier = await prisma.inspectionPurposeMultiplier.findUnique({
      where: { id: params.id },
    });

    if (!multiplier) {
      return NextResponse.json({ error: "Multiplier not found" }, { status: 404 });
    }

    const deletedMultiplier = await prisma.inspectionPurposeMultiplier.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId: user.id,
      action: "DELETE",
      tableName: "inspection_purpose_multipliers",
      recordId: params.id,
      oldValues: multiplier,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: deletedMultiplier });
  } catch (error) {
    console.error("Error deleting inspection purpose multiplier:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

