"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import type { VatFormData, VatData } from "@/types/admin/settings";

interface VatFormProps {
  form: UseFormReturn<VatFormData>;
  vatData: VatData | null;
  saving: boolean;
  onSubmit: (data: VatFormData) => void;
}

export function VatForm({ form, vatData, saving, onSubmit }: VatFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>VAT Configuration</CardTitle>
        <CardDescription>
          Set the VAT percentage applied to all calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vat-percentage">VAT Percentage (%)</Label>
            <Input
              id="vat-percentage"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...form.register("percentage", { valueAsNumber: true })}
            />
            {form.formState.errors.percentage && (
              <p className="text-sm text-red-600">
                {form.formState.errors.percentage.message}
              </p>
            )}
          </div>

          {vatData && (
            <p className="text-sm text-gray-600">
              Current VAT: <span className="font-semibold">{vatData.percentage}%</span>
            </p>
          )}

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Update VAT"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

