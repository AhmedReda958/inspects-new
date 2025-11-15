"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type {
  VatFormData,
  RuleFormData,
  VatData,
  CalculationRule,
} from "@/types/admin/settings";

const vatSchema = z.object({
  percentage: z.number().min(0).max(100),
});

const ruleSchema = z.object({
  base_area_threshold: z.string(),
  neighborhood_multiplier_threshold: z.string(),
  roofed_area_calculation_factor: z.string(),
  basic_package_excess_area_price: z.string(),
});

export function useSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vatData, setVatData] = useState<VatData | null>(null);
  const [rules, setRules] = useState<CalculationRule[]>([]);
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
        rulesResult.data.forEach((rule: CalculationRule) => {
          rulesMap[rule.key] = rule.value;
        });
        rulesForm.setValue(
          "base_area_threshold",
          rulesMap.base_area_threshold || "250"
        );
        rulesForm.setValue(
          "neighborhood_multiplier_threshold",
          rulesMap.neighborhood_multiplier_threshold || "500"
        );
        rulesForm.setValue(
          "roofed_area_calculation_factor",
          rulesMap.roofed_area_calculation_factor || "0.6"
        );
        rulesForm.setValue(
          "basic_package_excess_area_price",
          rulesMap.basic_package_excess_area_price || "4"
        );
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
      setError(
        error instanceof Error ? error.message : "Failed to update rules"
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    loading,
    saving,
    vatData,
    rules,
    error,
    vatForm,
    rulesForm,
    handleVatSubmit,
    handleRulesSubmit,
  };
}
