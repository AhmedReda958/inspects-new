import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const levelSchema = z.object({
  code: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  multiplier: z.number().positive().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const level = await prisma.neighborhoodLevel.findUnique({
      where: { id },
    });

    if (!level) {
      return NextResponse.json({ error: "Level not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: level });
  } catch (error) {
    console.error("Error fetching neighborhood level:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const validation = levelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const oldLevel = await prisma.neighborhoodLevel.findUnique({
      where: { id },
    });

    if (!oldLevel) {
      return NextResponse.json({ error: "Level not found" }, { status: 404 });
    }

    const updatedLevel = await prisma.neighborhoodLevel.update({
      where: { id },
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "UPDATE",
      tableName: "neighborhood_levels",
      recordId: updatedLevel.id,
      oldValues: oldLevel,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: updatedLevel });
  } catch (error) {
    console.error("Error updating neighborhood level:", error);
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
    const level = await prisma.neighborhoodLevel.findUnique({
      where: { id },
    });

    if (!level) {
      return NextResponse.json({ error: "Level not found" }, { status: 404 });
    }

    const deletedLevel = await prisma.neighborhoodLevel.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId: user.id,
      action: "DELETE",
      tableName: "neighborhood_levels",
      recordId: id,
      oldValues: level,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: deletedLevel });
  } catch (error) {
    console.error("Error deleting neighborhood level:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


