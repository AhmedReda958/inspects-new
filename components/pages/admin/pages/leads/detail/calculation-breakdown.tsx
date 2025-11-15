"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead } from "@/types/admin/leads";

interface CalculationBreakdownProps {
  lead: Lead;
}

export function CalculationBreakdown({ lead }: CalculationBreakdownProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculation Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="">Base Price:</span>
            <span className="font-semibold">
              {lead.basePrice.toLocaleString("ar-SA")} SAR
            </span>
          </div>
          <div className="flex justify-between">
            <span className="">Price Before VAT:</span>
            <span className="font-semibold">
              {lead.priceBeforeVat.toLocaleString("ar-SA")} SAR
            </span>
          </div>
          <div className="flex justify-between">
            <span className="">VAT (15%):</span>
            <span className="font-semibold">
              {lead.vatAmount.toLocaleString("ar-SA")} SAR
            </span>
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
  );
}
