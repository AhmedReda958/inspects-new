"use client";

import { AdminHeader } from "@/components/layout/admin/header";
import { LoadingSpinner } from "@/components/layout/admin/loading-spinner";
import { StatsGrid } from "./stats-grid";
import { QuickLinks } from "./quick-links";
import { useDashboard } from "@/hooks/pages/use-dashboard";

export function DashboardPage() {
  const { stats, loading, handleLogout } = useDashboard();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <AdminHeader
        title="Admin Dashboard"
        action={{
          label: "Logout",
          onClick: handleLogout,
        }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsGrid stats={stats} />
        <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
        <QuickLinks />
      </main>
    </>
  );
}
