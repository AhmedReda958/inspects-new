"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Lead } from "@/types/admin/leads";

interface CustomerInfoProps {
  lead: Lead;
}

export function CustomerInfo({ lead }: CustomerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="">Name</Label>
            <p className="font-semibold">
              {lead.firstName} {lead.familyName}
            </p>
          </div>
          <div>
            <Label className="">Phone</Label>
            <p className="font-semibold">{lead.mobileNumber}</p>
          </div>
          {lead.email && (
            <div>
              <Label className="">Email</Label>
              <p className="font-semibold">{lead.email}</p>
            </div>
          )}
          <div>
            <Label className="">Submission Date</Label>
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
  );
}
