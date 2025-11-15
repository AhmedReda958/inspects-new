import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const citySchema = z.object({
  name: z.string().min(1).optional(),
  nameEn: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
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
    const city = await prisma.city.findUnique({
      where: { id },
      include: { neighborhoods: true },
    });

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: city });
  } catch (error) {
    console.error("Error fetching city:", error);
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
    const validation = citySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const oldCity = await prisma.city.findUnique({
      where: { id },
    });

    if (!oldCity) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const updatedCity = await prisma.city.update({
      where: { id },
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "UPDATE",
      tableName: "cities",
      recordId: updatedCity.id,
      oldValues: oldCity,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: updatedCity });
  } catch (error) {
    console.error("Error updating city:", error);
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
    const city = await prisma.city.findUnique({
      where: { id },
    });

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const deletedCity = await prisma.city.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId: user.id,
      action: "DELETE",
      tableName: "cities",
      recordId: id,
      oldValues: city,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: deletedCity });
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

