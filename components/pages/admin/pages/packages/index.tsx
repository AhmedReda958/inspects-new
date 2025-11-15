"use client";

import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/layout/admin/header";
import { LoadingSpinner } from "@/components/layout/admin/loading-spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PackageForm } from "./package-form";
import { PackageCard } from "./package-card";
import { usePackages } from "@/hooks/pages/use-packages";

export function PackagesPage() {
  const router = useRouter();
  const {
    packages,
    loading,
    showForm,
    setShowForm,
    editingPackage,
    formData,
    setFormData,
    expandedPackages,
    showTierForm,
    editingTier,
    tierFormData,
    setTierFormData,
    handleEdit,
    handleCancel,
    handleSubmit,
    handleDelete,
    togglePackageExpanded,
    handleAddTier,
    handleEditTier,
    handleCancelTier,
    handleTierSubmit,
    handleDeleteTier,
  } = usePackages();

  if (loading) {
    return <LoadingSpinner message="Loading packages..." />;
  }

  return (
    <>
      <AdminHeader
        title="Packages Management"
        subtitle="Manage inspection packages and pricing"
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push("/admin/dashboard"),
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <PackageForm
            editingPackage={editingPackage}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}

        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              expanded={expandedPackages.has(pkg.id)}
              showTierForm={showTierForm}
              editingTier={editingTier}
              tierFormData={tierFormData}
              setTierFormData={setTierFormData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleExpanded={togglePackageExpanded}
              onAddTier={handleAddTier}
              onEditTier={handleEditTier}
              onCancelTier={handleCancelTier}
              onTierSubmit={handleTierSubmit}
              onDeleteTier={handleDeleteTier}
            />
          ))}
        </div>
      </main>
    </>
  );
}
