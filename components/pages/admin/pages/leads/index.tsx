"use client";

import { AdminHeader } from "@/components/layout/admin/header";
import { LoadingSpinner } from "@/components/layout/admin/loading-spinner";
import { LeadsTable } from "./leads-table";
import { useLeads } from "@/hooks/pages/use-leads";
import { useRouter } from "next/navigation";

export function LeadsPage() {
  const router = useRouter();
  const { leads, loading, pagination, statusFilter } = useLeads();

  if (loading) {
    return <LoadingSpinner message="Loading leads..." />;
  }

  return (
    <>
      <AdminHeader
        title="Leads Management"
        subtitle={`Total: ${pagination.total} leads${
          statusFilter ? ` (Status: ${statusFilter})` : ""
        }`}
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push("/admin/dashboard"),
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LeadsTable leads={leads} />
      </main>
    </>
  );
}
