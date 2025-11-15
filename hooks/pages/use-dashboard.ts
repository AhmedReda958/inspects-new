"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { DashboardStats } from "@/types/admin/dashboard";

export function useDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch("/api/admin/leads");

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();

      const totalLeads = data.pagination?.total || 0;
      const newLeads =
        data.data?.filter((l: { status: string }) => l.status === "new")
          .length || 0;
      const totalRevenue =
        data.data?.reduce(
          (sum: number, l: { finalPrice: number }) =>
            sum + Number(l.finalPrice),
          0
        ) || 0;

      setStats({
        totalLeads,
        newLeads,
        totalRevenue,
        activePackages: 3, // Hardcoded for now
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return {
    stats,
    loading,
    handleLogout,
  };
}
