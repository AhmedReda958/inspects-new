"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";

interface City {
  id: string;
  name: string;
  nameEn?: string;
  isActive: boolean;
  displayOrder: number;
  neighborhoods: Neighborhood[];
}

interface Neighborhood {
  id: string;
  name: string;
  nameEn?: string;
  level: string;
  multiplier: number;
  isActive: boolean;
  applyAboveArea: number;
  displayOrder: number;
  cityId: string;
}

export default function AdminLocations() {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cities");
  const [showCityForm, setShowCityForm] = useState(false);
  const [showNeighborhoodForm, setShowNeighborhoodForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [editingNeighborhood, setEditingNeighborhood] = useState<Neighborhood | null>(null);
  const [cityFormData, setCityFormData] = useState({
    name: "",
    nameEn: "",
    displayOrder: 0,
  });
  const [neighborhoodFormData, setNeighborhoodFormData] = useState({
    cityId: "",
    name: "",
    nameEn: "",
    level: "C",
    multiplier: "1.00",
    applyAboveArea: 500,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    try {
      const response = await fetch("/api/admin/cities");
      if (!response.ok) throw new Error("Failed to fetch cities");

      const result = await response.json();
      if (result.success) {
        setCities(result.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEditCity(city: City) {
    setEditingCity(city);
    setCityFormData({
      name: city.name,
      nameEn: city.nameEn || "",
      displayOrder: city.displayOrder,
    });
    setShowCityForm(true);
  }

  function handleEditNeighborhood(neighborhood: Neighborhood) {
    setEditingNeighborhood(neighborhood);
    setNeighborhoodFormData({
      cityId: neighborhood.cityId,
      name: neighborhood.name,
      nameEn: neighborhood.nameEn || "",
      level: neighborhood.level,
      multiplier: neighborhood.multiplier.toString(),
      applyAboveArea: neighborhood.applyAboveArea,
      displayOrder: neighborhood.displayOrder,
    });
    setShowNeighborhoodForm(true);
  }

  function handleCancelCity() {
    setShowCityForm(false);
    setEditingCity(null);
    setCityFormData({ name: "", nameEn: "", displayOrder: 0 });
  }

  function handleCancelNeighborhood() {
    setShowNeighborhoodForm(false);
    setEditingNeighborhood(null);
    setNeighborhoodFormData({
      cityId: "",
      name: "",
      nameEn: "",
      level: "C",
      multiplier: "1.00",
      applyAboveArea: 500,
      displayOrder: 0,
    });
  }

  async function handleCitySubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingCity
        ? `/api/admin/cities/${editingCity.id}`
        : "/api/admin/cities";
      const method = editingCity ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cityFormData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save city");
      }

      alert(editingCity ? "City updated successfully!" : "City created successfully!");
      handleCancelCity();
      fetchCities();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save city");
    }
  }

  async function handleNeighborhoodSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingNeighborhood
        ? `/api/admin/neighborhoods/${editingNeighborhood.id}`
        : "/api/admin/neighborhoods";
      const method = editingNeighborhood ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...neighborhoodFormData,
          multiplier: parseFloat(neighborhoodFormData.multiplier),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save neighborhood");
      }

      alert(editingNeighborhood ? "Neighborhood updated successfully!" : "Neighborhood created successfully!");
      handleCancelNeighborhood();
      fetchCities();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save neighborhood");
    }
  }

  async function handleDeleteCity(id: string) {
    if (!confirm("Are you sure you want to delete this city?")) return;

    try {
      const response = await fetch(`/api/admin/cities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete city");

      alert("City deleted successfully!");
      fetchCities();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete city");
    }
  }

  async function handleDeleteNeighborhood(id: string) {
    if (!confirm("Are you sure you want to delete this neighborhood?")) return;

    try {
      const response = await fetch(`/api/admin/neighborhoods/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete neighborhood");

      alert("Neighborhood deleted successfully!");
      fetchCities();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete neighborhood");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Locations Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage cities and neighborhoods</p>
          </div>
          <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="neighborhoods">Neighborhoods</TabsTrigger>
          </TabsList>

          {/* Cities Tab */}
          <TabsContent value="cities">
            {showCityForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{editingCity ? "Edit City" : "Create New City"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCitySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city-name">City Name (Arabic)</Label>
                        <Input
                          id="city-name"
                          value={cityFormData.name}
                          onChange={(e) => setCityFormData({ ...cityFormData, name: e.target.value })}
                          placeholder="الرياض"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city-nameEn">City Name (English)</Label>
                        <Input
                          id="city-nameEn"
                          value={cityFormData.nameEn}
                          onChange={(e) => setCityFormData({ ...cityFormData, nameEn: e.target.value })}
                          placeholder="Riyadh"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city-displayOrder">Display Order</Label>
                        <Input
                          id="city-displayOrder"
                          type="number"
                          value={cityFormData.displayOrder}
                          onChange={(e) => setCityFormData({ ...cityFormData, displayOrder: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingCity ? "Update City" : "Create City"}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancelCity}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowCityForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add City
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <Card key={city.id}>
                  <CardHeader>
                    <CardTitle>{city.name}</CardTitle>
                    {city.nameEn && <CardDescription>{city.nameEn}</CardDescription>}
                    <CardAction>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCity(city)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCity(city.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Neighborhoods: </span>
                        <span className="font-semibold">{city.neighborhoods?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status: </span>
                        <span className={city.isActive ? "text-green-600" : "text-red-600"}>
                          {city.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Neighborhoods Tab */}
          <TabsContent value="neighborhoods">
            {showNeighborhoodForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {editingNeighborhood ? "Edit Neighborhood" : "Create New Neighborhood"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNeighborhoodSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood-city">City</Label>
                        <Select
                          value={neighborhoodFormData.cityId}
                          onValueChange={(value) => setNeighborhoodFormData({ ...neighborhoodFormData, cityId: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.id}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="neighborhood-name">Neighborhood Name (Arabic)</Label>
                        <Input
                          id="neighborhood-name"
                          value={neighborhoodFormData.name}
                          onChange={(e) => setNeighborhoodFormData({ ...neighborhoodFormData, name: e.target.value })}
                          placeholder="الملقا"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="neighborhood-level">Level</Label>
                        <Select
                          value={neighborhoodFormData.level}
                          onValueChange={(value) => setNeighborhoodFormData({ ...neighborhoodFormData, level: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A - Premium (1.15x)</SelectItem>
                            <SelectItem value="B">B - Above Average (1.10x)</SelectItem>
                            <SelectItem value="C">C - Average (1.00x)</SelectItem>
                            <SelectItem value="D">D - Below Average (0.95x)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="neighborhood-multiplier">Multiplier</Label>
                        <Input
                          id="neighborhood-multiplier"
                          type="number"
                          step="0.01"
                          value={neighborhoodFormData.multiplier}
                          onChange={(e) => setNeighborhoodFormData({ ...neighborhoodFormData, multiplier: e.target.value })}
                          placeholder="1.00"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="neighborhood-threshold">Apply Above Area (m²)</Label>
                        <Input
                          id="neighborhood-threshold"
                          type="number"
                          value={neighborhoodFormData.applyAboveArea}
                          onChange={(e) => setNeighborhoodFormData({ ...neighborhoodFormData, applyAboveArea: parseInt(e.target.value) })}
                          required
                        />
                        <p className="text-xs text-gray-500">Multiplier applies only above this area</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="neighborhood-displayOrder">Display Order</Label>
                        <Input
                          id="neighborhood-displayOrder"
                          type="number"
                          value={neighborhoodFormData.displayOrder}
                          onChange={(e) => setNeighborhoodFormData({ ...neighborhoodFormData, displayOrder: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingNeighborhood ? "Update Neighborhood" : "Create Neighborhood"}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancelNeighborhood}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowNeighborhoodForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Neighborhood
              </Button>
            </div>

            <div className="space-y-4">
              {cities.map((city) => (
                <Card key={city.id}>
                  <CardHeader>
                    <CardTitle>{city.name}</CardTitle>
                    <CardDescription>{city.neighborhoods?.length || 0} neighborhoods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {city.neighborhoods && city.neighborhoods.length > 0 ? (
                        city.neighborhoods.map((neighborhood) => (
                          <div
                            key={neighborhood.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{neighborhood.name}</p>
                              <p className="text-sm text-gray-600">
                                Level {neighborhood.level} • {neighborhood.multiplier}x • Above {neighborhood.applyAboveArea}m²
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditNeighborhood(neighborhood)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteNeighborhood(neighborhood.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No neighborhoods for this city</p>
                      )}
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

