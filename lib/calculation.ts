import prisma from "./db";
import { Decimal } from "@prisma/client/runtime/library";

export interface CalculationInput {
  firstName: string;
  familyName: string;
  mobileNumber: string;
  email?: string;
  packageName: string; // "basic", "premium", "vip"
  propertyAgeRange: string;
  inspectionPurpose: string;
  cityName: string;
  neighborhoodName?: string;
  landArea: number;
  coveredArea: number;
  numberOfLevels?: number;
}

export interface CalculationResult {
  basePrice: number;
  priceBeforeVat: number;
  vatAmount: number;
  finalPrice: number;
  breakdown: {
    step1_baseCalculation: {
      coveredArea: number;
      packageBasePrice: number;
      exceedsThreshold: boolean;
      areaAboveThreshold?: number;
      pricePerSqm?: number;
      calculatedPrice: number;
    };
    step2_ageMultiplier: {
      ageRange: string;
      multiplier: number;
      priceAfterAge: number;
    };
    step3_purposeMultiplier: {
      purpose: string;
      multiplier: number;
      priceAfterPurpose: number;
    };
    step4_neighborhoodMultiplier?: {
      neighborhood: string;
      level: string;
      multiplier: number;
      applied: boolean;
      multiplierSource?: "custom" | "level";
      reason?: string;
      priceAfterNeighborhood: number;
    };
    step5_vat: {
      percentage: number;
      vatAmount: number;
      finalPrice: number;
    };
  };
}

/**
 * Calculate inspection cost based on user input and database configuration
 */
export async function calculateInspectionCost(
  input: CalculationInput
): Promise<CalculationResult> {
  // 1. Fetch package
  const packageData = await prisma.package.findUnique({
    where: { name: input.packageName, isActive: true },
    include: { areaPriceTiers: { where: { isActive: true } } },
  });

  if (!packageData) {
    throw new Error(`Package "${input.packageName}" not found or inactive`);
  }

  // 2. Fetch calculation rules
  const baseAreaThreshold = await getCalculationRule(
    "base_area_threshold",
    250
  );
  const neighborhoodThreshold = await getCalculationRule(
    "neighborhood_multiplier_threshold",
    500
  );
  const basicPackageExcessAreaPrice = await getCalculationRule(
    "basic_package_excess_area_price",
    4
  );

  // 3. Fetch property age multiplier
  const ageMultiplierData = await prisma.propertyAgeMultiplier.findUnique({
    where: { ageRange: input.propertyAgeRange, isActive: true },
  });

  if (!ageMultiplierData) {
    throw new Error(
      `Property age range "${input.propertyAgeRange}" not found or inactive`
    );
  }

  // 4. Fetch inspection purpose multiplier
  const purposeMultiplierData =
    await prisma.inspectionPurposeMultiplier.findUnique({
      where: { purpose: input.inspectionPurpose, isActive: true },
    });

  if (!purposeMultiplierData) {
    throw new Error(
      `Inspection purpose "${input.inspectionPurpose}" not found or inactive`
    );
  }

  // 5. Fetch neighborhood if provided
  let neighborhoodData = null;
  if (input.neighborhoodName) {
    const city = await prisma.city.findUnique({
      where: { name: input.cityName, isActive: true },
    });

    if (city) {
      neighborhoodData = await prisma.neighborhood.findFirst({
        where: {
          cityId: city.id,
          name: input.neighborhoodName,
          isActive: true,
        },
      });
    }
  }

  // 6. Fetch VAT setting
  const vatSetting = await prisma.vatSetting.findFirst({
    where: { isActive: true },
    orderBy: { effectiveFrom: "desc" },
  });

  const vatPercentage = vatSetting ? Number(vatSetting.percentage) : 15;

  // ============ CALCULATION STEPS ============

  // STEP 1: Base Price Calculation
  let basePrice: number;
  let exceedsThreshold = false;
  let areaAboveThreshold: number | undefined;
  let pricePerSqm: number | undefined;

  if (input.coveredArea <= baseAreaThreshold) {
    // Fixed base price for areas <= threshold (e.g., 250m²)
    basePrice = Number(packageData.basePrice);
  } else {
    // Calculate based on area tiers
    exceedsThreshold = true;
    areaAboveThreshold = input.coveredArea - baseAreaThreshold;

    // Find appropriate tier
    const tier = packageData.areaPriceTiers.find((t) => {
      const minArea = Number(t.minArea);
      const maxArea = t.maxArea ? Number(t.maxArea) : Infinity;
      return input.coveredArea >= minArea && input.coveredArea <= maxArea;
    });

    if (!tier) {
      throw new Error(`No price tier found for area ${input.coveredArea}m²`);
    }

    pricePerSqm = Number(tier.pricePerSqm);
    basePrice = input.coveredArea * pricePerSqm;
  }

  const step1Result = {
    coveredArea: input.coveredArea,
    packageBasePrice: Number(packageData.basePrice),
    exceedsThreshold,
    areaAboveThreshold,
    pricePerSqm,
    calculatedPrice: basePrice,
  };

  // STEP 2: Apply Property Age Multiplier
  const ageMultiplier = Number(ageMultiplierData.multiplier);
  const priceAfterAge = basePrice * ageMultiplier;

  const step2Result = {
    ageRange: input.propertyAgeRange,
    multiplier: ageMultiplier,
    priceAfterAge,
  };

  // STEP 3: Apply Inspection Purpose Multiplier
  const purposeMultiplier = Number(purposeMultiplierData.multiplier);
  const priceAfterPurpose = priceAfterAge * purposeMultiplier;

  const step3Result = {
    purpose: input.inspectionPurpose,
    multiplier: purposeMultiplier,
    priceAfterPurpose,
  };

  // STEP 4: Apply Neighborhood Multiplier (only if area > threshold, e.g., 500m²)
  let priceAfterNeighborhood = priceAfterPurpose;
  let step4Result: CalculationResult["breakdown"]["step4_neighborhoodMultiplier"];

  if (neighborhoodData) {
    const shouldApplyNeighborhood = input.coveredArea > neighborhoodThreshold;

    if (shouldApplyNeighborhood) {
      // Use custom multiplier if provided, otherwise fetch level multiplier
      let neighborhoodMultiplier: number;
      let multiplierSource: "custom" | "level" = "custom";

      if (neighborhoodData.multiplier !== null) {
        neighborhoodMultiplier = Number(neighborhoodData.multiplier);
        multiplierSource = "custom";
      } else {
        // Fetch level multiplier
        const levelData = await prisma.neighborhoodLevel.findUnique({
          where: { code: neighborhoodData.level, isActive: true },
        });

        if (!levelData) {
          throw new Error(
            `Neighborhood level "${neighborhoodData.level}" not found or inactive`
          );
        }

        neighborhoodMultiplier = Number(levelData.multiplier);
        multiplierSource = "level";
      }

      priceAfterNeighborhood = priceAfterPurpose * neighborhoodMultiplier;

      step4Result = {
        neighborhood: input.neighborhoodName!,
        level: neighborhoodData.level,
        multiplier: neighborhoodMultiplier,
        applied: true,
        multiplierSource,
        priceAfterNeighborhood,
      };
    } else {
      // Determine multiplier for display even if not applied
      let displayMultiplier: number;
      let multiplierSource: "custom" | "level" = "custom";

      if (neighborhoodData.multiplier !== null) {
        displayMultiplier = Number(neighborhoodData.multiplier);
        multiplierSource = "custom";
      } else {
        const levelData = await prisma.neighborhoodLevel.findUnique({
          where: { code: neighborhoodData.level, isActive: true },
        });

        if (levelData) {
          displayMultiplier = Number(levelData.multiplier);
          multiplierSource = "level";
        } else {
          displayMultiplier = 1.0;
        }
      }

      step4Result = {
        neighborhood: input.neighborhoodName!,
        level: neighborhoodData.level,
        multiplier: displayMultiplier,
        applied: false,
        multiplierSource,
        reason: `Neighborhood multiplier only applies to areas above ${neighborhoodThreshold}m²`,
        priceAfterNeighborhood: priceAfterPurpose,
      };
    }
  }

  // STEP 5: Calculate VAT
  const priceBeforeVat = priceAfterNeighborhood;
  const vatAmount = priceBeforeVat * (vatPercentage / 100);
  const finalPrice = priceBeforeVat + vatAmount;

  const step5Result = {
    percentage: vatPercentage,
    vatAmount: Math.round(vatAmount),
    finalPrice: Math.round(finalPrice),
  };

  // ============ RETURN RESULT ============
  return {
    basePrice: Math.round(basePrice),
    priceBeforeVat: Math.round(priceBeforeVat),
    vatAmount: Math.round(vatAmount),
    finalPrice: Math.round(finalPrice),
    breakdown: {
      step1_baseCalculation: step1Result,
      step2_ageMultiplier: step2Result,
      step3_purposeMultiplier: step3Result,
      step4_neighborhoodMultiplier: step4Result,
      step5_vat: step5Result,
    },
  };
}

