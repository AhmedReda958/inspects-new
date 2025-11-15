"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Package {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  basePrice: number;
  isActive: boolean;
  displayOrder: number;
  areaPriceTiers: Array<{
    id: string;
    minArea: number;
    maxArea?: number;
    pricePerSqm: number;
    isActive: boolean;
  }>;
}

interface Tier {
  id: string;
  minArea: number;
  maxArea?: number;
  pricePerSqm: number;
  isActive: boolean;
}

export default function AdminPackages() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
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
  const [tierFormData, setTierFormData] = useState({
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Packages Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage inspection packages and pricing
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/admin/dashboard")}
              variant="outline"
            >
              Back to Dashboard
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingPackage ? "Edit Package" : "Create New Package"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Package Name (English)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="basic, premium, vip"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameAr">Package Name (Arabic)</Label>
                    <Input
                      id="nameAr"
                      value={formData.nameAr}
                      onChange={(e) =>
                        setFormData({ ...formData, nameAr: e.target.value })
                      }
                      placeholder="الباقة الأساسية"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price (SAR)</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData({ ...formData, basePrice: e.target.value })
                      }
                      placeholder="1970"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Fixed price for properties ≤ 250m²
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayOrder">Display Order</Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayOrder: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Package description"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingPackage ? "Update Package" : "Create Package"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle>{pkg.nameAr}</CardTitle>
                <CardDescription>{pkg.name}</CardDescription>
                <CardAction>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Base Price: </span>
                    <span className="font-semibold">
                      {pkg.basePrice.toLocaleString()} SAR
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status: </span>
                    <span
                      className={
                        pkg.isActive ? "text-green-600" : "text-red-600"
                      }
                    >
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Area Price Tiers
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePackageExpanded(pkg.id)}
                      >
                        {expandedPackages.has(pkg.id) ? "Hide" : "Show"} Tiers
                      </Button>
                    </div>
                    {expandedPackages.has(pkg.id) && (
                      <div className="mt-2 space-y-3">
                        {showTierForm === pkg.id && (
                          <Card className="p-4 bg-gray-50">
                            <form
                              onSubmit={(e) => handleTierSubmit(e, pkg.id)}
                              className="space-y-3"
                            >
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <Label
                                    htmlFor="tier-minArea"
                                    className="text-xs"
                                  >
                                    Min Area (m²)
                                  </Label>
                                  <Input
                                    id="tier-minArea"
                                    type="number"
                                    step="0.01"
                                    value={tierFormData.minArea}
                                    onChange={(e) =>
                                      setTierFormData({
                                        ...tierFormData,
                                        minArea: e.target.value,
                                      })
                                    }
                                    placeholder="251"
                                    required
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label
                                    htmlFor="tier-maxArea"
                                    className="text-xs"
                                  >
                                    Max Area (m²)
                                  </Label>
                                  <Input
                                    id="tier-maxArea"
                                    type="number"
                                    step="0.01"
                                    value={tierFormData.maxArea}
                                    onChange={(e) =>
                                      setTierFormData({
                                        ...tierFormData,
                                        maxArea: e.target.value,
                                      })
                                    }
                                    placeholder="500 (leave empty for unlimited)"
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label
                                    htmlFor="tier-pricePerSqm"
                                    className="text-xs"
                                  >
                                    Price per m² (SAR)
                                  </Label>
                                  <Input
                                    id="tier-pricePerSqm"
                                    type="number"
                                    step="0.01"
                                    value={tierFormData.pricePerSqm}
                                    onChange={(e) =>
                                      setTierFormData({
                                        ...tierFormData,
                                        pricePerSqm: e.target.value,
                                      })
                                    }
                                    placeholder="25.00"
                                    required
                                    className="h-8 text-sm"
                                  />
                                </div>
                                <div className="space-y-1 flex items-end">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id="tier-isActive"
                                      checked={tierFormData.isActive}
                                      onChange={(e) =>
                                        setTierFormData({
                                          ...tierFormData,
                                          isActive: e.target.checked,
                                        })
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <Label
                                      htmlFor="tier-isActive"
                                      className="text-xs cursor-pointer"
                                    >
                                      Active
                                    </Label>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="submit"
                                  size="sm"
                                  className="h-8 text-xs"
                                >
                                  {editingTier ? "Update" : "Create"} Tier
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCancelTier}
                                  className="h-8 text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </Card>
                        )}
                        {!showTierForm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddTier(pkg.id)}
                            className="w-full"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Tier
                          </Button>
                        )}
                        {pkg.areaPriceTiers && pkg.areaPriceTiers.length > 0 ? (
                          <div className="space-y-2">
                            {pkg.areaPriceTiers.map((tier) => (
                              <div
                                key={tier.id}
                                className="flex justify-between items-center p-2 bg-white rounded border text-sm"
                              >
                                <div>
                                  <span className="font-medium">
                                    {tier.minArea}-{tier.maxArea || "∞"}m²
                                  </span>
                                  <span className="text-gray-600 ml-2">
                                    {tier.pricePerSqm} SAR/m²
                                  </span>
                                  {!tier.isActive && (
                                    <span className="text-red-600 text-xs ml-2">
                                      (Inactive)
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditTier(pkg.id, tier)}
                                    className="h-7 w-7 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteTier(pkg.id, tier.id)
                                    }
                                    className="h-7 w-7 p-0"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 text-center py-2">
                            No tiers configured
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
