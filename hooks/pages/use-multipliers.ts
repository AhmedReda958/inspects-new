"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useConfirm } from "@/hooks/use-confirm";
import type {
  Multiplier,
  AgeFormData,
  PurposeFormData,
} from "@/types/admin/multipliers";

export function useMultipliers() {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();
  const [propertyAges, setPropertyAges] = useState<Multiplier[]>([]);
  const [inspectionPurposes, setInspectionPurposes] = useState<Multiplier[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("property-age");
  const [showAgeForm, setShowAgeForm] = useState(false);
  const [showPurposeForm, setShowPurposeForm] = useState(false);
  const [editingAge, setEditingAge] = useState<Multiplier | null>(null);
  const [editingPurpose, setEditingPurpose] = useState<Multiplier | null>(null);
  const [ageFormData, setAgeFormData] = useState<AgeFormData>({
    ageRange: "",
    ageRangeEn: "",
    multiplier: "1.00",
    displayOrder: 0,
    isActive: true,
  });
  const [purposeFormData, setPurposeFormData] = useState<PurposeFormData>({
    purpose: "",
    purposeEn: "",
    multiplier: "1.00",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchMultipliers();
  }, []);

  async function fetchMultipliers() {
    try {
      const [agesResponse, purposesResponse] = await Promise.all([
        fetch("/api/admin/property-age-multipliers"),
        fetch("/api/admin/inspection-purpose-multipliers"),
      ]);

      if (!agesResponse.ok || !purposesResponse.ok) {
        throw new Error("Failed to fetch multipliers");
      }

      const agesResult = await agesResponse.json();
      const purposesResult = await purposesResponse.json();

      if (agesResult.success) {
        setPropertyAges(agesResult.data);
      }
      if (purposesResult.success) {
        setInspectionPurposes(purposesResult.data);
      }
    } catch (error) {
      console.error("Error fetching multipliers:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEditAge(multiplier: Multiplier) {
    setEditingAge(multiplier);
    setAgeFormData({
      ageRange: multiplier.ageRange || "",
      ageRangeEn: multiplier.ageRangeEn || "",
      multiplier: multiplier.multiplier.toString(),
      displayOrder: multiplier.displayOrder,
      isActive: multiplier.isActive,
    });
    setShowAgeForm(true);
  }

  function handleEditPurpose(multiplier: Multiplier) {
    setEditingPurpose(multiplier);
    setPurposeFormData({
      purpose: multiplier.purpose || "",
      purposeEn: multiplier.purposeEn || "",
      multiplier: multiplier.multiplier.toString(),
      displayOrder: multiplier.displayOrder,
      isActive: multiplier.isActive,
    });
    setShowPurposeForm(true);
  }

  function handleCancelAge() {
    setShowAgeForm(false);
    setEditingAge(null);
    setAgeFormData({
      ageRange: "",
      ageRangeEn: "",
      multiplier: "1.00",
      displayOrder: 0,
      isActive: true,
    });
  }

  function handleCancelPurpose() {
    setShowPurposeForm(false);
    setEditingPurpose(null);
    setPurposeFormData({
      purpose: "",
      purposeEn: "",
      multiplier: "1.00",
      displayOrder: 0,
      isActive: true,
    });
  }

  async function handleAgeSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingAge
        ? `/api/admin/property-age-multipliers/${editingAge.id}`
        : "/api/admin/property-age-multipliers";
      const method = editingAge ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...ageFormData,
          multiplier: parseFloat(ageFormData.multiplier),
          isActive: ageFormData.isActive,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save multiplier");
      }

      toast({
        title: editingAge ? "تم التحديث بنجاح" : "تم الإنشاء بنجاح",
        description: editingAge
          ? "تم تحديث المضاعف بنجاح!"
          : "تم إنشاء المضاعف بنجاح!",
        variant: "success",
      });
      handleCancelAge();
      fetchMultipliers();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حفظ المضاعف",
        variant: "destructive",
      });
    }
  }

  async function handlePurposeSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingPurpose
        ? `/api/admin/inspection-purpose-multipliers/${editingPurpose.id}`
        : "/api/admin/inspection-purpose-multipliers";
      const method = editingPurpose ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...purposeFormData,
          multiplier: parseFloat(purposeFormData.multiplier),
          isActive: purposeFormData.isActive,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save multiplier");
      }

      toast({
        title: editingPurpose ? "تم التحديث بنجاح" : "تم الإنشاء بنجاح",
        description: editingPurpose
          ? "تم تحديث المضاعف بنجاح!"
          : "تم إنشاء المضاعف بنجاح!",
        variant: "success",
      });
      handleCancelPurpose();
      fetchMultipliers();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حفظ المضاعف",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteAge(id: string) {
    const confirmed = await confirm("هل أنت متأكد من حذف هذا المضاعف؟", {
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/property-age-multipliers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete multiplier");

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المضاعف بنجاح!",
        variant: "success",
      });
      fetchMultipliers();
      router.refresh();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حذف المضاعف",
        variant: "destructive",
      });
    }
  }

  async function handleDeletePurpose(id: string) {
    const confirmed = await confirm("هل أنت متأكد من حذف هذا المضاعف؟", {
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/inspection-purpose-multipliers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete multiplier");

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المضاعف بنجاح!",
        variant: "success",
      });
      fetchMultipliers();
      router.refresh();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حذف المضاعف",
        variant: "destructive",
      });
    }
  }

  return {
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
    ConfirmDialog,
  };
}
