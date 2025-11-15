"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Multiplier } from "@/types/admin/multipliers";

interface MultiplierCardProps {
  multiplier: Multiplier;
  type: "age" | "purpose";
  onEdit: (multiplier: Multiplier) => void;
  onDelete: (id: string) => void;
}

export function MultiplierCard({
  multiplier,
  type,
  onEdit,
  onDelete,
}: MultiplierCardProps) {
  const isAge = type === "age";
  const name = isAge ? multiplier.ageRange : multiplier.purpose;
  const nameEn = isAge ? multiplier.ageRangeEn : multiplier.purposeEn;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {nameEn && <CardDescription>{nameEn}</CardDescription>}
        <CardAction>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(multiplier)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(multiplier.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm ">Multiplier: </span>
            <span className="font-semibold">{multiplier.multiplier}x</span>
          </div>
          <div>
            <span className="text-sm ">Status: </span>
            <span
              className={
                multiplier.isActive ? "text-green-600" : "text-red-600"
              }
            >
              {multiplier.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
