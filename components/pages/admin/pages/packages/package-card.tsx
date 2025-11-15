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
import { TierList } from "./tier-list";
import type { Package, Tier, TierFormData } from "@/types/admin/packages";

interface PackageCardProps {
  pkg: Package;
  expanded: boolean;
  showTierForm: string | null;
  editingTier: { packageId: string; tier: Tier } | null;
  tierFormData: TierFormData;
  setTierFormData: (data: TierFormData) => void;
  onEdit: (pkg: Package) => void;
  onDelete: (id: string) => void;
  onToggleExpanded: (packageId: string) => void;
  onAddTier: (packageId: string) => void;
  onEditTier: (packageId: string, tier: Tier) => void;
  onCancelTier: () => void;
  onTierSubmit: (e: React.FormEvent, packageId: string) => void;
  onDeleteTier: (packageId: string, tierId: string) => void;
}

export function PackageCard({
  pkg,
  expanded,
  showTierForm,
  editingTier,
  tierFormData,
  setTierFormData,
  onEdit,
  onDelete,
  onToggleExpanded,
  onAddTier,
  onEditTier,
  onCancelTier,
  onTierSubmit,
  onDeleteTier,
}: PackageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{pkg.nameAr}</CardTitle>
        <CardDescription>{pkg.name}</CardDescription>
        <CardAction>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(pkg)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(pkg.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-600">Base Price: </span>
            <span className="font-semibold">
              {pkg.basePrice.toLocaleString()} SAR
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Status: </span>
            <span className={pkg.isActive ? "text-green-600" : "text-red-600"}>
              {pkg.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Area Price Tiers
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleExpanded(pkg.id)}
              >
                {expanded ? "Hide" : "Show"} Tiers
              </Button>
            </div>
            {expanded && (
              <TierList
                tiers={pkg.areaPriceTiers || []}
                showTierForm={showTierForm === pkg.id}
                editingTier={
                  editingTier?.packageId === pkg.id ? editingTier.tier : null
                }
                tierFormData={tierFormData}
                setTierFormData={setTierFormData}
                onAddTier={() => onAddTier(pkg.id)}
                onEditTier={(tier) => onEditTier(pkg.id, tier)}
                onCancelTier={onCancelTier}
                onTierSubmit={(e) => onTierSubmit(e, pkg.id)}
                onDeleteTier={(tierId) => onDeleteTier(pkg.id, tierId)}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
