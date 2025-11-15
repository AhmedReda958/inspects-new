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
import type { NeighborhoodLevel } from "@/types/admin/locations";

interface LevelCardProps {
  level: NeighborhoodLevel;
  onEdit: (level: NeighborhoodLevel) => void;
  onDelete: (id: string) => void;
}

export function LevelCard({ level, onEdit, onDelete }: LevelCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {level.code} - {level.name}
        </CardTitle>
        {level.nameEn && <CardDescription>{level.nameEn}</CardDescription>}
        <CardAction>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(level)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(level.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm">Multiplier: </span>
            <span className="font-semibold">{level.multiplier}x</span>
          </div>
          <div>
            <span className="text-sm">Status: </span>
            <span
              className={
                level.isActive ? "text-green-600" : "text-red-600"
              }
            >
              {level.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


