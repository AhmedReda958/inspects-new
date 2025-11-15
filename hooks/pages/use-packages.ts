"use client";

import { useEffect, useState } from "react";
import type {
  Package,
  Tier,
  PackageFormData,
  TierFormData,
} from "@/types/admin/packages";

export function usePackages() {
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

      alert(
        editingPackage
          ? "Package updated successfully!"
          : "Package created successfully!"
      );
      handleCancel();
      fetchPackages();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save package");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete package");

      alert("Package deleted successfully!");
      fetchPackages();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete package"
      );
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

      alert(
        editingTier
          ? "Tier updated successfully!"
          : "Tier created successfully!"
      );
      handleCancelTier();
      fetchPackages();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save tier");
    }
  }

  async function handleDeleteTier(packageId: string, tierId: string) {
    if (!confirm("Are you sure you want to delete this tier?")) return;

    try {
      const response = await fetch(
        `/api/admin/packages/${packageId}/tiers/${tierId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete tier");

      alert("Tier deleted successfully!");
      fetchPackages();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete tier");
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
  };
}
