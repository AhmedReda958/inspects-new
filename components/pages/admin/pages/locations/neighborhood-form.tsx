"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Neighborhood,
  NeighborhoodFormData,
  City,
  NeighborhoodLevel,
} from "@/types/admin/locations";

interface NeighborhoodFormProps {
  editingNeighborhood: Neighborhood | null;
  formData: NeighborhoodFormData;
  setFormData: (data: NeighborhoodFormData) => void;
  cities: City[];
  levels: NeighborhoodLevel[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function NeighborhoodForm({
  editingNeighborhood,
  formData,
  setFormData,
  cities,
  levels,
  onSubmit,
  onCancel,
}: NeighborhoodFormProps) {
  const selectedLevel = levels.find((level) => level.code === formData.level);
  const levelMultiplier = selectedLevel?.multiplier || null;

  function handleLevelChange(value: string) {
    setFormData({
      ...formData,
      level: value,
      // If not using custom multiplier, clear it when level changes
      multiplier: formData.useCustomMultiplier ? formData.multiplier : null,
    });
  }

  function handleUseCustomMultiplierChange(checked: boolean) {
    setFormData({
      ...formData,
      useCustomMultiplier: checked,
      // If enabling custom multiplier and no value set, use level multiplier as default
      multiplier: checked
        ? formData.multiplier || levelMultiplier?.toString() || null
        : null,
    });
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {editingNeighborhood
            ? "Edit Neighborhood"
            : "Create New Neighborhood"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood-city">City</Label>
              <Select
                value={formData.cityId}
                onValueChange={(value) =>
                  setFormData({ ...formData, cityId: value })
                }
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
              <Label htmlFor="neighborhood-name">
                Neighborhood Name (Arabic)
              </Label>
              <Input
                id="neighborhood-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="الملقا"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood-level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={handleLevelChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.code}>
                      {level.code} - {level.name} ({level.multiplier}x)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLevel && (
                <p className="text-xs text-gray-500">
                  Default multiplier for this level: {selectedLevel.multiplier}x
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id="use-custom-multiplier"
                  checked={formData.useCustomMultiplier}
                  onCheckedChange={handleUseCustomMultiplierChange}
                />
                <Label
                  htmlFor="use-custom-multiplier"
                  className="cursor-pointer"
                >
                  Use Custom Multiplier
                </Label>
              </div>
              <Input
                id="neighborhood-multiplier"
                type="number"
                step="0.01"
                value={formData.multiplier || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    multiplier: e.target.value || null,
                  })
                }
                placeholder={
                  levelMultiplier
                    ? `Default: ${levelMultiplier}x`
                    : "Enter multiplier"
                }
                disabled={!formData.useCustomMultiplier}
                required={formData.useCustomMultiplier}
              />
              <p className="text-xs text-gray-500">
                {formData.useCustomMultiplier
                  ? "Custom multiplier will override the level default"
                  : levelMultiplier
                  ? `Using level default: ${levelMultiplier}x`
                  : "Select a level to see default multiplier"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood-threshold">
                Apply Above Area (m²)
              </Label>
              <Input
                id="neighborhood-threshold"
                type="number"
                value={formData.applyAboveArea}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    applyAboveArea: parseInt(e.target.value),
                  })
                }
                required
              />
              <p className="text-xs text-gray-500">
                Multiplier applies only above this area
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood-displayOrder">Display Order</Label>
              <Input
                id="neighborhood-displayOrder"
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
              <div className="flex items-center gap-2">
                <Checkbox
                  id="neighborhood-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked as boolean })
                  }
                />
                <Label
                  htmlFor="neighborhood-isActive"
                  className="cursor-pointer"
                >
                  Active
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Inactive neighborhoods will not appear in the calculator
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingNeighborhood
                ? "Update Neighborhood"
                : "Create Neighborhood"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
