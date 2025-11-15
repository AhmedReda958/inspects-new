"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useConfirm } from "@/hooks/use-confirm";
import type {
  Package,
  Tier,
  PackageFormData,
  TierFormData,
} from "@/types/admin/packages";

export function usePackages() {
  const router = useRouter();
  const { toast } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    nameAr: "",
    description: "",
    basePrice: "",
    isActive: true,
    displayOrder: 0,
  });
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(
    new Set()
  );
  const [showTierForm, setShowTierForm] = useState<string | null>(null);
  const [editingTier, setEditingTier] = useState<{
    packageId: string;
    tier: Tier;
  } | null>(null);
  const [tierFormData, setTierFormData] = useState<TierFormData>({
    minArea: "",
    maxArea: "",
    pricePerSqm: "",
    isActive: true,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    try {
      const response = await fetch("/api/admin/packages");
      if (!response.ok) throw new Error("Failed to fetch packages");

      const result = await response.json();
      if (result.success) {
        setPackages(result.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(pkg: Package) {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      nameAr: pkg.nameAr,
      description: pkg.description || "",
      basePrice: pkg.basePrice.toString(),
      isActive: pkg.isActive,
      displayOrder: pkg.displayOrder,
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingPackage(null);
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      basePrice: "",
      isActive: true,
      displayOrder: 0,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingPackage
        ? `/api/admin/packages/${editingPackage.id}`
        : "/api/admin/packages";
      const method = editingPackage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save package");
      }

      toast({
        title: editingPackage ? "تم التحديث بنجاح" : "تم الإنشاء بنجاح",
        description: editingPackage
          ? "تم تحديث الباقة بنجاح!"
          : "تم إنشاء الباقة بنجاح!",
        variant: "success",
      });
      handleCancel();
      fetchPackages();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حفظ الباقة",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(id: string) {
    const confirmed = await confirm("هل أنت متأكد من حذف هذه الباقة؟", {
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete package");

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف الباقة بنجاح!",
        variant: "success",
      });
      fetchPackages();
      router.refresh();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حذف الباقة",
        variant: "destructive",
      });
    }
  }

  function togglePackageExpanded(packageId: string) {
    const newExpanded = new Set(expandedPackages);
    if (newExpanded.has(packageId)) {
      newExpanded.delete(packageId);
    } else {
      newExpanded.add(packageId);
    }
    setExpandedPackages(newExpanded);
  }

  function handleAddTier(packageId: string) {
    setShowTierForm(packageId);
    setEditingTier(null);
    setTierFormData({
      minArea: "",
      maxArea: "",
      pricePerSqm: "",
      isActive: true,
    });
  }

  function handleEditTier(packageId: string, tier: Tier) {
    setEditingTier({ packageId, tier });
    setShowTierForm(packageId);
    setTierFormData({
      minArea: tier.minArea.toString(),
      maxArea: tier.maxArea?.toString() || "",
      pricePerSqm: tier.pricePerSqm.toString(),
      isActive: tier.isActive,
    });
  }

  function handleCancelTier() {
    setShowTierForm(null);
    setEditingTier(null);
    setTierFormData({
      minArea: "",
      maxArea: "",
      pricePerSqm: "",
      isActive: true,
    });
  }

  async function handleTierSubmit(e: React.FormEvent, packageId: string) {
    e.preventDefault();
    try {
      const url = editingTier
        ? `/api/admin/packages/${packageId}/tiers/${editingTier.tier.id}`
        : `/api/admin/packages/${packageId}/tiers`;
      const method = editingTier ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minArea: parseFloat(tierFormData.minArea),
          maxArea: tierFormData.maxArea
            ? parseFloat(tierFormData.maxArea)
            : null,
          pricePerSqm: parseFloat(tierFormData.pricePerSqm),
          isActive: tierFormData.isActive,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save tier");
      }

      toast({
        title: editingTier ? "تم التحديث بنجاح" : "تم الإنشاء بنجاح",
        description: editingTier
          ? "تم تحديث المستوى بنجاح!"
          : "تم إنشاء المستوى بنجاح!",
        variant: "success",
      });
      handleCancelTier();
      fetchPackages();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حفظ المستوى",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteTier(packageId: string, tierId: string) {
    const confirmed = await confirm("هل أنت متأكد من حذف هذا المستوى؟", {
      variant: "destructive",
    });
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/packages/${packageId}/tiers/${tierId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete tier");

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المستوى بنجاح!",
        variant: "success",
      });
      fetchPackages();
      router.refresh();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "فشل في حذف المستوى",
        variant: "destructive",
      });
    }
  }

  return {
    packages,
    loading,
    showForm,
    setShowForm,
    editingPackage,
    formData,
    setFormData,
    expandedPackages,
    showTierForm,
    editingTier,
    tierFormData,
    setTierFormData,
    handleEdit,
    handleCancel,
    handleSubmit,
    handleDelete,
    togglePackageExpanded,
    handleAddTier,
    handleEditTier,
    handleCancelTier,
    handleTierSubmit,
    handleDeleteTier,
    ConfirmDialog,
  };
}
