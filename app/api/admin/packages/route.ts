import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const packageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  description: z.string().optional(),
  basePrice: z.number().positive("Base price must be positive"),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

// GET - List all packages
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const packages = await prisma.package.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        areaPriceTiers: {
          orderBy: { minArea: "asc" },
        },
        _count: {
          select: { submissions: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new package
export async function POST(request: NextRequest) {
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

    const newPackage = await prisma.package.create({
      data: validation.data,
    });

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: "CREATE",
      tableName: "packages",
      recordId: newPackage.id,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: newPackage }, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

