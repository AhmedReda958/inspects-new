"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Lead } from "@/types/admin/leads";
import { MessageCircle, Phone } from "lucide-react";

interface CustomerInfoProps {
  lead: Lead;
}

export function CustomerInfo({ lead }: CustomerInfoProps) {
  const phoneNumber = lead.mobileNumber.replace(/\s+/g, "");
  const whatsappUrl = `https://wa.me/${phoneNumber}}`;
  const telUrl = `tel:${phoneNumber}`;

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
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.open(whatsappUrl, "_blank")}
            className="border-[#25D366] hover:bg-[#25D366]/10"
          >
            <MessageCircle className="h-4 w-4 mr-2 text-[#25D366]" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(telUrl, "_self")}
            className="border-primary hover:bg-primary/10"
          >
            <Phone className="h-4 w-4 mr-2 text-primary" />
            Phone Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
