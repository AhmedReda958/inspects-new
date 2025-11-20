import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Public endpoint to fetch package prices (no auth required)
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      select: {
        name: true,
        basePrice: true,
      },
      orderBy: { displayOrder: "asc" },
    });

    // Map database package names to content.ts IDs
    const packageMapping: Record<string, string> = {
      basic: "visual",
      premium: "comprehensive",
      vip: "advanced",
    };

    const mappedPackages = packages.map((pkg) => ({
      id: packageMapping[pkg.name] || pkg.name,
      name: pkg.name,
      basePrice: Number(pkg.basePrice),
    }));

    return NextResponse.json({ success: true, data: mappedPackages });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
