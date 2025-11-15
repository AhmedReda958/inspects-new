"use client";

import { useEffect, useState } from "react";
import type {
  City,
  Neighborhood,
  NeighborhoodLevel,
  CityFormData,
  NeighborhoodFormData,
} from "@/types/admin/locations";

export function useLocations() {
  const [cities, setCities] = useState<City[]>([]);
  const [levels, setLevels] = useState<NeighborhoodLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cities");
  const [showCityForm, setShowCityForm] = useState(false);
  const [showNeighborhoodForm, setShowNeighborhoodForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [editingNeighborhood, setEditingNeighborhood] =
    useState<Neighborhood | null>(null);
  const [cityFormData, setCityFormData] = useState<CityFormData>({
    name: "",
    nameEn: "",
    displayOrder: 0,
  });
  const [neighborhoodFormData, setNeighborhoodFormData] =
    useState<NeighborhoodFormData>({
      cityId: "",
      name: "",
      nameEn: "",
      level: "",
      multiplier: null,
      useCustomMultiplier: false,
      applyAboveArea: 500,
      displayOrder: 0,
      isActive: true,
    });

  useEffect(() => {
    fetchCities();
    fetchLevels();
  }, []);

  async function fetchLevels() {
    try {
      const response = await fetch("/api/admin/neighborhood-levels");
      if (!response.ok) throw new Error("Failed to fetch levels");

      const result = await response.json();
      if (result.success) {
        setLevels(result.data.filter((level: NeighborhoodLevel) => level.isActive));
      }
    } catch (error) {
      console.error("Error fetching neighborhood levels:", error);
    }
  }

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
    const hasCustomMultiplier = neighborhood.multiplier !== null;
    setNeighborhoodFormData({
      cityId: neighborhood.cityId,
      name: neighborhood.name,
      nameEn: neighborhood.nameEn || "",
      level: neighborhood.level,
      multiplier: hasCustomMultiplier ? neighborhood.multiplier.toString() : null,
      useCustomMultiplier: hasCustomMultiplier,
      applyAboveArea: neighborhood.applyAboveArea,
      displayOrder: neighborhood.displayOrder,
      isActive: neighborhood.isActive,
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
      level: "",
      multiplier: null,
      useCustomMultiplier: false,
      applyAboveArea: 500,
      displayOrder: 0,
      isActive: true,
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

      alert(
        editingCity
          ? "City updated successfully!"
          : "City created successfully!"
      );
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

      const submitData: any = {
        cityId: neighborhoodFormData.cityId,
        name: neighborhoodFormData.name,
        nameEn: neighborhoodFormData.nameEn,
        level: neighborhoodFormData.level,
        levelCode: neighborhoodFormData.level,
        applyAboveArea: neighborhoodFormData.applyAboveArea,
        displayOrder: neighborhoodFormData.displayOrder,
        isActive: neighborhoodFormData.isActive,
      };

      // Only include multiplier if custom multiplier is enabled
      if (neighborhoodFormData.useCustomMultiplier && neighborhoodFormData.multiplier) {
        submitData.multiplier = parseFloat(neighborhoodFormData.multiplier);
      } else {
        submitData.multiplier = null;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save neighborhood");
      }

      alert(
        editingNeighborhood
          ? "Neighborhood updated successfully!"
          : "Neighborhood created successfully!"
      );
      handleCancelNeighborhood();
      fetchCities();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to save neighborhood"
      );
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
      alert(
        error instanceof Error ? error.message : "Failed to delete neighborhood"
      );
    }
  }

  return {
    cities,
    levels,
    loading,
    activeTab,
    setActiveTab,
    showCityForm,
    setShowCityForm,
    showNeighborhoodForm,
    setShowNeighborhoodForm,
    editingCity,
    editingNeighborhood,
    cityFormData,
    setCityFormData,
    neighborhoodFormData,
    setNeighborhoodFormData,
    handleEditCity,
    handleEditNeighborhood,
    handleCancelCity,
    handleCancelNeighborhood,
    handleCitySubmit,
    handleNeighborhoodSubmit,
    handleDeleteCity,
    handleDeleteNeighborhood,
  };
}
