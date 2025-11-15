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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Multiplier {
  id: string;
  ageRange?: string;
  purpose?: string;
  ageRangeEn?: string;
  purposeEn?: string;
  multiplier: number;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminMultipliers() {
  const router = useRouter();
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
  const [ageFormData, setAgeFormData] = useState({
    ageRange: "",
    ageRangeEn: "",
    multiplier: "1.00",
    displayOrder: 0,
    isActive: true,
  });
  const [purposeFormData, setPurposeFormData] = useState({
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

      alert(
        editingAge
          ? "Multiplier updated successfully!"
          : "Multiplier created successfully!"
      );
      handleCancelAge();
      fetchMultipliers();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to save multiplier"
      );
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

      alert(
        editingPurpose
          ? "Multiplier updated successfully!"
          : "Multiplier created successfully!"
      );
      handleCancelPurpose();
      fetchMultipliers();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to save multiplier"
      );
    }
  }

  async function handleDeleteAge(id: string) {
    if (!confirm("Are you sure you want to delete this multiplier?")) return;

    try {
      const response = await fetch(
        `/api/admin/property-age-multipliers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete multiplier");

      alert("Multiplier deleted successfully!");
      fetchMultipliers();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete multiplier"
      );
    }
  }

  async function handleDeletePurpose(id: string) {
    if (!confirm("Are you sure you want to delete this multiplier?")) return;

    try {
      const response = await fetch(
        `/api/admin/inspection-purpose-multipliers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete multiplier");

      alert("Multiplier deleted successfully!");
      fetchMultipliers();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete multiplier"
      );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading multipliers...</p>
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
              Multipliers Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage property age and inspection purpose multipliers
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/dashboard")}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="property-age">Property Age</TabsTrigger>
            <TabsTrigger value="inspection-purpose">
              Inspection Purpose
            </TabsTrigger>
          </TabsList>

          {/* Property Age Tab */}
          <TabsContent value="property-age">
            {showAgeForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {editingAge
                      ? "Edit Property Age Multiplier"
                      : "Create New Property Age Multiplier"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAgeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age-range">Age Range (Arabic)</Label>
                        <Input
                          id="age-range"
                          value={ageFormData.ageRange}
                          onChange={(e) =>
                            setAgeFormData({
                              ...ageFormData,
                              ageRange: e.target.value,
                            })
                          }
                          placeholder="أقل من سنة"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age-rangeEn">Age Range (English)</Label>
                        <Input
                          id="age-rangeEn"
                          value={ageFormData.ageRangeEn}
                          onChange={(e) =>
                            setAgeFormData({
                              ...ageFormData,
                              ageRangeEn: e.target.value,
                            })
                          }
                          placeholder="Less than 1 year"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age-multiplier">Multiplier</Label>
                        <Input
                          id="age-multiplier"
                          type="number"
                          step="0.01"
                          value={ageFormData.multiplier}
                          onChange={(e) =>
                            setAgeFormData({
                              ...ageFormData,
                              multiplier: e.target.value,
                            })
                          }
                          placeholder="1.00"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          e.g., 0.95 = -5%, 1.15 = +15%
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="age-displayOrder">Display Order</Label>
                        <Input
                          id="age-displayOrder"
                          type="number"
                          value={ageFormData.displayOrder}
                          onChange={(e) =>
                            setAgeFormData({
                              ...ageFormData,
                              displayOrder: parseInt(e.target.value),
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="age-isActive"
                            checked={ageFormData.isActive}
                            onChange={(e) =>
                              setAgeFormData({
                                ...ageFormData,
                                isActive: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor="age-isActive"
                            className="cursor-pointer"
                          >
                            Active
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500">
                          Inactive multipliers will not appear in the calculator
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingAge ? "Update Multiplier" : "Create Multiplier"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelAge}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowAgeForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property Age
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyAges.map((age) => (
                <Card key={age.id}>
                  <CardHeader>
                    <CardTitle>{age.ageRange}</CardTitle>
                    {age.ageRangeEn && (
                      <CardDescription>{age.ageRangeEn}</CardDescription>
                    )}
                    <CardAction>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAge(age)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAge(age.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">
                          Multiplier:{" "}
                        </span>
                        <span className="font-semibold">{age.multiplier}x</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status: </span>
                        <span
                          className={
                            age.isActive ? "text-green-600" : "text-red-600"
                          }
                        >
                          {age.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inspection Purpose Tab */}
          <TabsContent value="inspection-purpose">
            {showPurposeForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {editingPurpose
                      ? "Edit Inspection Purpose Multiplier"
                      : "Create New Inspection Purpose Multiplier"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePurposeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose (Arabic)</Label>
                        <Input
                          id="purpose"
                          value={purposeFormData.purpose}
                          onChange={(e) =>
                            setPurposeFormData({
                              ...purposeFormData,
                              purpose: e.target.value,
                            })
                          }
                          placeholder="قبل الشراء"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purposeEn">Purpose (English)</Label>
                        <Input
                          id="purposeEn"
                          value={purposeFormData.purposeEn}
                          onChange={(e) =>
                            setPurposeFormData({
                              ...purposeFormData,
                              purposeEn: e.target.value,
                            })
                          }
                          placeholder="Before Purchase"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purpose-multiplier">Multiplier</Label>
                        <Input
                          id="purpose-multiplier"
                          type="number"
                          step="0.01"
                          value={purposeFormData.multiplier}
                          onChange={(e) =>
                            setPurposeFormData({
                              ...purposeFormData,
                              multiplier: e.target.value,
                            })
                          }
                          placeholder="1.00"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          e.g., 0.90 = -10%, 1.10 = +10%
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purpose-displayOrder">
                          Display Order
                        </Label>
                        <Input
                          id="purpose-displayOrder"
                          type="number"
                          value={purposeFormData.displayOrder}
                          onChange={(e) =>
                            setPurposeFormData({
                              ...purposeFormData,
                              displayOrder: parseInt(e.target.value),
                            })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="purpose-isActive"
                            checked={purposeFormData.isActive}
                            onChange={(e) =>
                              setPurposeFormData({
                                ...purposeFormData,
                                isActive: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor="purpose-isActive"
                            className="cursor-pointer"
                          >
                            Active
                          </Label>
                        </div>
                        <p className="text-xs text-gray-500">
                          Inactive multipliers will not appear in the calculator
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingPurpose
                          ? "Update Multiplier"
                          : "Create Multiplier"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelPurpose}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowPurposeForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Inspection Purpose
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspectionPurposes.map((purpose) => (
                <Card key={purpose.id}>
                  <CardHeader>
                    <CardTitle>{purpose.purpose}</CardTitle>
                    {purpose.purposeEn && (
                      <CardDescription>{purpose.purposeEn}</CardDescription>
                    )}
                    <CardAction>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPurpose(purpose)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePurpose(purpose.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">
                          Multiplier:{" "}
                        </span>
                        <span className="font-semibold">
                          {purpose.multiplier}x
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status: </span>
                        <span
                          className={
                            purpose.isActive ? "text-green-600" : "text-red-600"
                          }
                        >
                          {purpose.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
