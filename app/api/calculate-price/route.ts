import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  calculateInspectionCost,
  saveCalculatorSubmission,
} from "@/lib/calculation";

// Validation schema
const calculationSchema = z.object({
  firstName: z.string().min(2, "الاسم الأول يجب أن يكون حرفين على الأقل"),
  familyName: z.string().min(2, "اسم العائلة يجب أن يكون حرفين على الأقل"),
  mobileNumber: z
    .string()
    .regex(
      /^((05|5)\d{8}|01[1-7]\d{7}|9200\d{5}|800\d{6})$/,
      "رقم جوال غير صحيح"
    ),
  email: z
    .string()
    .email("بريد إلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  package: z.string().min(1, "يرجى اختيار الباقة"),
  inspectionPurpose: z.string().min(1, "يرجى اختيار الهدف من الفحص"),
  city: z.string().min(1, "يرجى اختيار المدينة"),
  neighborhood: z.string().optional(),
  propertyAge: z.string().min(1, "يرجى اختيار عمر العقار"),
  landArea: z.string().min(1, "يرجى إدخال مساحة الأرض"),
  numberOfLevels: z.string().optional(),
  coveredArea: z.string().min(1, "يرجى إدخال مسطحات البناء"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = calculationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "خطأ في البيانات المدخلة",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Parse numeric fields
    const landArea = parseFloat(data.landArea);
    const coveredArea = parseFloat(data.coveredArea);
    const numberOfLevels = data.numberOfLevels
      ? parseInt(data.numberOfLevels)
      : undefined;

    if (
      isNaN(landArea) ||
      isNaN(coveredArea) ||
      landArea <= 0 ||
      coveredArea <= 0
    ) {
      return NextResponse.json(
        { error: "يجب أن تكون المساحات أرقاماً صحيحة وأكبر من صفر" },
        { status: 400 }
      );
    }

    if (coveredArea > landArea * 10) {
      return NextResponse.json(
        { error: "مساحة البناء غير منطقية بالنسبة لمساحة الأرض" },
        { status: 400 }
      );
    }

    // Prepare calculation input
    const calculationInput = {
      firstName: data.firstName,
      familyName: data.familyName,
      mobileNumber: data.mobileNumber,
      email: data.email || undefined,
      packageName: data.package,
      propertyAgeRange: data.propertyAge,
      inspectionPurpose: data.inspectionPurpose,
      cityName: data.city,
      neighborhoodName: data.neighborhood,
      landArea,
      coveredArea,
      numberOfLevels,
    };

    // Calculate the price
    const result = await calculateInspectionCost(calculationInput);

    // Extract metadata
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    const referrer = request.headers.get("referer") || undefined;

    // Extract UTM parameters from URL if available
    const url = new URL(request.url);
    const utmSource = url.searchParams.get("utm_source") || undefined;
    const utmMedium = url.searchParams.get("utm_medium") || undefined;
    const utmCampaign = url.searchParams.get("utm_campaign") || undefined;

    // Save submission to database
    await saveCalculatorSubmission(calculationInput, result, {
      ipAddress,
      userAgent,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    // Return calculation result
    return NextResponse.json(
      {
        success: true,
        price: result.finalPrice,
        basePrice: result.basePrice,
        priceBeforeVat: result.priceBeforeVat,
        vatAmount: result.vatAmount,
        breakdown: result.breakdown,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calculating price:", error);

    // Check if it's a validation error from our calculation logic
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء حساب السعر. يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
