"use client";

import { useMemo, useCallback, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableFilter } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportDownload } from "@/hooks/pages/use-report-downloads";
import { cn } from "@/lib/utils";
import { MessageCircle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadsTableProps {
  downloads: ReportDownload[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onStatusUpdate?: () => void;
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

export function DownloadsTable({
  downloads,
  pagination,
  onStatusUpdate,
}: DownloadsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
  const statusFilterFromUrl = searchParams.get("status");
  const { toast } = useToast();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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
      router.push(`/admin/report-downloads?${params.toString()}`);
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

  const handleStatusChange = useCallback(
    async (downloadId: string, newStatus: string) => {
      setUpdatingStatus(downloadId);
      try {
        const response = await fetch(
          `/api/admin/report-downloads/${downloadId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Failed to update status");
        }

        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الحالة بنجاح!",
        });

        if (onStatusUpdate) {
          onStatusUpdate();
        } else {
          // Refresh the page data
          router.refresh();
        }
      } catch (error) {
        toast({
          title: "خطأ",
          description:
            error instanceof Error
              ? error.message
              : "فشل تحديث الحالة. يرجى المحاولة مرة أخرى.",
        });
      } finally {
        setUpdatingStatus(null);
      }
    },
    [toast, router, onStatusUpdate]
  );

  const columns = useMemo<ColumnDef<ReportDownload>[]>(
    () => [
      {
        accessorKey: "phoneNumber",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Phone Number" />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-gray-900 font-medium">
            {row.original.phoneNumber}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const download = row.original;
          const isUpdating = updatingStatus === download.id;

          return (
            <Select
              value={download.status}
              onValueChange={(value) => handleStatusChange(download.id, value)}
              disabled={isUpdating}
            >
              <SelectTrigger
                className={cn(
                  "w-[160px] h-8 border-0",
                  getStatusColor(download.status),
                  "hover:opacity-80"
                )}
                size="sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
          <div className="text-sm text-gray-600">
            {new Date(row.original.createdAt).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
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
          const download = row.original;
          const phoneNumber = download.phoneNumber.replace(/\s+/g, "");
          const whatsappUrl = `https://wa.me/${phoneNumber}`;
          const telUrl = `tel:${phoneNumber}`;

          return (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(whatsappUrl, "_blank")}
                className="border-[#25D366] hover:bg-[#25D366]/10"
                title="WhatsApp"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(telUrl, "_self")}
                className="border-primary hover:bg-primary/10"
                title="Phone Call"
              >
                <Phone className="h-4 w-4 text-primary" />
              </Button>
            </div>
          );
        },
      },
    ],
    [updatingStatus, handleStatusChange]
  );

  const statusFilter: DataTableFilter = {
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
    onFilterChange: (value: string | null) => {
      updateSearchParams({ status: value === "all" ? null : value });
    },
  };

  return (
    <DataTable
      data={downloads}
      columns={columns}
      searchPlaceholder="Search by phone number..."
      filters={[statusFilter]}
      emptyMessage="No report downloads found"
      pageSize={pagination.limit}
      serverSide={true}
      pagination={pagination}
      onPageChange={handlePageChange}
      search={searchFromUrl}
      onSearchChange={handleSearchChange}
    />
  );
}
