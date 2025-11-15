import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { getAuthUser, createAuditLog } from "@/lib/auth";

const vatSchema = z.object({
  percentage: z.number().min(0).max(100, "VAT percentage must be between 0 and 100"),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vatSetting = await prisma.vatSetting.findFirst({
      where: { isActive: true },
      orderBy: { effectiveFrom: "desc" },
    });

    return NextResponse.json({ success: true, data: vatSetting });
  } catch (error) {
    console.error("Error fetching VAT setting:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = vatSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    // Deactivate old VAT settings
    await prisma.vatSetting.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new VAT setting
    const newVatSetting = await prisma.vatSetting.create({
      data: {
        percentage: validation.data.percentage,
        isActive: true,
        effectiveFrom: new Date(),
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "UPDATE",
      tableName: "vat_settings",
      recordId: newVatSetting.id,
      newValues: validation.data,
      ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || undefined,
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json({ success: true, data: newVatSetting });
  } catch (error) {
    console.error("Error updating VAT setting:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

