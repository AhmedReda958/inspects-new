"use client";

import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/types/admin/dashboard";

interface StatsGridProps {
  stats: DashboardStats | null;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <h3 className="text-sm font-medium  mb-2">Total Leads</h3>
        <p className="text-3xl font-bold text-primary">
          {stats?.totalLeads || 0}
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium  mb-2">New Leads</h3>
        <p className="text-3xl font-bold text-green-600">
          {stats?.newLeads || 0}
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium  mb-2">Total Revenue</h3>
        <p className="text-3xl font-bold text-primary">
          {stats?.totalRevenue.toLocaleString("en")} SAR
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-medium  mb-2">Active Packages</h3>
        <p className="text-3xl font-bold text-primary">
          {stats?.activePackages || 0}
        </p>
      </Card>
    </div>
  );
}
