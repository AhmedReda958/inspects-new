"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const vatSchema = z.object({
  percentage: z.number().min(0).max(100),
});

const ruleSchema = z.object({
  base_area_threshold: z.string(),
  neighborhood_multiplier_threshold: z.string(),
  roofed_area_calculation_factor: z.string(),
  basic_package_excess_area_price: z.string(),
});

type VatFormData = z.infer<typeof vatSchema>;
type RuleFormData = z.infer<typeof ruleSchema>;

export default function AdminSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vatData, setVatData] = useState<{ percentage: number } | null>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [error, setError] = useState("");

  const vatForm = useForm<VatFormData>({
    resolver: zodResolver(vatSchema),
  });

  const rulesForm = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const [vatResponse, rulesResponse] = await Promise.all([
        fetch("/api/admin/settings/vat"),
        fetch("/api/admin/settings/calculation-rules"),
      ]);

      if (!vatResponse.ok || !rulesResponse.ok) {
        throw new Error("Failed to fetch settings");
      }

      const vatResult = await vatResponse.json();
      const rulesResult = await rulesResponse.json();

      if (vatResult.success && vatResult.data) {
        setVatData({ percentage: Number(vatResult.data.percentage) });
        vatForm.setValue("percentage", Number(vatResult.data.percentage));
      }

      if (rulesResult.success && rulesResult.data) {
        setRules(rulesResult.data);
        const rulesMap: any = {};
        rulesResult.data.forEach((rule: any) => {
          rulesMap[rule.key] = rule.value;
        });
        rulesForm.setValue("base_area_threshold", rulesMap.base_area_threshold || "250");
        rulesForm.setValue("neighborhood_multiplier_threshold", rulesMap.neighborhood_multiplier_threshold || "500");
        rulesForm.setValue("roofed_area_calculation_factor", rulesMap.roofed_area_calculation_factor || "0.6");
        rulesForm.setValue("basic_package_excess_area_price", rulesMap.basic_package_excess_area_price || "4");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function handleVatSubmit(data: VatFormData) {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/settings/vat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update VAT");
      }

      const result = await response.json();
      if (result.success) {
        setVatData({ percentage: data.percentage });
        alert("VAT setting updated successfully!");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update VAT");
    } finally {
      setSaving(false);
    }
  }

  async function handleRulesSubmit(data: RuleFormData) {
    setSaving(true);
    setError("");

    try {
      const rulesToUpdate = rules.map((rule) => ({
        id: rule.id,
        value: data[rule.key as keyof RuleFormData] || rule.value,
      }));

      const response = await fetch("/api/admin/settings/calculation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rulesToUpdate),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update rules");
      }

      alert("Calculation rules updated successfully!");
      fetchSettings();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update rules");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Manage system configuration</p>
          </div>
          <Button onClick={() => router.push("/admin/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* VAT Settings */}
          <Card>
            <CardHeader>
              <CardTitle>VAT Configuration</CardTitle>
              <CardDescription>
                Set the VAT percentage applied to all calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={vatForm.handleSubmit(handleVatSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vat-percentage">VAT Percentage (%)</Label>
                  <Input
                    id="vat-percentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...vatForm.register("percentage", { valueAsNumber: true })}
                  />
                  {vatForm.formState.errors.percentage && (
                    <p className="text-sm text-red-600">
                      {vatForm.formState.errors.percentage.message}
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

          {/* Calculation Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Calculation Rules</CardTitle>
              <CardDescription>
                Configure global calculation parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={rulesForm.handleSubmit(handleRulesSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base_area_threshold">Base Area Threshold (m²)</Label>
                  <Input
                    id="base_area_threshold"
                    type="number"
                    step="1"
                    {...rulesForm.register("base_area_threshold")}
                  />
                  <p className="text-xs text-gray-500">
                    Properties below this area use fixed pricing
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood_threshold">Neighborhood Multiplier Threshold (m²)</Label>
                  <Input
                    id="neighborhood_threshold"
                    type="number"
                    step="1"
                    {...rulesForm.register("neighborhood_multiplier_threshold")}
                  />
                  <p className="text-xs text-gray-500">
                    Neighborhood multiplier applies only above this area
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roofed_area_factor">Roofed Area Calculation Factor</Label>
                  <Input
                    id="roofed_area_factor"
                    type="number"
                    step="0.1"
                    {...rulesForm.register("roofed_area_calculation_factor")}
                  />
                  <p className="text-xs text-gray-500">
                    Factor for calculating roofed area (0.6 × area × levels)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basic_package_excess_price">Basic Package Excess Area Price (SAR/m²)</Label>
                  <Input
                    id="basic_package_excess_price"
                    type="number"
                    step="0.01"
                    {...rulesForm.register("basic_package_excess_area_price")}
                  />
                  <p className="text-xs text-gray-500">
                    Fixed price per square meter for excess area in basic package (default: 4 SAR/m²)
                  </p>
                </div>

                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? "Saving..." : "Update Rules"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

