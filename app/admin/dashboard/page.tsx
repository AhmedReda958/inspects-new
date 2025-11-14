"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  totalRevenue: number;
  activePackages: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      // Fetch dashboard statistics
      const response = await fetch("/api/admin/leads");

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();

      // Calculate basic stats from leads
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Leads
            </h3>
            <p className="text-3xl font-bold text-primary">
              {stats?.totalLeads || 0}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              New Leads
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats?.newLeads || 0}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-primary">
              {stats?.totalRevenue.toLocaleString("ar-SA")} SAR
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Active Packages
            </h3>
            <p className="text-3xl font-bold text-primary">
              {stats?.activePackages || 0}
            </p>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configuration</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/admin/packages")}
              >
                Manage Packages
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/admin/locations")}
              >
                Manage Locations
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/admin/multipliers")}
              >
                Manage Multipliers
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lead Management</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/admin/leads")}
              >
                View All Leads
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/admin/leads?status=new")}
              >
                New Leads
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/admin/leads?status=contacted")}
              >
                Contacted Leads
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/admin/settings")}
              >
                System Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/admin/packages")}
              >
                Package Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/admin/locations")}
              >
                Location Settings
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
