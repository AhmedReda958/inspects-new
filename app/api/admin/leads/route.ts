import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [submissions, total] = await Promise.all([
      prisma.calculatorSubmission.findMany({
        where,
        include: {
          city: true,
          neighborhood: true,
          package: true,
          propertyAge: true,
          inspectionPurpose: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.calculatorSubmission.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

