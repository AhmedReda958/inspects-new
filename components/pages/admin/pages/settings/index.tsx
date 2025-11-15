"use client";

import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/layout/admin/header";
import { LoadingSpinner } from "@/components/layout/admin/loading-spinner";
import { VatForm } from "./vat-form";
import { CalculationRulesForm } from "./calculation-rules-form";
import { useSettings } from "@/hooks/pages/use-settings";

export function SettingsPage() {
  const router = useRouter();
  const {
    loading,
    saving,
    vatData,
    error,
    vatForm,
    rulesForm,
    handleVatSubmit,
    handleRulesSubmit,
  } = useSettings();

  if (loading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  return (
    <>
      <AdminHeader
        title="Settings"
        subtitle="Manage system configuration"
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push("/admin/dashboard"),
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VatForm
            form={vatForm}
            vatData={vatData}
            saving={saving}
            onSubmit={handleVatSubmit}
          />
          <CalculationRulesForm
            form={rulesForm}
            saving={saving}
            onSubmit={handleRulesSubmit}
          />
        </div>
      </main>
    </>
  );
}

