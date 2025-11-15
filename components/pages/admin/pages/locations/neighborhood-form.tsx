"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type {
  Neighborhood,
  NeighborhoodFormData,
  City,
} from "@/types/admin/locations";

interface NeighborhoodFormProps {
  editingNeighborhood: Neighborhood | null;
  formData: NeighborhoodFormData;
  setFormData: (data: NeighborhoodFormData) => void;
  cities: City[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function NeighborhoodForm({
  editingNeighborhood,
  formData,
  setFormData,
  cities,
  onSubmit,
  onCancel,
}: NeighborhoodFormProps) {
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
                onValueChange={(value) =>
                  setFormData({ ...formData, level: value })
                }
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
                value={formData.multiplier}
                onChange={(e) =>
                  setFormData({ ...formData, multiplier: e.target.value })
                }
                placeholder="1.00"
                required
              />
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="neighborhood-isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
