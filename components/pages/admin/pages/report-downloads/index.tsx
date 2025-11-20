"use client";

import { useState, useCallback } from "react";
import { AdminHeader } from "@/components/layout/admin/header";
import { LoadingSpinner } from "@/components/layout/admin/loading-spinner";
import { DownloadsTable } from "./downloads-table";
import { useReportDownloads } from "@/hooks/pages/use-report-downloads";
import { useRouter } from "next/navigation";

export function ReportDownloadsPage() {
  const router = useRouter();
  const { downloads, loading, pagination, statusFilter } = useReportDownloads();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStatusUpdate = useCallback(() => {
    // Trigger a refresh by updating the key
    setRefreshKey((prev) => prev + 1);
    router.refresh();
  }, [router]);

  if (loading) {
    return <LoadingSpinner message="Loading report downloads..." />;
  }

  return (
    <>
      <AdminHeader
        title="Report Downloads"
        subtitle={`Total: ${pagination.total} downloads${
          statusFilter ? ` (Status: ${statusFilter})` : ""
        }`}
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push("/admin/dashboard"),
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DownloadsTable
          key={refreshKey}
          downloads={downloads}
          pagination={pagination}
          onStatusUpdate={handleStatusUpdate}
        />
      </main>
    </>
  );
}
