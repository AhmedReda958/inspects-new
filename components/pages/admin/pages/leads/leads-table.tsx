"use client";

import { useMemo, useCallback } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableFilter } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { Lead } from "@/types/admin/leads";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export function LeadsTable({ leads, pagination }: LeadsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilterFromUrl = searchParams.get("status");
  const searchFromUrl = searchParams.get("search") || "";

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      // Reset to page 1 when search or filter changes
      if (updates.search !== undefined || updates.status !== undefined) {
        params.set("page", "1");
      }
      router.push(`/admin/leads?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      updateSearchParams({ search: search || null });
    },
    [updateSearchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateSearchParams({ page: page.toString() });
    },
    [updateSearchParams]
  );

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div>
              <div className="text-sm font-medium text-gray-900">
                {lead.firstName} {lead.familyName}
              </div>
              {lead.email && (
                <div className="text-sm text-gray-500">{lead.email}</div>
              )}
            </div>
          );
        },
        accessorFn: (row) =>
          `${row.firstName} ${row.familyName} ${row.email || ""}`,
      },
      {
        accessorKey: "mobileNumber",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Phone" />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {row.original.mobileNumber}
          </div>
        ),
      },
      {
        accessorKey: "city",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="City" />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {row.original.city?.name || "-"}
          </div>
        ),
        accessorFn: (row) => row.city?.name || "",
      },
      {
        accessorKey: "package",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Package" />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {row.original.package?.nameAr || "-"}
          </div>
        ),
        accessorFn: (row) => row.package?.nameAr || "",
      },
      {
        accessorKey: "finalPrice",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {row.original.finalPrice.toLocaleString("ar-SA")} SAR
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                getStatusColor(status)
              )}
            >
              {status}
            </span>
          );
        },
        filterFn: (row, id, value) => {
          return value === "all" || row.getValue(id) === value;
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-gray-500">
            {new Date(row.original.createdAt).toLocaleDateString("en-GB")}
          </div>
        ),
        sortingFn: (rowA, rowB) => {
          const dateA = new Date(rowA.original.createdAt).getTime();
          const dateB = new Date(rowB.original.createdAt).getTime();
          return dateA - dateB;
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/leads/${lead.id}`)}
            >
              View
            </Button>
          );
        },
      },
    ],
    [router]
  );

  const statusFilter: DataTableFilter<Lead> = {
    columnId: "status",
    label: "Status",
    options: [
      { label: "New", value: "new" },
      { label: "Contacted", value: "contacted" },
      { label: "Qualified", value: "qualified" },
      { label: "Converted", value: "converted" },
      { label: "Rejected", value: "rejected" },
    ],
    defaultValue: "all",
    initialValue: statusFilterFromUrl,
    onFilterChange: (value) => {
      updateSearchParams({ status: value });
    },
  };

  return (
    <DataTable
      data={leads}
      columns={columns}
      searchPlaceholder="Search leads..."
      filters={[statusFilter]}
      emptyMessage="No leads found"
      pageSize={pagination.limit}
      serverSide={true}
      pagination={pagination}
      onPageChange={handlePageChange}
      search={searchFromUrl}
      onSearchChange={handleSearchChange}
    />
  );
}
