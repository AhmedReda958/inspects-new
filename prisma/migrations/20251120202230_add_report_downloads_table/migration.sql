-- CreateTable
CREATE TABLE "report_downloads" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_downloads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_downloads_phoneNumber_idx" ON "report_downloads"("phoneNumber");

-- CreateIndex
CREATE INDEX "report_downloads_status_idx" ON "report_downloads"("status");

-- CreateIndex
CREATE INDEX "report_downloads_createdAt_idx" ON "report_downloads"("createdAt");
