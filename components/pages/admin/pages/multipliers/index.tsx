"use client";

import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/layout/admin/header";
import { LoadingSpinner } from "@/components/layout/admin/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyAgeTab } from "./property-age-tab";
import { InspectionPurposeTab } from "./inspection-purpose-tab";
import { NeighborhoodLevelsTab } from "./neighborhood-levels-tab";
import { useMultipliers } from "@/hooks/pages/use-multipliers";
import { useNeighborhoodLevels } from "@/hooks/pages/use-neighborhood-levels";

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

  const {
    levels,
    loading: levelsLoading,
    showLevelForm,
    setShowLevelForm,
    editingLevel,
    levelFormData,
    setLevelFormData,
    handleEditLevel,
    handleCancelLevel,
    handleLevelSubmit,
    handleDeleteLevel,
  } = useNeighborhoodLevels();

  if (loading || levelsLoading) {
    return <LoadingSpinner message="Loading multipliers..." />;
  }

  return (
    <>
      <AdminHeader
        title="Multipliers Management"
        subtitle="Manage property age, inspection purpose, and neighborhood level multipliers"
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
            <TabsTrigger value="neighborhood-levels">
              Neighborhood Levels
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

          <TabsContent value="neighborhood-levels">
            <NeighborhoodLevelsTab
              levels={levels}
              showLevelForm={showLevelForm}
              editingLevel={editingLevel}
              levelFormData={levelFormData}
              setLevelFormData={setLevelFormData}
              setShowLevelForm={setShowLevelForm}
              handleEditLevel={handleEditLevel}
              handleCancelLevel={handleCancelLevel}
              handleLevelSubmit={handleLevelSubmit}
              handleDeleteLevel={handleDeleteLevel}
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}

