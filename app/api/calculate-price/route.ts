import { NextRequest, NextResponse } from "next/server";

interface CalculationRequest {
  firstName: string;
  familyName: string;
  mobileNumber: string;
  package: string;
  inspectionPurpose: string;
  city: string;
  neighborhood?: string;
  propertyAge: string;
  landArea: string;
  coveredArea: string;
}

interface CalculationResponse {
  price: number;
  basePrice: number;
  vatAmount: number;
  breakdown: {
    floorsCost: number;
    ageMultiplier: number;
    numberOfFloors: number;
  };
}

// Calculation logic based on the detailed formula
function calculateInspectionCost(
  data: CalculationRequest
): CalculationResponse {
  const coveredArea = parseFloat(data.coveredArea);
  const landArea = parseFloat(data.landArea);

  let basePrice = 0;
  let numberOfFloors = 0;

  // Case 1: Small properties (≤ 250 m²)
  if (coveredArea <= 250) {
    basePrice = 5000;
    numberOfFloors = 1;
  } else {
    // Case 2: Larger properties (> 250 m²)
    // Calculate number of floors
    const rawFloors = coveredArea / landArea;

    // Round to standard floor increments as per formula
    if (rawFloors <= 1.3) {
      numberOfFloors = rawFloors <= 1.1 ? 1.1 : 1.5;
    } else if (rawFloors <= 2.35) {
      numberOfFloors = rawFloors <= 2.2 ? 2.2 : 2.5;
    } else if (rawFloors <= 3.4) {
      numberOfFloors = rawFloors <= 3.3 ? 3.3 : 3.5;
    } else if (rawFloors <= 4.4) {
      numberOfFloors = 4.4;
    } else {
      numberOfFloors = Math.ceil(rawFloors);
    }

    // Base price calculation for properties > 250 m²
    basePrice = 5000; // Base for first floor

    // Calculate additional floors cost
    const additionalFloors = Math.max(0, numberOfFloors - 1);

    if (numberOfFloors <= 2) {
      // For up to 2 floors: add up to 5000 SAR (capped)
      const additionalCost = Math.min(additionalFloors * 9000, 5000);
      basePrice += additionalCost;
    } else {
      // For more than 2 floors:
      // - First additional floor costs up to 5000 SAR (capped at 5000)
      basePrice += 5000;
      // - Each additional floor beyond 2nd floor costs 750 SAR
      const floorsAboveTwo = numberOfFloors - 2;
      basePrice += floorsAboveTwo * 750;
    }
  }

  const basePriceBeforeAge = basePrice;

  // Property age adjustment
  const ageMultipliers: Record<string, number> = {
    "أقل من سنة": 0.95,
    "من 1 إلى 3 سنوات": 1.0,
    "من 3 إلى 5 سنوات": 1.05,
    "من 5 إلى 10 سنوات": 1.1,
    "أكثر من 10 سنوات": 1.15,
  };

  const ageMultiplier = ageMultipliers[data.propertyAge] || 1.0;
  basePrice *= ageMultiplier;

  // Calculate VAT (15%)
  const vatAmount = basePrice * 0.15;
  const priceWithVAT = basePrice + vatAmount;

  return {
    price: Math.round(priceWithVAT),
    basePrice: Math.round(basePrice),
    vatAmount: Math.round(vatAmount),
    breakdown: {
      floorsCost: Math.round(basePriceBeforeAge),
      ageMultiplier,
      numberOfFloors: Math.round(numberOfFloors * 10) / 10,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculationRequest = await request.json();

    // Validate required fields
    if (
      !body.firstName ||
      !body.familyName ||
      !body.mobileNumber ||
      !body.package ||
      !body.inspectionPurpose ||
      !body.city ||
      !body.propertyAge ||
      !body.landArea ||
      !body.coveredArea
    ) {
      return NextResponse.json(
        { error: "جميع الحقول المطلوبة يجب أن تكون مملوءة" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const landArea = parseFloat(body.landArea);
    const coveredArea = parseFloat(body.coveredArea);

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

    // Calculate the price
    const result = calculateInspectionCost(body);

    // Log the calculation for tracking (optional)
    console.log("Price calculation:", {
      customer: `${body.firstName} ${body.familyName}`,
      city: body.city,
      result: result.price,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error calculating price:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حساب السعر. يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
