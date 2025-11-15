export interface City {
  id: string;
  name: string;
  nameEn?: string;
  isActive: boolean;
  displayOrder: number;
  neighborhoods: Neighborhood[];
}

export interface NeighborhoodLevel {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  multiplier: number;
  displayOrder: number;
  isActive: boolean;
}

export interface Neighborhood {
  id: string;
  name: string;
  nameEn?: string;
  level: string;
  multiplier: number | null;
  isActive: boolean;
  applyAboveArea: number;
  displayOrder: number;
  cityId: string;
}

export interface CityFormData {
  name: string;
  nameEn: string;
  displayOrder: number;
}

export interface NeighborhoodFormData {
  cityId: string;
  name: string;
  nameEn: string;
  level: string;
  multiplier: string | null;
  useCustomMultiplier: boolean;
  applyAboveArea: number;
  displayOrder: number;
  isActive: boolean;
}

export interface LevelFormData {
  code: string;
  name: string;
  nameEn: string;
  multiplier: string;
  displayOrder: number;
  isActive: boolean;
}
