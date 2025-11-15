"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MultiplierForm } from "./multiplier-form";
import { MultiplierCard } from "./multiplier-card";
import type { Multiplier, PurposeFormData } from "@/types/admin/multipliers";

interface InspectionPurposeTabProps {
  inspectionPurposes: Multiplier[];
  showPurposeForm: boolean;
  editingPurpose: Multiplier | null;
  purposeFormData: PurposeFormData;
  setPurposeFormData: (data: PurposeFormData) => void;
  setShowPurposeForm: (show: boolean) => void;
  handleEditPurpose: (multiplier: Multiplier) => void;
  handleCancelPurpose: () => void;
  handlePurposeSubmit: (e: React.FormEvent) => void;
  handleDeletePurpose: (id: string) => void;
}

export function InspectionPurposeTab({
  inspectionPurposes,
  showPurposeForm,
  editingPurpose,
  purposeFormData,
  setPurposeFormData,
  setShowPurposeForm,
  handleEditPurpose,
  handleCancelPurpose,
  handlePurposeSubmit,
  handleDeletePurpose,
}: InspectionPurposeTabProps) {
  return (
    <>
      {showPurposeForm && (
        <MultiplierForm
          type="purpose"
          editing={!!editingPurpose}
          formData={purposeFormData}
          setFormData={setPurposeFormData}
          onSubmit={handlePurposeSubmit}
          onCancel={handleCancelPurpose}
        />
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowPurposeForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Inspection Purpose
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspectionPurposes.map((purpose) => (
          <MultiplierCard
            key={purpose.id}
            multiplier={purpose}
            type="purpose"
            onEdit={handleEditPurpose}
            onDelete={handleDeletePurpose}
          />
        ))}
      </div>
    </>
  );
}

