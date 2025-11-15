"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Lead } from "@/types/admin/leads";

interface PropertyInfoProps {
  lead: Lead;
}

export function PropertyInfo({ lead }: PropertyInfoProps) {
  return (
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
              {lead.neighborhood?.level &&
                ` (Level ${lead.neighborhood.level})`}
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
            <p className="font-semibold">
              {lead.inspectionPurpose?.purpose || "-"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
