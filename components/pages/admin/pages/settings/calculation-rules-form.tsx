"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import type { RuleFormData } from "@/types/admin/settings";

interface CalculationRulesFormProps {
  form: UseFormReturn<RuleFormData>;
  saving: boolean;
  onSubmit: (data: RuleFormData) => void;
}

export function CalculationRulesForm({
  form,
  saving,
  onSubmit,
}: CalculationRulesFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculation Rules</CardTitle>
        <CardDescription>Configure global calculation parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="base_area_threshold">Base Area Threshold (m²)</Label>
            <Input
              id="base_area_threshold"
              type="number"
              step="1"
              {...form.register("base_area_threshold")}
            />
            <p className="text-xs text-gray-500">
              Properties below this area use fixed pricing
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood_threshold">
              Neighborhood Multiplier Threshold (m²)
            </Label>
            <Input
              id="neighborhood_threshold"
              type="number"
              step="1"
              {...form.register("neighborhood_multiplier_threshold")}
            />
            <p className="text-xs text-gray-500">
              Neighborhood multiplier applies only above this area
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roofed_area_factor">
              Roofed Area Calculation Factor
            </Label>
            <Input
              id="roofed_area_factor"
              type="number"
              step="0.1"
              {...form.register("roofed_area_calculation_factor")}
            />
            <p className="text-xs text-gray-500">
              Factor for calculating roofed area (0.6 × area × levels)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="basic_package_excess_price">
              Basic Package Excess Area Price (SAR/m²)
            </Label>
            <Input
              id="basic_package_excess_price"
              type="number"
              step="0.01"
              {...form.register("basic_package_excess_area_price")}
            />
            <p className="text-xs text-gray-500">
              Fixed price per square meter for excess area in basic package
              (default: 4 SAR/m²)
            </p>
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Update Rules"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

