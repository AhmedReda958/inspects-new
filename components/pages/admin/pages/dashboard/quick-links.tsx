"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickLinks() {
  const router = useRouter();

  return (
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
  );
}
