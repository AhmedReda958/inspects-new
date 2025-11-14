import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create default admin user
  console.log("Creating default admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const adminUser = await prisma.adminUser.upsert({
    where: { email: "admin@inspectex.com" },
    update: {},
    create: {
      email: "admin@inspectex.com",
      password: hashedPassword,
      name: "Admin User",
      role: "superadmin",
      isActive: true,
    },
  });
  console.log(`✓ Admin user created: ${adminUser.email}`);

  // Create VAT Setting
  console.log("Creating VAT setting...");
  await prisma.vatSetting.upsert({
    where: { id: "default" },
    update: { percentage: 15.00 },
    create: {
      id: "default",
      percentage: 15.00,
      isActive: true,
    },
  });
  console.log("✓ VAT setting created (15%)");

  // Create Calculation Rules
  console.log("Creating calculation rules...");
  const rules = [
    {
      key: "base_area_threshold",
      value: "250",
      valueType: "number",
      description: "Area threshold for fixed pricing vs per-sqm pricing",
      category: "thresholds",
    },
    {
      key: "neighborhood_multiplier_threshold",
      value: "500",
      valueType: "number",
      description: "Minimum area for applying neighborhood multiplier",
      category: "thresholds",
    },
    {
      key: "roofed_area_calculation_factor",
      value: "0.6",
      valueType: "number",
      description: "Factor for calculating roofed area from land area and levels (0.6 * area * levels)",
      category: "general",
    },
  ];

  for (const rule of rules) {
    await prisma.calculationRule.upsert({
      where: { key: rule.key },
      update: rule,
      create: rule,
    });
  }
  console.log(`✓ ${rules.length} calculation rules created`);

  // Create Packages
  console.log("Creating packages...");
  const packages = [
    {
      name: "basic",
      nameAr: "الفحص التأسيسي",
      description: "فحص بصري عام",
      basePrice: 1970,
      displayOrder: 1,
    },
    {
      name: "premium",
      nameAr: "الفحص المتكامل",
      description: "فحص دقيق شامل",
      basePrice: 7430,
      displayOrder: 2,
    },
    {
      name: "vip",
      nameAr: "الفحص العميق",
      description: "فحص هندسي عميق",
      basePrice: 12420,
      displayOrder: 3,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { name: pkg.name },
      update: pkg,
      create: pkg,
    });
  }
  console.log(`✓ ${packages.length} packages created`);

  // Create Area Price Tiers
  console.log("Creating area price tiers...");
  const basicPackage = await prisma.package.findUnique({ where: { name: "basic" } });
  const premiumPackage = await prisma.package.findUnique({ where: { name: "premium" } });
  const vipPackage = await prisma.package.findUnique({ where: { name: "vip" } });

  if (basicPackage && premiumPackage && vipPackage) {
    // Basic package - fixed 4 SAR per sqm above 250
    await prisma.areaPriceTier.upsert({
      where: { id: "basic-tier-1" },
      update: {
        packageId: basicPackage.id,
        minArea: 251,
        maxArea: null,
        pricePerSqm: 4,
      },
      create: {
        id: "basic-tier-1",
        packageId: basicPackage.id,
        minArea: 251,
        maxArea: null,
        pricePerSqm: 4,
      },
    });

    // Premium package tiers
    const premiumTiers = [
      { id: "premium-tier-1", minArea: 251, maxArea: 500, pricePerSqm: 25 },
      { id: "premium-tier-2", minArea: 501, maxArea: 1000, pricePerSqm: 22 },
      { id: "premium-tier-3", minArea: 1001, maxArea: null, pricePerSqm: 20 },
    ];

    for (const tier of premiumTiers) {
      await prisma.areaPriceTier.upsert({
        where: { id: tier.id },
        update: {
          packageId: premiumPackage.id,
          minArea: tier.minArea,
          maxArea: tier.maxArea,
          pricePerSqm: tier.pricePerSqm,
        },
        create: {
          ...tier,
          packageId: premiumPackage.id,
        },
      });
    }

    // VIP package tiers
    const vipTiers = [
      { id: "vip-tier-1", minArea: 251, maxArea: 500, pricePerSqm: 35 },
      { id: "vip-tier-2", minArea: 501, maxArea: 1000, pricePerSqm: 32 },
      { id: "vip-tier-3", minArea: 1001, maxArea: null, pricePerSqm: 30 },
    ];

    for (const tier of vipTiers) {
      await prisma.areaPriceTier.upsert({
        where: { id: tier.id },
        update: {
          packageId: vipPackage.id,
          minArea: tier.minArea,
          maxArea: tier.maxArea,
          pricePerSqm: tier.pricePerSqm,
        },
        create: {
          ...tier,
          packageId: vipPackage.id,
        },
      });
    }

    console.log("✓ Area price tiers created");
  }

  // Create Property Age Multipliers
  console.log("Creating property age multipliers...");
  const ageMultipliers = [
    { ageRange: "أقل من سنة", ageRangeEn: "Less than 1 year", multiplier: 0.95, displayOrder: 1 },
    { ageRange: "من 1 إلى 3 سنوات", ageRangeEn: "1 to 3 years", multiplier: 1.0, displayOrder: 2 },
    { ageRange: "من 3 إلى 5 سنوات", ageRangeEn: "3 to 5 years", multiplier: 1.05, displayOrder: 3 },
    { ageRange: "من 5 إلى 10 سنوات", ageRangeEn: "5 to 10 years", multiplier: 1.1, displayOrder: 4 },
    { ageRange: "أكثر من 10 سنوات", ageRangeEn: "More than 10 years", multiplier: 1.15, displayOrder: 5 },
  ];

  for (const age of ageMultipliers) {
    await prisma.propertyAgeMultiplier.upsert({
      where: { ageRange: age.ageRange },
      update: age,
      create: age,
    });
  }
  console.log(`✓ ${ageMultipliers.length} property age multipliers created`);

  // Create Inspection Purpose Multipliers
  console.log("Creating inspection purpose multipliers...");
  const purposeMultipliers = [
    { purpose: "قبل الشراء", purposeEn: "Before Purchase", multiplier: 1.0, displayOrder: 1 },
    { purpose: "قبل البيع", purposeEn: "Before Sale", multiplier: 0.95, displayOrder: 2 },
    { purpose: "صيانة دورية", purposeEn: "Periodic Maintenance", multiplier: 0.9, displayOrder: 3 },
    { purpose: "تقييم عقاري", purposeEn: "Property Evaluation", multiplier: 1.05, displayOrder: 4 },
    { purpose: "فحص ما بعد البناء", purposeEn: "Post-Construction Inspection", multiplier: 1.1, displayOrder: 5 },
  ];

  for (const purpose of purposeMultipliers) {
    await prisma.inspectionPurposeMultiplier.upsert({
      where: { purpose: purpose.purpose },
      update: purpose,
      create: purpose,
    });
  }
  console.log(`✓ ${purposeMultipliers.length} inspection purpose multipliers created`);

  // Create Cities
  console.log("Creating cities...");
  const cities = [
    { name: "الرياض", nameEn: "Riyadh", displayOrder: 1 },
    { name: "جدة", nameEn: "Jeddah", displayOrder: 2 },
    { name: "مكة المكرمة", nameEn: "Makkah", displayOrder: 3 },
    { name: "الطائف", nameEn: "Taif", displayOrder: 4 },
    { name: "الدمام", nameEn: "Dammam", displayOrder: 5 },
    { name: "الأحساء", nameEn: "Al-Ahsa", displayOrder: 6 },
    { name: "الجبيل", nameEn: "Jubail", displayOrder: 7 },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name: city.name },
      update: city,
      create: city,
    });
  }
  console.log(`✓ ${cities.length} cities created`);

  // Create Sample Neighborhoods for Riyadh
  console.log("Creating neighborhoods for Riyadh...");
  const riyadh = await prisma.city.findUnique({ where: { name: "الرياض" } });
  
  if (riyadh) {
    const neighborhoods = [
      // Level A - Premium neighborhoods (1.15 multiplier)
      { name: "الملقا", level: "A", multiplier: 1.15 },
      { name: "الملك عبدالله", level: "A", multiplier: 1.15 },
      { name: "النرجس", level: "A", multiplier: 1.15 },
      { name: "الياسمين", level: "A", multiplier: 1.15 },
      
      // Level B - Above average (1.10 multiplier)
      { name: "الروضة", level: "B", multiplier: 1.10 },
      { name: "العليا", level: "B", multiplier: 1.10 },
      { name: "الورود", level: "B", multiplier: 1.10 },
      { name: "غرناطة", level: "B", multiplier: 1.10 },
      
      // Level C - Average (1.00 multiplier)
      { name: "النسيم", level: "C", multiplier: 1.00 },
      { name: "الخالدية", level: "C", multiplier: 1.00 },
      { name: "المروج", level: "C", multiplier: 1.00 },
      { name: "اليرموك", level: "C", multiplier: 1.00 },
      
      // Level D - Below average (0.95 multiplier)
      { name: "الشفا", level: "D", multiplier: 0.95 },
      { name: "البديعة", level: "D", multiplier: 0.95 },
      { name: "الديرة", level: "D", multiplier: 0.95 },
    ];

    for (const neighborhood of neighborhoods) {
      await prisma.neighborhood.create({
        data: {
          cityId: riyadh.id,
          name: neighborhood.name,
          level: neighborhood.level,
          multiplier: neighborhood.multiplier,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }
    console.log(`✓ ${neighborhoods.length} neighborhoods created for Riyadh`);
  }

  // Create sample neighborhoods for other cities
  console.log("Creating neighborhoods for other cities...");
  const jeddah = await prisma.city.findUnique({ where: { name: "جدة" } });
  if (jeddah) {
    const jeddahNeighborhoods = [
      { name: "الروضة", level: "A", multiplier: 1.15 },
      { name: "الزهراء", level: "A", multiplier: 1.15 },
      { name: "الحمراء", level: "B", multiplier: 1.10 },
      { name: "النعيم", level: "C", multiplier: 1.00 },
      { name: "البلد", level: "D", multiplier: 0.95 },
    ];

    for (const neighborhood of jeddahNeighborhoods) {
      await prisma.neighborhood.create({
        data: {
          cityId: jeddah.id,
          name: neighborhood.name,
          level: neighborhood.level,
          multiplier: neighborhood.multiplier,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }
    console.log(`✓ ${jeddahNeighborhoods.length} neighborhoods created for Jeddah`);
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

