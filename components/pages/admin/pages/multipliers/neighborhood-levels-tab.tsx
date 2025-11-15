"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LevelForm } from "./level-form";
import { LevelCard } from "./level-card";
import type { NeighborhoodLevel, LevelFormData } from "@/types/admin/locations";

interface NeighborhoodLevelsTabProps {
  levels: NeighborhoodLevel[];
  showLevelForm: boolean;
  editingLevel: NeighborhoodLevel | null;
  levelFormData: LevelFormData;
  setLevelFormData: (data: LevelFormData) => void;
  setShowLevelForm: (show: boolean) => void;
  handleEditLevel: (level: NeighborhoodLevel) => void;
  handleCancelLevel: () => void;
  handleLevelSubmit: (e: React.FormEvent) => void;
  handleDeleteLevel: (id: string) => void;
}

export function NeighborhoodLevelsTab({
  levels,
  showLevelForm,
  editingLevel,
  levelFormData,
  setLevelFormData,
  setShowLevelForm,
  handleEditLevel,
  handleCancelLevel,
  handleLevelSubmit,
  handleDeleteLevel,
}: NeighborhoodLevelsTabProps) {
  return (
    <>
      {showLevelForm && (
        <LevelForm
          editing={!!editingLevel}
          formData={levelFormData}
          setFormData={setLevelFormData}
          onSubmit={handleLevelSubmit}
          onCancel={handleCancelLevel}
        />
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowLevelForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Neighborhood Level
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            onEdit={handleEditLevel}
            onDelete={handleDeleteLevel}
          />
        ))}
      </div>
    </>
  );
}


