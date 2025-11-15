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
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};

    // Add status filter if provided
    if (status) {
      where.status = status;
    }

    // Add search filter if provided
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { familyName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { mobileNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    // If both status and search are provided, we need to combine them with AND
    if (status && search) {
      const searchConditions = {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { familyName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { mobileNumber: { contains: search, mode: "insensitive" } },
        ],
      };
      where.AND = [
        { status },
        searchConditions,
      ];
      delete where.status;
      delete where.OR;
    }

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

