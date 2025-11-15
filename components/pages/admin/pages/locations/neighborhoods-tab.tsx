"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NeighborhoodForm } from "./neighborhood-form";
import { NeighborhoodList } from "./neighborhood-list";
import type {
  City,
  Neighborhood,
  NeighborhoodFormData,
} from "@/types/admin/locations";

interface NeighborhoodsTabProps {
  cities: City[];
  showNeighborhoodForm: boolean;
  editingNeighborhood: Neighborhood | null;
  neighborhoodFormData: NeighborhoodFormData;
  setNeighborhoodFormData: (data: NeighborhoodFormData) => void;
  setShowNeighborhoodForm: (show: boolean) => void;
  handleEditNeighborhood: (neighborhood: Neighborhood) => void;
  handleCancelNeighborhood: () => void;
  handleNeighborhoodSubmit: (e: React.FormEvent) => void;
  handleDeleteNeighborhood: (id: string) => void;
}

export function NeighborhoodsTab({
  cities,
  showNeighborhoodForm,
  editingNeighborhood,
  neighborhoodFormData,
  setNeighborhoodFormData,
  setShowNeighborhoodForm,
  handleEditNeighborhood,
  handleCancelNeighborhood,
  handleNeighborhoodSubmit,
  handleDeleteNeighborhood,
}: NeighborhoodsTabProps) {
  return (
    <>
      {showNeighborhoodForm && (
        <NeighborhoodForm
          editingNeighborhood={editingNeighborhood}
          formData={neighborhoodFormData}
          setFormData={setNeighborhoodFormData}
          cities={cities}
          onSubmit={handleNeighborhoodSubmit}
          onCancel={handleCancelNeighborhood}
        />
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowNeighborhoodForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Neighborhood
        </Button>
      </div>

      <NeighborhoodList
        cities={cities}
        onEdit={handleEditNeighborhood}
        onDelete={handleDeleteNeighborhood}
      />
    </>
  );
}
