"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { AgeFormData, PurposeFormData } from "@/types/admin/multipliers";

interface MultiplierFormProps {
  type: "age" | "purpose";
  editing: boolean;
  formData: AgeFormData | PurposeFormData;
  setFormData: (data: AgeFormData | PurposeFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function MultiplierForm({
  type,
  editing,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: MultiplierFormProps) {
  const isAge = type === "age";
  const title = isAge
    ? editing
      ? "Edit Property Age Multiplier"
      : "Create New Property Age Multiplier"
    : editing
    ? "Edit Inspection Purpose Multiplier"
    : "Create New Inspection Purpose Multiplier";

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${type}-name`}>
                {isAge ? "Age Range" : "Purpose"} (Arabic)
              </Label>
              <Input
                id={`${type}-name`}
                value={
                  isAge
                    ? (formData as AgeFormData).ageRange
                    : (formData as PurposeFormData).purpose
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [isAge ? "ageRange" : "purpose"]: e.target.value,
                  } as AgeFormData | PurposeFormData)
                }
                placeholder={isAge ? "أقل من سنة" : "قبل الشراء"}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-nameEn`}>
                {isAge ? "Age Range" : "Purpose"} (English)
              </Label>
              <Input
                id={`${type}-nameEn`}
                value={
                  isAge
                    ? (formData as AgeFormData).ageRangeEn
                    : (formData as PurposeFormData).purposeEn
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [isAge ? "ageRangeEn" : "purposeEn"]: e.target.value,
                  } as AgeFormData | PurposeFormData)
                }
                placeholder={isAge ? "Less than 1 year" : "Before Purchase"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-multiplier`}>Multiplier</Label>
              <Input
                id={`${type}-multiplier`}
                type="number"
                step="0.01"
                value={formData.multiplier}
                onChange={(e) =>
                  setFormData({ ...formData, multiplier: e.target.value } as
                    | AgeFormData
                    | PurposeFormData)
                }
                placeholder="1.00"
                required
              />
              <p className="text-xs text-gray-500">
                e.g.,{" "}
                {isAge ? "0.95 = -5%, 1.15 = +15%" : "0.90 = -10%, 1.10 = +10%"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${type}-displayOrder`}>Display Order</Label>
              <Input
                id={`${type}-displayOrder`}
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value),
                  } as AgeFormData | PurposeFormData)
                }
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${type}-isActive`}
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      isActive: checked as boolean,
                    } as AgeFormData | PurposeFormData)
                  }
                />
                <Label htmlFor={`${type}-isActive`} className="cursor-pointer">
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
              {editing ? "Update Multiplier" : "Create Multiplier"}
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
