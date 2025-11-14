import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const packageSchema = z.object({
  name: z.string().min(1).optional(),
  nameAr: z.string().min(1).optional(),
  description: z.string().optional(),
  basePrice: z.number().positive().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
});

// GET - Get single package
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pkg = await prisma.package.findUnique({
      where: { id: params.id },
      include: {
        areaPriceTiers: {
          where: { isActive: true },
          orderBy: { minArea: "asc" },
        },
      },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: pkg });
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update package
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
    const validation = packageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Get old values for audit
    const oldPackage = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (!oldPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const updatedPackage = await prisma.package.update({
      where: { id: params.id },
      data: validation.data,
    });

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: "UPDATE",
      tableName: "packages",
      recordId: updatedPackage.id,
      oldValues: oldPackage,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: updatedPackage });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete package
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get package before deletion for audit
    const pkg = await prisma.package.findUnique({
      where: { id: params.id },
    });

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Soft delete by setting isActive to false instead of hard delete
    const deletedPackage = await prisma.package.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: "DELETE",
      tableName: "packages",
      recordId: params.id,
      oldValues: pkg,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: deletedPackage });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

