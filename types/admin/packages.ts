export interface Package {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  basePrice: number;
  isActive: boolean;
  displayOrder: number;
  areaPriceTiers: Tier[];
}

export interface Tier {
  id: string;
  minArea: number;
  maxArea?: number;
  pricePerSqm: number;
  isActive: boolean;
}

export interface PackageFormData {
  name: string;
  nameAr: string;
  description: string;
  basePrice: string;
  isActive: boolean;
  displayOrder: number;
}

export interface TierFormData {
  minArea: string;
  maxArea: string;
  pricePerSqm: string;
  isActive: boolean;
}
