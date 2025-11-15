export interface Lead {
  id: string;
  firstName: string;
  familyName: string;
  mobileNumber: string;
  email?: string;
  status: string;
  finalPrice: number;
  createdAt: string;
  city?: { name: string };
  package?: { nameAr: string };
  notes?: string;
  assignedTo?: string;
  followUpDate?: string;
  basePrice: number;
  priceBeforeVat: number;
  vatAmount: number;
  landArea: number;
  coveredArea: number;
  neighborhood?: { name: string; level: string };
  propertyAge?: { ageRange: string };
  inspectionPurpose?: { purpose: string };
  calculationBreakdown: any;
}

export interface LeadUpdateFormData {
  status: "new" | "contacted" | "qualified" | "converted" | "rejected";
  notes?: string;
  assignedTo?: string;
  followUpDate?: string;
}

export interface LeadsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
