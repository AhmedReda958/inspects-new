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
import type { City } from "@/types/admin/locations";

interface CityCardProps {
  city: City;
  onEdit: (city: City) => void;
  onDelete: (id: string) => void;
}

export function CityCard({ city, onEdit, onDelete }: CityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{city.name}</CardTitle>
        {city.nameEn && <CardDescription>{city.nameEn}</CardDescription>}
        <CardAction>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(city)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(city.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm ">Neighborhoods: </span>
            <span className="font-semibold">
              {city.neighborhoods?.length || 0}
            </span>
          </div>
          <div>
            <span className="text-sm ">Status: </span>
            <span className={city.isActive ? "text-green-600" : "text-red-600"}>
              {city.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
