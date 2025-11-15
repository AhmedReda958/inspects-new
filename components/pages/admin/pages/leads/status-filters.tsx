"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface StatusFiltersProps {
  statusFilter: string | null;
}

export function StatusFilters({ statusFilter }: StatusFiltersProps) {
  const router = useRouter();

  return (
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
  );
}
