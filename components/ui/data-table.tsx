"use client";

import { useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DataTableFilter<TData> {
  columnId: string;
  label: string;
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
  urlParam?: string;
  onFilterChange?: (value: string | null) => void;
  initialValue?: string | null;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchPlaceholder?: string;
  enableSearch?: boolean;
  filters?: DataTableFilter<TData>[];
  emptyMessage?: string;
  pageSize?: number;
  className?: string;
  // Server-side pagination props
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  // Server-side search props
  search?: string;
  onSearchChange?: (search: string) => void;
  // Disable client-side filtering/pagination when using server-side
  serverSide?: boolean;
}

export function DataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search...",
  enableSearch = true,
  filters = [],
  emptyMessage = "No results found",
  pageSize = 10,
  className,
  pagination: serverPagination,
  onPageChange,
  search: serverSearch,
  onSearchChange,
  serverSide = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState(serverSearch || "");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use server-side pagination if provided, otherwise use client-side
  const useServerPagination = serverSide && serverPagination && onPageChange;
  const useServerSearch = serverSide && onSearchChange !== undefined;

  // Debounce search for server-side search
  useEffect(() => {
    if (useServerSearch && onSearchChange) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        onSearchChange(globalFilter);
      }, 500);
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }
  }, [globalFilter, useServerSearch, onSearchChange]);

  // Sync serverSearch with local state when it changes externally
  useEffect(() => {
    if (useServerSearch && serverSearch !== undefined) {
      setGlobalFilter(serverSearch);
    }
  }, [serverSearch, useServerSearch]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: useServerPagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: useServerPagination ? undefined : getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter: useServerSearch ? globalFilter : globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: useServerPagination ? serverPagination.limit : pageSize,
        pageIndex: useServerPagination ? serverPagination.page - 1 : 0,
      },
    },
    manualPagination: useServerPagination,
    manualFiltering: useServerPagination,
  });

  const hasFilters = filters.length > 0;
  const hasSearch = enableSearch;

  return (
    <div className={className ? `space-y-4 ${className}` : "space-y-4"}>
      {(hasSearch || hasFilters) && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {hasSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
            {filters.map((filter) => {
              const column = table.getColumn(filter.columnId);
              // Use initialValue from URL if provided, otherwise use table state or default
              const filterValue =
                filter.initialValue !== undefined
                  ? filter.initialValue || "all"
                  : (column?.getFilterValue() as string) ||
                    filter.defaultValue ||
                    "all";

              return (
                <Select
                  key={filter.columnId}
                  value={filterValue}
                  onValueChange={(value) => {
                    const finalValue = value === "all" ? null : value;
                    
                    // If URL-based filter, call the callback instead of setting table filter
                    if (filter.onFilterChange) {
                      filter.onFilterChange(finalValue);
                    } else {
                      // Otherwise, use table's internal filter state
                      column?.setFilterValue(finalValue || undefined);
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            })}
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-500">
            {useServerPagination && serverPagination ? (
              <>
                Showing{" "}
                {(serverPagination.page - 1) * serverPagination.limit + 1} to{" "}
                {Math.min(
                  serverPagination.page * serverPagination.limit,
                  serverPagination.total
                )}{" "}
                of {serverPagination.total} results
              </>
            ) : (
              <>
                Showing{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}{" "}
                to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} results
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (useServerPagination && serverPagination && onPageChange) {
                  onPageChange(serverPagination.page - 1);
                } else {
                  table.previousPage();
                }
              }}
              disabled={
                useServerPagination
                  ? serverPagination?.page === 1
                  : !table.getCanPreviousPage()
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (useServerPagination && serverPagination && onPageChange) {
                  onPageChange(serverPagination.page + 1);
                } else {
                  table.nextPage();
                }
              }}
              disabled={
                useServerPagination
                  ? serverPagination?.page === serverPagination?.totalPages
                  : !table.getCanNextPage()
              }
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

