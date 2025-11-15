"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Lead, LeadUpdateFormData } from "@/types/admin/leads";

const leadUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "converted", "rejected"]),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
  followUpDate: z.string().optional(),
});

export function useLeadDetail(leadId: string) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LeadUpdateFormData>({
    resolver: zodResolver(leadUpdateSchema),
  });

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  async function fetchLead() {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`);
      if (!response.ok) throw new Error("Failed to fetch lead");

      const result = await response.json();
      if (result.success) {
        setLead(result.data);
        form.setValue("status", result.data.status);
        form.setValue("notes", result.data.notes || "");
        form.setValue("assignedTo", result.data.assignedTo || "");
        if (result.data.followUpDate) {
          form.setValue(
            "followUpDate",
            new Date(result.data.followUpDate).toISOString().split("T")[0]
          );
        }
      }
    } catch (error) {
      console.error("Error fetching lead:", error);
      setError("Failed to load lead details");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: LeadUpdateFormData) {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to update lead");
      }

      const result = await response.json();
      if (result.success) {
        alert("Lead updated successfully!");
        fetchLead();
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update lead"
      );
    } finally {
      setSaving(false);
    }
  }

  return {
    lead,
    loading,
    saving,
    error,
    form,
    handleSubmit,
  };
}
