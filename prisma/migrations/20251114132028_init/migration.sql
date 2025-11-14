-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "tableName" TEXT NOT NULL,
    "recordId" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neighborhoods" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "level" TEXT NOT NULL,
    "multiplier" DECIMAL(5,4) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "applyAboveArea" INTEGER NOT NULL DEFAULT 500,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "neighborhoods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "area_price_tiers" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "minArea" DECIMAL(10,2) NOT NULL,
    "maxArea" DECIMAL(10,2),
    "pricePerSqm" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "area_price_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_age_multipliers" (
    "id" TEXT NOT NULL,
    "ageRange" TEXT NOT NULL,
    "ageRangeEn" TEXT,
    "multiplier" DECIMAL(5,4) NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_age_multipliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_purpose_multipliers" (
    "id" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "purposeEn" TEXT,
    "multiplier" DECIMAL(5,4) NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inspection_purpose_multipliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculation_rules" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "valueType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calculation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vat_settings" (
    "id" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vat_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calculator_submissions" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT,
    "cityId" TEXT,
    "neighborhoodId" TEXT,
    "landArea" DECIMAL(10,2) NOT NULL,
    "coveredArea" DECIMAL(10,2) NOT NULL,
    "numberOfLevels" INTEGER,
    "packageId" TEXT,
    "propertyAgeId" TEXT,
    "inspectionPurposeId" TEXT,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "priceBeforeVat" DECIMAL(10,2) NOT NULL,
    "vatAmount" DECIMAL(10,2) NOT NULL,
    "finalPrice" DECIMAL(10,2) NOT NULL,
    "calculationBreakdown" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "assignedTo" TEXT,
    "followUpDate" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calculator_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_notifications" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_tableName_idx" ON "audit_logs"("tableName");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "packages_name_key" ON "packages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_key" ON "cities"("name");

-- CreateIndex
CREATE INDEX "neighborhoods_cityId_idx" ON "neighborhoods"("cityId");

-- CreateIndex
CREATE INDEX "neighborhoods_level_idx" ON "neighborhoods"("level");

-- CreateIndex
CREATE UNIQUE INDEX "neighborhoods_cityId_name_key" ON "neighborhoods"("cityId", "name");

-- CreateIndex
CREATE INDEX "area_price_tiers_packageId_idx" ON "area_price_tiers"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "property_age_multipliers_ageRange_key" ON "property_age_multipliers"("ageRange");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_purpose_multipliers_purpose_key" ON "inspection_purpose_multipliers"("purpose");

-- CreateIndex
CREATE UNIQUE INDEX "calculation_rules_key_key" ON "calculation_rules"("key");

-- CreateIndex
CREATE INDEX "calculator_submissions_status_idx" ON "calculator_submissions"("status");

-- CreateIndex
CREATE INDEX "calculator_submissions_createdAt_idx" ON "calculator_submissions"("createdAt");

-- CreateIndex
CREATE INDEX "calculator_submissions_cityId_idx" ON "calculator_submissions"("cityId");

-- CreateIndex
CREATE INDEX "calculator_submissions_packageId_idx" ON "calculator_submissions"("packageId");

-- CreateIndex
CREATE INDEX "lead_notifications_submissionId_idx" ON "lead_notifications"("submissionId");

-- CreateIndex
CREATE INDEX "lead_notifications_status_idx" ON "lead_notifications"("status");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "admin_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_price_tiers" ADD CONSTRAINT "area_price_tiers_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_submissions" ADD CONSTRAINT "calculator_submissions_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_submissions" ADD CONSTRAINT "calculator_submissions_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "neighborhoods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_submissions" ADD CONSTRAINT "calculator_submissions_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_submissions" ADD CONSTRAINT "calculator_submissions_propertyAgeId_fkey" FOREIGN KEY ("propertyAgeId") REFERENCES "property_age_multipliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calculator_submissions" ADD CONSTRAINT "calculator_submissions_inspectionPurposeId_fkey" FOREIGN KEY ("inspectionPurposeId") REFERENCES "inspection_purpose_multipliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_notifications" ADD CONSTRAINT "lead_notifications_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "calculator_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
