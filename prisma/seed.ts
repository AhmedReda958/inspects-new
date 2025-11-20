import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create default admin user
  console.log("Creating default admin user...");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.adminUser.upsert({
    where: { email: "ayman@inspectex.sa" },
    update: {},
    create: {
      email: "ayman@inspectex.sa",
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
    update: { percentage: 15.0 },
    create: {
      id: "default",
      percentage: 15.0,
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
      description:
        "Factor for calculating roofed area from land area and levels (0.6 * area * levels)",
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
      basePrice: 7000,
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
  const basicPackage = await prisma.package.findUnique({
    where: { name: "basic" },
  });
  const premiumPackage = await prisma.package.findUnique({
    where: { name: "premium" },
  });
  const vipPackage = await prisma.package.findUnique({
    where: { name: "vip" },
  });

  if (basicPackage && premiumPackage && vipPackage) {
    // Basic package - area tiers based on seed data
    const basicTiers = [
      { id: "basic-tier-1", minArea: 251, maxArea: null, pricePerSqm: 4 },
    ];

    for (const tier of basicTiers) {
      await prisma.areaPriceTier.upsert({
        where: { id: tier.id },
        update: {
          packageId: basicPackage.id,
          minArea: tier.minArea,
          maxArea: tier.maxArea,
          pricePerSqm: tier.pricePerSqm,
        },
        create: {
          ...tier,
          packageId: basicPackage.id,
        },
      });
    }

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
    {
      ageRange: "من 5-0 سنوات",
      ageRangeEn: "0 to 5 years",
      multiplier: 1.0,
      displayOrder: 1,
    },
    {
      ageRange: "أكثر من 5 وأقل أو يساوي 10",
      ageRangeEn: "More than 5 and less than or equal to 10",
      multiplier: 1.05,
      displayOrder: 2,
    },
    {
      ageRange: "أكثر من 10 وأقل أو يساوي 15",
      ageRangeEn: "More than 10 and less than or equal to 15",
      multiplier: 1.1,
      displayOrder: 3,
    },
    {
      ageRange: "أكثر من 15 سنه",
      ageRangeEn: "More than 15 years",
      multiplier: 1.25,
      displayOrder: 4,
    },
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
    {
      purpose: "قبل الشراء",
      purposeEn: "Before Purchase",
      multiplier: 1.0,
      displayOrder: 1,
    },
    {
      purpose: "قبل البيع",
      purposeEn: "Before Sale",
      multiplier: 0.95,
      displayOrder: 2,
    },
    {
      purpose: "صيانة دورية",
      purposeEn: "Periodic Maintenance",
      multiplier: 0.9,
      displayOrder: 3,
    },
    {
      purpose: "تقييم عقاري",
      purposeEn: "Property Evaluation",
      multiplier: 1.05,
      displayOrder: 4,
    },
    {
      purpose: "فحص ما بعد البناء",
      purposeEn: "Post-Construction Inspection",
      multiplier: 1.1,
      displayOrder: 5,
    },
  ];

  for (const purpose of purposeMultipliers) {
    await prisma.inspectionPurposeMultiplier.upsert({
      where: { purpose: purpose.purpose },
      update: purpose,
      create: purpose,
    });
  }
  console.log(
    `✓ ${purposeMultipliers.length} inspection purpose multipliers created`
  );

  // Create Neighborhood Levels
  console.log("Creating neighborhood levels...");
  const neighborhoodLevels = [
    {
      code: "A",
      name: "ممتاز",
      nameEn: "Premium",
      multiplier: 1.15,
      displayOrder: 1,
    },
    {
      code: "B",
      name: "جيد جداً",
      nameEn: "Above Average",
      multiplier: 1.12,
      displayOrder: 2,
    },
    {
      code: "C",
      name: "متوسط",
      nameEn: "Average",
      multiplier: 1.0,
      displayOrder: 3,
    },
    {
      code: "D",
      name: "أقل من المتوسط",
      nameEn: "Below Average",
      multiplier: 0.95,
      displayOrder: 4,
    },
  ];

  for (const level of neighborhoodLevels) {
    await prisma.neighborhoodLevel.upsert({
      where: { code: level.code },
      update: level,
      create: level,
    });
  }
  console.log(`✓ ${neighborhoodLevels.length} neighborhood levels created`);

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

  // Create Neighborhoods
  console.log("Creating neighborhoods...");

  // Get all cities
  const riyadh = await prisma.city.findUnique({ where: { name: "الرياض" } });
  const jeddah = await prisma.city.findUnique({ where: { name: "جدة" } });
  const makkah = await prisma.city.findUnique({
    where: { name: "مكة المكرمة" },
  });
  const taif = await prisma.city.findUnique({ where: { name: "الطائف" } });
  const dammam = await prisma.city.findUnique({ where: { name: "الدمام" } });
  const ahsa = await prisma.city.findUnique({ where: { name: "الأحساء" } });
  const jubail = await prisma.city.findUnique({ where: { name: "الجبيل" } });

  // Riyadh neighborhoods - Level 1 (multiplier 1.15)
  if (riyadh) {
    // Remove duplicates using Set
    const riyadhLevel1 = Array.from(
      new Set([
        "العليا",
        "الإزدهار",
        "الندى",
        "السلامة",
        "المعذر",
        "الصحافة",
        "المحمدية",
        "المروج",
        "جسر",
        "الرحمانية",
        "قرطبة",
        "العارض",
        "السفارات",
        "النفل",
        "عرقة",
        "العقيق",
        "النخيل",
        "الوادي",
        "الرائد",
        "الغدير",
        "الملقا",
        "الياسمين",
        "الورود",
        "الفلاح",
        "بريدة",
        "القصوان",
        "حطين",
        "الروضة",
        "الرمال",
        "المواسم",
        "الجنان",
        "القادسية",
        "الأموك",
        "غرناطة",
        "أشبلية",
        "الحمراء",
        "المعالي",
        "الخليج",
        "الملك",
        "القدس",
        "الأندلس",
        "النهضة",
        "العزيز",
        "الملك عبدالله",
        "الملك عيد الله",
        "الملك عيد العزيز",
      ])
    );

    const riyadhLevel2 = Array.from(
      new Set([
        "الورود",
        "الملك فهد",
        "المرسلات",
        "الظهرة",
        "المغرزات",
        "المصيف",
        "التعاون",
        "الإزدهار",
        "المعذر",
        "المحمدية",
        "الرحمانية",
        "الرائد",
        "النخيل",
      ])
    );

    const riyadhLevel3 = Array.from(
      new Set([
        "ثلاثم",
        "العمل",
        "الفاروق",
        "الوزارات",
        "الملز",
        "الضباط",
        "الصفا",
        "الزهراء",
        "القيوة",
        "الندوة",
        "المنار",
        "النظم",
        "الروابي",
        "الضبان",
        "السلام",
        "النسيم الغربي",
        "النسيم الشرقي",
        "الخزامى",
        "المهدية",
        "أم الحمام الغربي",
        "أم الحمام الشرقي",
        "صلاح الدين",
        "الملك عيد الله",
        "الملك عيد العزيز",
        "الأندلس",
        "النهضة",
        "المجمع",
        "الفوطة",
        "الرفيعة",
        "الهدا",
        "الحقيقة",
        "الحصا",
        "الوشام",
        "النموذجية",
        "المؤتمرات",
        "الحديدة",
        "أم الشم",
        "الجرادية",
        "الفاخرة",
        "علوشة",
        "الهجرة",
        "العليجا",
        "الوسا",
        "الغربية",
        "الدرهمية",
        "شمال",
        "السويد",
        "الغربي",
        "سلطانة",
        "الزهرة",
        "المروة",
        "الشفاء",
        "عواظ",
        "أحد",
        "الحزم",
        "نمار",
        "ديراب",
        "ظهرة نمار",
        "المصا",
        "المنصورية",
        "عوض",
        "العما",
        "النور",
        "الإسعا",
        "الجوهرة",
        "السعا",
        "هيت",
        "الكويتة",
        "المشا",
        "الود",
        "القرى",
        "الصنا",
        "الوسطا",
        "المعا",
        "الفصلية",
        "منفوحة",
        "المنصورة",
        "اللما",
        "السلا",
        "عتيقة",
        "اللطاحا",
        "العود",
        "المرقب",
        "العليلة",
        "طبية",
        "المصفا",
        "البضا",
        "الغنا",
      ])
    );

    // Create Level 1 neighborhoods (use level default multiplier)
    for (const name of riyadhLevel1) {
      if (name && name.trim().length > 0) {
        await prisma.neighborhood.upsert({
          where: { cityId_name: { cityId: riyadh.id, name: name.trim() } },
          update: {
            level: "A",
            levelCode: "A",
            multiplier: null,
            applyAboveArea: 500,
          },
          create: {
            cityId: riyadh.id,
            name: name.trim(),
            level: "A",
            levelCode: "A",
            multiplier: null,
            applyAboveArea: 500,
            displayOrder: 0,
          },
        });
      }
    }

    // Create Level 2 neighborhoods (use level default multiplier)
    for (const name of riyadhLevel2) {
      if (name && name.trim().length > 0) {
        await prisma.neighborhood.upsert({
          where: { cityId_name: { cityId: riyadh.id, name: name.trim() } },
          update: {
            level: "B",
            levelCode: "B",
            multiplier: null,
            applyAboveArea: 500,
          },
          create: {
            cityId: riyadh.id,
            name: name.trim(),
            level: "B",
            levelCode: "B",
            multiplier: null,
            applyAboveArea: 500,
            displayOrder: 0,
          },
        });
      }
    }

    // Create Level 3 neighborhoods (use level default multiplier)
    for (const name of riyadhLevel3) {
      if (name && name.trim().length > 0) {
        await prisma.neighborhood.upsert({
          where: { cityId_name: { cityId: riyadh.id, name: name.trim() } },
          update: {
            level: "C",
            levelCode: "C",
            multiplier: null,
            applyAboveArea: 500,
          },
          create: {
            cityId: riyadh.id,
            name: name.trim(),
            level: "C",
            levelCode: "C",
            multiplier: null,
            applyAboveArea: 500,
            displayOrder: 0,
          },
        });
      }
    }

    console.log(`✓ Neighborhoods created for Riyadh`);
  }

  // Jeddah neighborhoods
  if (jeddah) {
    const jeddahLevel1 = ["الروضة", "الزهراء", "الصحافة", "الرمال"];
    const jeddahLevel2 = ["الحمراء", "النعيم"];
    const jeddahLevel3 = ["البلد", "الشفاء", "المروة"];

    for (const name of jeddahLevel1) {
      await prisma.neighborhood.upsert({
        where: { cityId_name: { cityId: jeddah.id, name } },
        update: {
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
        },
        create: {
          cityId: jeddah.id,
          name,
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }

    for (const name of jeddahLevel2) {
      await prisma.neighborhood.upsert({
        where: { cityId_name: { cityId: jeddah.id, name } },
        update: {
          level: "B",
          levelCode: "B",
          multiplier: null,
          applyAboveArea: 500,
        },
        create: {
          cityId: jeddah.id,
          name,
          level: "B",
          levelCode: "B",
          multiplier: null,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }

    for (const name of jeddahLevel3) {
      await prisma.neighborhood.upsert({
        where: { cityId_name: { cityId: jeddah.id, name } },
        update: {
          level: "C",
          levelCode: "C",
          multiplier: null,
          applyAboveArea: 500,
        },
        create: {
          cityId: jeddah.id,
          name,
          level: "C",
          levelCode: "C",
          multiplier: null,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }

    console.log(`✓ Neighborhoods created for Jeddah`);
  }

  // Dammam neighborhoods
  if (dammam) {
    const dammamLevel1 = ["الفلاح", "الخليج", "الغدير", "النفل"];

    for (const name of dammamLevel1) {
      await prisma.neighborhood.upsert({
        where: { cityId_name: { cityId: dammam.id, name } },
        update: {
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
        },
        create: {
          cityId: dammam.id,
          name,
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }

    console.log(`✓ Neighborhoods created for Dammam`);
  }

  // Taif neighborhoods
  if (taif) {
    const taifLevel1 = ["العقيق", "الندى"];

    for (const name of taifLevel1) {
      await prisma.neighborhood.upsert({
        where: { cityId_name: { cityId: taif.id, name } },
        update: {
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
        },
        create: {
          cityId: taif.id,
          name,
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }

    console.log(`✓ Neighborhoods created for Taif`);
  }

  // Makkah neighborhoods
  if (makkah) {
    const makkahLevel1 = ["جسر", "القيعة"];

    for (const name of makkahLevel1) {
      await prisma.neighborhood.upsert({
        where: { cityId_name: { cityId: makkah.id, name } },
        update: {
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
        },
        create: {
          cityId: makkah.id,
          name,
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }

    console.log(`✓ Neighborhoods created for Makkah`);
  }

  // Ahsa neighborhoods
  if (ahsa) {
    const ahsaLevel1 = ["القصوان", "غرناطة", "الياسمين"];

    for (const name of ahsaLevel1) {
      await prisma.neighborhood.upsert({
        where: { cityId_name: { cityId: ahsa.id, name } },
        update: {
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
        },
        create: {
          cityId: ahsa.id,
          name,
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }

    console.log(`✓ Neighborhoods created for Ahsa`);
  }

  // Jubail neighborhoods
  if (jubail) {
    const jubailLevel1 = ["المصيف"];

    for (const name of jubailLevel1) {
      await prisma.neighborhood.upsert({
        where: { cityId_name: { cityId: jubail.id, name } },
        update: {
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
        },
        create: {
          cityId: jubail.id,
          name,
          level: "A",
          levelCode: "A",
          multiplier: null,
          applyAboveArea: 500,
          displayOrder: 0,
        },
      });
    }

    console.log(`✓ Neighborhoods created for Jubail`);
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
