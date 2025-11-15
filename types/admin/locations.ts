export interface City {
  id: string;
  name: string;
  nameEn?: string;
  isActive: boolean;
  displayOrder: number;
  neighborhoods: Neighborhood[];
}

export interface Neighborhood {
  id: string;
  name: string;
  nameEn?: string;
  level: string;
  multiplier: number;
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
  multiplier: string;
  applyAboveArea: number;
  displayOrder: number;
  isActive: boolean;
}
