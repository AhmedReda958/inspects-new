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
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};

    // Add search filter if provided
    if (search) {
      where.phoneNumber = { contains: search, mode: "insensitive" };
    }

    // Add status filter if provided
    if (status) {
      where.status = status;
    }

    // If both status and search are provided, we need to combine them with AND
    if (status && search) {
      const searchCondition = {
        phoneNumber: { contains: search, mode: "insensitive" },
      };
      where.AND = [{ status }, searchCondition];
      delete where.phoneNumber;
      delete where.status;
    }

    const [downloads, total] = await Promise.all([
      prisma.reportDownload.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.reportDownload.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: downloads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching report downloads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

