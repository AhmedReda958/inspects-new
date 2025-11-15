"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { City, Neighborhood } from "@/types/admin/locations";

interface NeighborhoodListProps {
  cities: City[];
  onEdit: (neighborhood: Neighborhood) => void;
  onDelete: (id: string) => void;
}

export function NeighborhoodList({
  cities,
  onEdit,
  onDelete,
}: NeighborhoodListProps) {
  return (
    <div className="space-y-4">
      {cities.map((city) => (
        <Card key={city.id}>
          <CardHeader>
            <CardTitle>{city.name}</CardTitle>
            <CardDescription>
              {city.neighborhoods?.length || 0} neighborhoods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {city.neighborhoods && city.neighborhoods.length > 0 ? (
                city.neighborhoods.map((neighborhood) => (
                  <div
                    key={neighborhood.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{neighborhood.name}</p>
                      <p className="text-sm text-gray-600">
                        Level {neighborhood.level} • {neighborhood.multiplier}x
                        • Above {neighborhood.applyAboveArea}m²
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(neighborhood)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(neighborhood.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No neighborhoods for this city
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
