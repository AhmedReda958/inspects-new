"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Lead {
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
}

export default function AdminLeads() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
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

  function getStatusColor(status: string) {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "qualified":
        return "bg-purple-100 text-purple-800";
      case "converted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Leads Management
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Total: {pagination.total} leads
              {statusFilter && ` (Status: ${statusFilter})`}
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/dashboard")}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={!statusFilter ? "default" : "outline"}
            onClick={() => router.push("/admin/leads")}
          >
            All
          </Button>
          <Button
            variant={statusFilter === "new" ? "default" : "outline"}
            onClick={() => router.push("/admin/leads?status=new")}
          >
            New
          </Button>
          <Button
            variant={statusFilter === "contacted" ? "default" : "outline"}
            onClick={() => router.push("/admin/leads?status=contacted")}
          >
            Contacted
          </Button>
          <Button
            variant={statusFilter === "qualified" ? "default" : "outline"}
            onClick={() => router.push("/admin/leads?status=qualified")}
          >
            Qualified
          </Button>
          <Button
            variant={statusFilter === "converted" ? "default" : "outline"}
            onClick={() => router.push("/admin/leads?status=converted")}
          >
            Converted
          </Button>
        </div>

        {/* Leads Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.firstName} {lead.familyName}
                        </div>
                        {lead.email && (
                          <div className="text-sm text-gray-500">
                            {lead.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.mobileNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.city?.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.package?.nameAr || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.finalPrice.toLocaleString("ar-SA")} SAR
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/leads/${lead.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
