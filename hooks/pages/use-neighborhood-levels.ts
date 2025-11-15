"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useConfirm } from "@/hooks/use-confirm";
import type { NeighborhoodLevel, LevelFormData } from "@/types/admin/locations";

export function useNeighborhoodLevels() {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();
  const [levels, setLevels] = useState<NeighborhoodLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [editingLevel, setEditingLevel] = useState<NeighborhoodLevel | null>(
    null
  );
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

      toast({
        title: editingLevel ? "تم التحديث بنجاح" : "تم الإنشاء بنجاح",
        description: editingLevel
          ? "تم تحديث المستوى بنجاح!"
          : "تم إنشاء المستوى بنجاح!",
        variant: "success",
      });
      handleCancelLevel();
      fetchLevels();
    } catch (error) {
      toast({
        title: "خطأ",
        description:
          error instanceof Error ? error.message : "فشل في حفظ المستوى",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteLevel(id: string) {
    const confirmed = await confirm("هل أنت متأكد من حذف هذا المستوى؟", {
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/neighborhood-levels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete level");

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المستوى بنجاح!",
        variant: "success",
      });
      fetchLevels();
      router.refresh();
    } catch (error) {
      toast({
        title: "خطأ",
        description:
          error instanceof Error ? error.message : "فشل في حذف المستوى",
        variant: "destructive",
      });
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
    ConfirmDialog,
  };
}
