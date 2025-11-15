"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { Lead, LeadUpdateFormData } from "@/types/admin/leads";
import { UseFormReturn } from "react-hook-form";

interface LeadManagementFormProps {
  lead: Lead;
  form: UseFormReturn<LeadUpdateFormData>;
  saving: boolean;
  onSubmit: (data: LeadUpdateFormData) => void;
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

export function LeadManagementForm({
  lead,
  form,
  saving,
  onSubmit,
}: LeadManagementFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <span className="text-sm ">Current Status: </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                lead.status
              )}`}
            >
              {lead.status}
            </span>
          </div>

          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Update Lead"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
