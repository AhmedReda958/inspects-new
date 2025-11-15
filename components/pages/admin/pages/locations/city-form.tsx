"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { City, CityFormData } from "@/types/admin/locations";

interface CityFormProps {
  editingCity: City | null;
  formData: CityFormData;
  setFormData: (data: CityFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function CityForm({
  editingCity,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: CityFormProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{editingCity ? "Edit City" : "Create New City"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city-name">City Name (Arabic)</Label>
              <Input
                id="city-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="الرياض"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city-nameEn">City Name (English)</Label>
              <Input
                id="city-nameEn"
                value={formData.nameEn}
                onChange={(e) =>
                  setFormData({ ...formData, nameEn: e.target.value })
                }
                placeholder="Riyadh"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city-displayOrder">Display Order</Label>
              <Input
                id="city-displayOrder"
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
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingCity ? "Update City" : "Create City"}
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
