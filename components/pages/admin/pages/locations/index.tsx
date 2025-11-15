"use client";

import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/layout/admin/header";
import { LoadingSpinner } from "@/components/layout/admin/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CitiesTab } from "./cities-tab";
import { NeighborhoodsTab } from "./neighborhoods-tab";
import { useLocations } from "@/hooks/pages/use-locations";

export function LocationsPage() {
  const router = useRouter();
  const {
    cities,
    levels,
    loading,
    activeTab,
    setActiveTab,
    showCityForm,
    setShowCityForm,
    showNeighborhoodForm,
    setShowNeighborhoodForm,
    editingCity,
    editingNeighborhood,
    cityFormData,
    setCityFormData,
    neighborhoodFormData,
    setNeighborhoodFormData,
    handleEditCity,
    handleEditNeighborhood,
    handleCancelCity,
    handleCancelNeighborhood,
    handleCitySubmit,
    handleNeighborhoodSubmit,
    handleDeleteCity,
    handleDeleteNeighborhood,
  } = useLocations();

  if (loading) {
    return <LoadingSpinner message="Loading locations..." />;
  }

  return (
    <>
      <AdminHeader
        title="Locations Management"
        subtitle="Manage cities and neighborhoods"
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
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
          </TabsList>

          <TabsContent value="cities">
            <CitiesTab
              cities={cities}
              showCityForm={showCityForm}
              editingCity={editingCity}
              cityFormData={cityFormData}
              setCityFormData={setCityFormData}
              setShowCityForm={setShowCityForm}
              handleEditCity={handleEditCity}
              handleCancelCity={handleCancelCity}
              handleCitySubmit={handleCitySubmit}
              handleDeleteCity={handleDeleteCity}
            />
          </TabsContent>

          <TabsContent value="neighborhoods">
            <NeighborhoodsTab
              cities={cities}
              levels={levels}
              showNeighborhoodForm={showNeighborhoodForm}
              editingNeighborhood={editingNeighborhood}
              neighborhoodFormData={neighborhoodFormData}
              setNeighborhoodFormData={setNeighborhoodFormData}
              setShowNeighborhoodForm={setShowNeighborhoodForm}
              handleEditNeighborhood={handleEditNeighborhood}
              handleCancelNeighborhood={handleCancelNeighborhood}
              handleNeighborhoodSubmit={handleNeighborhoodSubmit}
              handleDeleteNeighborhood={handleDeleteNeighborhood}
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
