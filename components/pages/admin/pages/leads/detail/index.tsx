"use client";

import { useRouter, useParams } from "next/navigation";
import { AdminHeader } from "@/components/layout/admin/header";
import { LoadingSpinner } from "@/components/layout/admin/loading-spinner";
import { Button } from "@/components/ui/button";
import { CustomerInfo } from "./customer-info";
import { PropertyInfo } from "./property-info";
import { CalculationBreakdown } from "./calculation-breakdown";
import { LeadManagementForm } from "./lead-management-form";
import { useLeadDetail } from "@/hooks/pages/use-lead-detail";

export function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;
  const { lead, loading, saving, error, form, handleSubmit } =
    useLeadDetail(leadId);

  if (loading) {
    return <LoadingSpinner message="Loading lead details..." />;
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Lead not found</p>
          <Button onClick={() => router.push("/admin/leads")} className="mt-4">
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminHeader
        title="Lead Details"
        subtitle={`${lead.firstName} ${lead.familyName}`}
        action={{
          label: "Back to Leads",
          onClick: () => router.push("/admin/leads"),
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CustomerInfo lead={lead} />
            <PropertyInfo lead={lead} />
            <CalculationBreakdown lead={lead} />
          </div>

          <div className="space-y-6">
            <LeadManagementForm
              lead={lead}
              form={form}
              saving={saving}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
    </>
  );
}

