import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const neighborhoodSchema = z.object({
  name: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  level: z.string().min(1).optional(),
  multiplier: z.number().positive().optional(),
  isActive: z.boolean().optional(),
  applyAboveArea: z.number().int().optional(),
  displayOrder: z.number().int().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: params.id },
      include: { city: true },
    });

    if (!neighborhood) {
      return NextResponse.json({ error: "Neighborhood not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: neighborhood });
  } catch (error) {
    console.error("Error fetching neighborhood:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    const validation = neighborhoodSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const oldNeighborhood = await prisma.neighborhood.findUnique({
      where: { id: params.id },
    });

    if (!oldNeighborhood) {
      return NextResponse.json({ error: "Neighborhood not found" }, { status: 404 });
    }

    const updatedNeighborhood = await prisma.neighborhood.update({
      where: { id: params.id },
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "UPDATE",
      tableName: "neighborhoods",
      recordId: updatedNeighborhood.id,
      oldValues: oldNeighborhood,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: updatedNeighborhood });
  } catch (error) {
    console.error("Error updating neighborhood:", error);
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

    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: params.id },
    });

    if (!neighborhood) {
      return NextResponse.json({ error: "Neighborhood not found" }, { status: 404 });
    }

    const deletedNeighborhood = await prisma.neighborhood.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId: user.id,
      action: "DELETE",
      tableName: "neighborhoods",
      recordId: params.id,
      oldValues: neighborhood,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: deletedNeighborhood });
  } catch (error) {
    console.error("Error deleting neighborhood:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

