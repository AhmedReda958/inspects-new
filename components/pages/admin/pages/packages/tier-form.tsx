"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Tier, TierFormData } from "@/types/admin/packages";

interface TierFormProps {
  editingTier: Tier | null;
  formData: TierFormData;
  setFormData: (data: TierFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function TierForm({
  editingTier,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: TierFormProps) {
  return (
    <Card className="p-4 bg-gray-50">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="tier-minArea" className="text-xs">
              Min Area (m²)
            </Label>
            <Input
              id="tier-minArea"
              type="number"
              step="0.01"
              value={formData.minArea}
              onChange={(e) =>
                setFormData({ ...formData, minArea: e.target.value })
              }
              placeholder="251"
              required
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="tier-maxArea" className="text-xs">
              Max Area (m²)
            </Label>
            <Input
              id="tier-maxArea"
              type="number"
              step="0.01"
              value={formData.maxArea}
              onChange={(e) =>
                setFormData({ ...formData, maxArea: e.target.value })
              }
              placeholder="500 (leave empty for unlimited)"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="tier-pricePerSqm" className="text-xs">
              Price per m² (SAR)
            </Label>
            <Input
              id="tier-pricePerSqm"
              type="number"
              step="0.01"
              value={formData.pricePerSqm}
              onChange={(e) =>
                setFormData({ ...formData, pricePerSqm: e.target.value })
              }
              placeholder="25.00"
              required
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1 flex items-end">
            <div className="flex items-center gap-2">
              <Checkbox
                id="tier-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="tier-isActive" className="text-xs cursor-pointer">
                Active
              </Label>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm" className="h-8 text-xs">
            {editingTier ? "Update" : "Create"} Tier
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
