export interface Multiplier {
  id: string;
  ageRange?: string;
  purpose?: string;
  ageRangeEn?: string;
  purposeEn?: string;
  multiplier: number;
  displayOrder: number;
  isActive: boolean;
}

export interface AgeFormData {
  ageRange: string;
  ageRangeEn: string;
  multiplier: string;
  displayOrder: number;
  isActive: boolean;
}

export interface PurposeFormData {
  purpose: string;
  purposeEn: string;
  multiplier: string;
  displayOrder: number;
  isActive: boolean;
}
