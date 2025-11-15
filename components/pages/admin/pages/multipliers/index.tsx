"use client";

import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/layout/admin/header";
import { LoadingSpinner } from "@/components/layout/admin/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyAgeTab } from "./property-age-tab";
import { InspectionPurposeTab } from "./inspection-purpose-tab";
import { useMultipliers } from "@/hooks/pages/use-multipliers";

export function MultipliersPage() {
  const router = useRouter();
  const {
    propertyAges,
    inspectionPurposes,
    loading,
    activeTab,
    setActiveTab,
    showAgeForm,
    setShowAgeForm,
    showPurposeForm,
    setShowPurposeForm,
    editingAge,
    editingPurpose,
    ageFormData,
    setAgeFormData,
    purposeFormData,
    setPurposeFormData,
    handleEditAge,
    handleEditPurpose,
    handleCancelAge,
    handleCancelPurpose,
    handleAgeSubmit,
    handlePurposeSubmit,
    handleDeleteAge,
    handleDeletePurpose,
  } = useMultipliers();

  if (loading) {
    return <LoadingSpinner message="Loading multipliers..." />;
  }

  return (
    <>
      <AdminHeader
        title="Multipliers Management"
        subtitle="Manage property age and inspection purpose multipliers"
        action={{
          label: "Back to Dashboard",
          onClick: () => router.push("/admin/dashboard"),
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="property-age">Property Age</TabsTrigger>
            <TabsTrigger value="inspection-purpose">
              Inspection Purpose
            </TabsTrigger>
          </TabsList>

          <TabsContent value="property-age">
            <PropertyAgeTab
              propertyAges={propertyAges}
              showAgeForm={showAgeForm}
              editingAge={editingAge}
              ageFormData={ageFormData}
              setAgeFormData={setAgeFormData}
              setShowAgeForm={setShowAgeForm}
              handleEditAge={handleEditAge}
              handleCancelAge={handleCancelAge}
              handleAgeSubmit={handleAgeSubmit}
              handleDeleteAge={handleDeleteAge}
            />
          </TabsContent>

          <TabsContent value="inspection-purpose">
            <InspectionPurposeTab
              inspectionPurposes={inspectionPurposes}
              showPurposeForm={showPurposeForm}
              editingPurpose={editingPurpose}
              purposeFormData={purposeFormData}
              setPurposeFormData={setPurposeFormData}
              setShowPurposeForm={setShowPurposeForm}
              handleEditPurpose={handleEditPurpose}
              handleCancelPurpose={handleCancelPurpose}
              handlePurposeSubmit={handlePurposeSubmit}
              handleDeletePurpose={handleDeletePurpose}
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

