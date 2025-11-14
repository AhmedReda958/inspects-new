"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const leadUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "converted", "rejected"]),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
  followUpDate: z.string().optional(),
});

type LeadUpdateFormData = z.infer<typeof leadUpdateSchema>;

interface Lead {
  id: string;
  firstName: string;
  familyName: string;
  mobileNumber: string;
  email?: string;
  status: string;
  notes?: string;
  assignedTo?: string;
  followUpDate?: string;
  basePrice: number;
  priceBeforeVat: number;
  vatAmount: number;
  finalPrice: number;
  landArea: number;
  coveredArea: number;
  createdAt: string;
  city?: { name: string };
  neighborhood?: { name: string; level: string };
  package?: { nameAr: string };
  propertyAge?: { ageRange: string };
  inspectionPurpose?: { purpose: string };
  calculationBreakdown: any;
}

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;
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
          form.setValue("followUpDate", new Date(result.data.followUpDate).toISOString().split("T")[0]);
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
      setError(error instanceof Error ? error.message : "Failed to update lead");
    } finally {
      setSaving(false);
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-purple-100 text-purple-800";
      case "converted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Lead not found</p>
          <Button onClick={() => router.push("/admin/leads")} className="mt-4">
            Back to Leads
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Lead Details</h1>
            <p className="text-sm text-gray-600 mt-1">
              {lead.firstName} {lead.familyName}
            </p>
          </div>
          <Button onClick={() => router.push("/admin/leads")} variant="outline">
            Back to Leads
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Name</Label>
                    <p className="font-semibold">
                      {lead.firstName} {lead.familyName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Phone</Label>
                    <p className="font-semibold">{lead.mobileNumber}</p>
                  </div>
                  {lead.email && (
                    <div>
                      <Label className="text-gray-600">Email</Label>
                      <p className="font-semibold">{lead.email}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-gray-600">Submission Date</Label>
                    <p className="font-semibold">
                      {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">City</Label>
                    <p className="font-semibold">{lead.city?.name || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Neighborhood</Label>
                    <p className="font-semibold">
                      {lead.neighborhood?.name || "-"}
                      {lead.neighborhood?.level && ` (Level ${lead.neighborhood.level})`}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Land Area</Label>
                    <p className="font-semibold">{lead.landArea} m²</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Covered Area</Label>
                    <p className="font-semibold">{lead.coveredArea} m²</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Package</Label>
                    <p className="font-semibold">{lead.package?.nameAr || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Property Age</Label>
                    <p className="font-semibold">{lead.propertyAge?.ageRange || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Inspection Purpose</Label>
                    <p className="font-semibold">{lead.inspectionPurpose?.purpose || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calculation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-semibold">{lead.basePrice.toLocaleString("ar-SA")} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price Before VAT:</span>
                    <span className="font-semibold">{lead.priceBeforeVat.toLocaleString("ar-SA")} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (15%):</span>
                    <span className="font-semibold">{lead.vatAmount.toLocaleString("ar-SA")} SAR</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-lg font-bold">Final Price:</span>
                    <span className="text-lg font-bold text-primary">
                      {lead.finalPrice.toLocaleString("ar-SA")} SAR
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lead Management */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Management</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={form.watch("status")}
                      onValueChange={(value) => form.setValue("status", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      className="w-full min-h-[100px] p-3 border rounded-lg"
                      {...form.register("notes")}
                      placeholder="Add notes about this lead..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input
                      id="assignedTo"
                      {...form.register("assignedTo")}
                      placeholder="User ID or name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      {...form.register("followUpDate")}
                    />
                  </div>

                  <div className="pt-2">
                    <span className="text-sm text-gray-600">Current Status: </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>

                  <Button type="submit" disabled={saving} className="w-full">
                    {saving ? "Saving..." : "Update Lead"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

