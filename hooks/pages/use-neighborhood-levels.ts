"use client";

import { useEffect, useState } from "react";
import type {
  NeighborhoodLevel,
  LevelFormData,
} from "@/types/admin/locations";

export function useNeighborhoodLevels() {
  const [levels, setLevels] = useState<NeighborhoodLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [editingLevel, setEditingLevel] = useState<NeighborhoodLevel | null>(null);
  const [levelFormData, setLevelFormData] = useState<LevelFormData>({
    code: "",
    name: "",
    nameEn: "",
    multiplier: "1.00",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchLevels();
  }, []);

  async function fetchLevels() {
    try {
      const response = await fetch("/api/admin/neighborhood-levels");

      if (!response.ok) {
        throw new Error("Failed to fetch levels");
      }

      const result = await response.json();

      if (result.success) {
        setLevels(result.data);
      }
    } catch (error) {
      console.error("Error fetching neighborhood levels:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEditLevel(level: NeighborhoodLevel) {
    setEditingLevel(level);
    setLevelFormData({
      code: level.code,
      name: level.name,
      nameEn: level.nameEn || "",
      multiplier: level.multiplier.toString(),
      displayOrder: level.displayOrder,
      isActive: level.isActive,
    });
    setShowLevelForm(true);
  }

  function handleCancelLevel() {
    setShowLevelForm(false);
    setEditingLevel(null);
    setLevelFormData({
      code: "",
      name: "",
      nameEn: "",
      multiplier: "1.00",
      displayOrder: 0,
      isActive: true,
    });
  }

  async function handleLevelSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingLevel
        ? `/api/admin/neighborhood-levels/${editingLevel.id}`
        : "/api/admin/neighborhood-levels";
      const method = editingLevel ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...levelFormData,
          multiplier: parseFloat(levelFormData.multiplier),
          isActive: levelFormData.isActive,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save level");
      }

      alert(
        editingLevel
          ? "Level updated successfully!"
          : "Level created successfully!"
      );
      handleCancelLevel();
      fetchLevels();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to save level"
      );
    }
  }

  async function handleDeleteLevel(id: string) {
    if (!confirm("Are you sure you want to delete this level?")) return;

    try {
      const response = await fetch(`/api/admin/neighborhood-levels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete level");

      alert("Level deleted successfully!");
      fetchLevels();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete level"
      );
    }
  }

  return {
    levels,
    loading,
    showLevelForm,
    setShowLevelForm,
    editingLevel,
    levelFormData,
    setLevelFormData,
    handleEditLevel,
    handleCancelLevel,
    handleLevelSubmit,
    handleDeleteLevel,
  };
}


