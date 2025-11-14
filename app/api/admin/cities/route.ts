import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const citySchema = z.object({
  name: z.string().min(1, "City name is required"),
  nameEn: z.string().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cities = await prisma.city.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        neighborhoods: true,
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json({ success: true, data: cities });
  } catch (error) {
    console.error("Error fetching cities:", error);
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
    const validation = citySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const newCity = await prisma.city.create({
      data: validation.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "CREATE",
      tableName: "cities",
      recordId: newCity.id,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: newCity }, { status: 201 });
  } catch (error) {
    console.error("Error creating city:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

