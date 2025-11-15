"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Lead, LeadsPagination } from "@/types/admin/leads";

export function useLeads() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<LeadsPagination>({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  const statusFilter = searchParams.get("status");

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  async function fetchLeads() {
    try {
      const url = statusFilter
        ? `/api/admin/leads?status=${statusFilter}`
        : "/api/admin/leads";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }

      const data = await response.json();
      setLeads(data.data || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    leads,
    loading,
    pagination,
    statusFilter,
  };
}
