"use client";

import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { TierForm } from "./tier-form";
import type { Tier, TierFormData } from "@/types/admin/packages";

interface TierListProps {
  tiers: Tier[];
  showTierForm: boolean;
  editingTier: Tier | null;
  tierFormData: TierFormData;
  setTierFormData: (data: TierFormData) => void;
  onAddTier: () => void;
  onEditTier: (tier: Tier) => void;
  onCancelTier: () => void;
  onTierSubmit: (e: React.FormEvent) => void;
  onDeleteTier: (tierId: string) => void;
}

export function TierList({
  tiers,
  showTierForm,
  editingTier,
  tierFormData,
  setTierFormData,
  onAddTier,
  onEditTier,
  onCancelTier,
  onTierSubmit,
  onDeleteTier,
}: TierListProps) {
  return (
    <div className="mt-2 space-y-3">
      {showTierForm && (
        <TierForm
          editingTier={editingTier}
          formData={tierFormData}
          setFormData={setTierFormData}
          onSubmit={onTierSubmit}
          onCancel={onCancelTier}
        />
      )}
      {!showTierForm && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddTier}
          className="w-full"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Tier
        </Button>
      )}
      {tiers && tiers.length > 0 ? (
        <div className="space-y-2">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex justify-between items-center p-2 bg-white rounded border text-sm"
            >
              <div>
                <span className="font-medium">
                  {tier.minArea}-{tier.maxArea || "∞"}m²
                </span>
                <span className=" ml-2">{tier.pricePerSqm} SAR/m²</span>
                {!tier.isActive && (
                  <span className="text-red-600 text-xs ml-2">(Inactive)</span>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditTier(tier)}
                  className="h-7 w-7 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteTier(tier.id)}
                  className="h-7 w-7 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500 text-center py-2">
          No tiers configured
        </p>
      )}
    </div>
  );
}