/**
 * Get calculation rule value
 */
async function getCalculationRule(
  key: string,
  defaultValue: number
): Promise<number> {
  const rule = await prisma.calculationRule.findUnique({
    where: { key, isActive: true },
  });

  if (!rule) {
    return defaultValue;
  }

  return Number(rule.value);
}

/**
 * Save calculator submission to database
 */
export async function saveCalculatorSubmission(
  input: CalculationInput,
  result: CalculationResult,
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }
) {
  // Find related IDs
  const packageData = await prisma.package.findUnique({
    where: { name: input.packageName },
  });

  const cityData = await prisma.city.findUnique({
    where: { name: input.cityName },
  });

  const neighborhoodData =
    input.neighborhoodName && cityData
      ? await prisma.neighborhood.findFirst({
          where: { cityId: cityData.id, name: input.neighborhoodName },
        })
      : null;

  const ageData = await prisma.propertyAgeMultiplier.findUnique({
    where: { ageRange: input.propertyAgeRange },
  });

  const purposeData = await prisma.inspectionPurposeMultiplier.findUnique({
    where: { purpose: input.inspectionPurpose },
  });

  // Create submission
  const submission = await prisma.calculatorSubmission.create({
    data: {
      firstName: input.firstName,
      familyName: input.familyName,
      mobileNumber: input.mobileNumber,
      email: input.email,
      cityId: cityData?.id,
      neighborhoodId: neighborhoodData?.id,
      landArea: input.landArea,
      coveredArea: input.coveredArea,
      numberOfLevels: input.numberOfLevels,
      packageId: packageData?.id,
      propertyAgeId: ageData?.id,
      inspectionPurposeId: purposeData?.id,
      basePrice: result.basePrice,
      priceBeforeVat: result.priceBeforeVat,
      vatAmount: result.vatAmount,
      finalPrice: result.finalPrice,
      calculationBreakdown: result.breakdown as any,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      referrer: metadata?.referrer,
      utmSource: metadata?.utmSource,
      utmMedium: metadata?.utmMedium,
      utmCampaign: metadata?.utmCampaign,
      status: "new",
    },
  });

  return submission;
}
