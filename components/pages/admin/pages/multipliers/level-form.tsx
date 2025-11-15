"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { LevelFormData } from "@/types/admin/locations";

interface LevelFormProps {
  editing: boolean;
  formData: LevelFormData;
  setFormData: (data: LevelFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function LevelForm({
  editing,
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: LevelFormProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {editing ? "Edit Neighborhood Level" : "Create New Neighborhood Level"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level-code">Code</Label>
              <Input
                id="level-code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="A"
                required
                maxLength={10}
              />
              <p className="text-xs text-gray-500">
                Unique identifier (e.g., A, B, C, D)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level-name">Name (Arabic)</Label>
              <Input
                id="level-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="ممتاز"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level-nameEn">Name (English)</Label>
              <Input
                id="level-nameEn"
                value={formData.nameEn}
                onChange={(e) =>
                  setFormData({ ...formData, nameEn: e.target.value })
                }
                placeholder="Premium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level-multiplier">Multiplier</Label>
              <Input
                id="level-multiplier"
                type="number"
                step="0.01"
                value={formData.multiplier}
                onChange={(e) =>
                  setFormData({ ...formData, multiplier: e.target.value })
                }
                placeholder="1.00"
                required
              />
              <p className="text-xs text-gray-500">
                e.g., 0.95 = -5%, 1.15 = +15%
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level-displayOrder">Display Order</Label>
              <Input
                id="level-displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="level-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      isActive: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="level-isActive" className="cursor-pointer">
                  Active
                </Label>
              </div>
              <p className="text-xs text-gray-500">
                Inactive levels will not appear in the neighborhood form
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editing ? "Update Level" : "Create Level"}
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


