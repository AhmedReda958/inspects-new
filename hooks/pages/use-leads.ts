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
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const statusFilter = searchParams.get("status");
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, search, page, limit]);

  async function fetchLeads() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const url = `/api/admin/leads?${params.toString()}`;
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
    search,
    page,
    limit,
  };
}
