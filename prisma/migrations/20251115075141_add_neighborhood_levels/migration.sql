-- AlterTable
ALTER TABLE "neighborhoods" ADD COLUMN     "levelCode" TEXT,
ALTER COLUMN "multiplier" DROP NOT NULL;

-- CreateTable
CREATE TABLE "neighborhood_levels" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "multiplier" DECIMAL(5,4) NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "neighborhood_levels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "neighborhood_levels_code_key" ON "neighborhood_levels"("code");

-- CreateIndex
CREATE INDEX "neighborhood_levels_code_idx" ON "neighborhood_levels"("code");

-- CreateIndex
CREATE INDEX "neighborhoods_levelCode_idx" ON "neighborhoods"("levelCode");

-- AddForeignKey
ALTER TABLE "neighborhoods" ADD CONSTRAINT "neighborhoods_levelCode_fkey" FOREIGN KEY ("levelCode") REFERENCES "neighborhood_levels"("code") ON DELETE SET NULL ON UPDATE CASCADE;
