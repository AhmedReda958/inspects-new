"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CityForm } from "./city-form";
import { CityCard } from "./city-card";
import type { City, CityFormData } from "@/types/admin/locations";

interface CitiesTabProps {
  cities: City[];
  showCityForm: boolean;
  editingCity: City | null;
  cityFormData: CityFormData;
  setCityFormData: (data: CityFormData) => void;
  setShowCityForm: (show: boolean) => void;
  handleEditCity: (city: City) => void;
  handleCancelCity: () => void;
  handleCitySubmit: (e: React.FormEvent) => void;
  handleDeleteCity: (id: string) => void;
}

export function CitiesTab({
  cities,
  showCityForm,
  editingCity,
  cityFormData,
  setCityFormData,
  setShowCityForm,
  handleEditCity,
  handleCancelCity,
  handleCitySubmit,
  handleDeleteCity,
}: CitiesTabProps) {
  return (
    <>
      {showCityForm && (
        <CityForm
          editingCity={editingCity}
          formData={cityFormData}
          setFormData={setCityFormData}
          onSubmit={handleCitySubmit}
          onCancel={handleCancelCity}
        />
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowCityForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add City
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <CityCard
            key={city.id}
            city={city}
            onEdit={handleEditCity}
            onDelete={handleDeleteCity}
          />
        ))}
      </div>
    </>
  );
}
