"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Package, PackageFormData } from "@/types/admin/packages";

interface PackageFormProps {
  editingPackage: Package | null;
  formData: PackageFormData;
  setFormData: (data: PackageFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function PackageForm({
  editingPackage,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: PackageFormProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {editingPackage ? "Edit Package" : "Create New Package"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
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
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Package description"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingPackage ? "Update Package" : "Create Package"}
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

