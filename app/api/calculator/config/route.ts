import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Fetch all active configuration data
    const [
      packages,
      cities,
      propertyAges,
      inspectionPurposes,
    ] = await Promise.all([
      prisma.package.findMany({
        where: { isActive: true },
        select: {
          name: true,
          nameAr: true,
          description: true,
          displayOrder: true,
        },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.city.findMany({
        where: { isActive: true },
        select: {
          name: true,
          nameEn: true,
          displayOrder: true,
          neighborhoods: {
            where: { isActive: true },
            select: {
              name: true,
              nameEn: true,
              level: true,
              displayOrder: true,
            },
            orderBy: { displayOrder: "asc" },
          },
        },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.propertyAgeMultiplier.findMany({
        where: { isActive: true },
        select: {
          ageRange: true,
          ageRangeEn: true,
          displayOrder: true,
        },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.inspectionPurposeMultiplier.findMany({
        where: { isActive: true },
        select: {
          purpose: true,
          purposeEn: true,
          displayOrder: true,
        },
        orderBy: { displayOrder: "asc" },
      }),
    ]);

    // Transform cities data to include neighborhoods mapping
    const citiesData = cities.map((city) => ({
      name: city.name,
      nameEn: city.nameEn,
      neighborhoods: city.neighborhoods.map((n) => n.name),
    }));

    // Create city-neighborhood mapping
    const cityNeighborhoods: Record<string, string[]> = {};
    cities.forEach((city) => {
      cityNeighborhoods[city.name] = city.neighborhoods.map((n) => n.name);
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          packages: packages.map((p) => ({
            value: p.name,
            label: p.nameAr,
            description: p.description,
          })),
          cities: citiesData.map((c) => ({
            value: c.name,
            label: c.name,
            labelEn: c.nameEn,
          })),
          cityNeighborhoods,
          propertyAges: propertyAges.map((a) => ({
            value: a.ageRange,
            label: a.ageRange,
            labelEn: a.ageRangeEn,
          })),
          inspectionPurposes: inspectionPurposes.map((p) => ({
            value: p.purpose,
            label: p.purpose,
            labelEn: p.purposeEn,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching calculator config:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 }
    );
  }
}

