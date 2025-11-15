"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MultiplierForm } from "./multiplier-form";
import { MultiplierCard } from "./multiplier-card";
import type { Multiplier, AgeFormData } from "@/types/admin/multipliers";

interface PropertyAgeTabProps {
  propertyAges: Multiplier[];
  showAgeForm: boolean;
  editingAge: Multiplier | null;
  ageFormData: AgeFormData;
  setAgeFormData: (data: AgeFormData) => void;
  setShowAgeForm: (show: boolean) => void;
  handleEditAge: (multiplier: Multiplier) => void;
  handleCancelAge: () => void;
  handleAgeSubmit: (e: React.FormEvent) => void;
  handleDeleteAge: (id: string) => void;
}

export function PropertyAgeTab({
  propertyAges,
  showAgeForm,
  editingAge,
  ageFormData,
  setAgeFormData,
  setShowAgeForm,
  handleEditAge,
  handleCancelAge,
  handleAgeSubmit,
  handleDeleteAge,
}: PropertyAgeTabProps) {
  return (
    <>
      {showAgeForm && (
        <MultiplierForm
          type="age"
          editing={!!editingAge}
          formData={ageFormData}
          setFormData={setAgeFormData}
          onSubmit={handleAgeSubmit}
          onCancel={handleCancelAge}
        />
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowAgeForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property Age
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyAges.map((age) => (
          <MultiplierCard
            key={age.id}
            multiplier={age}
            type="age"
            onEdit={handleEditAge}
            onDelete={handleDeleteAge}
          />
        ))}
      </div>
    </>
  );
}

