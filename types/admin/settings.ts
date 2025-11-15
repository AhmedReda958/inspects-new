export interface VatFormData {
  percentage: number;
}

export interface RuleFormData {
  base_area_threshold: string;
  neighborhood_multiplier_threshold: string;
  roofed_area_calculation_factor: string;
  basic_package_excess_area_price: string;
}

export interface VatData {
  percentage: number;
}

export interface CalculationRule {
  id: string;
  key: string;
  value: string;
}
