"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export interface ReportDownload {
  id: string;
  phoneNumber: string;
  ipAddress: string | null;
  userAgent: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportDownloadsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useReportDownloads() {
  const searchParams = useSearchParams();
  const [downloads, setDownloads] = useState<ReportDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<ReportDownloadsPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  useEffect(() => {
    fetchDownloads();
  }, [search, statusFilter, page, limit]);

  async function fetchDownloads() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const url = `/api/admin/report-downloads?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch report downloads");
      }

      const data = await response.json();
      setDownloads(data.data || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error("Error fetching report downloads:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    downloads,
    loading,
    pagination,
    statusFilter,
    search,
    page,
    limit,
  };
}
