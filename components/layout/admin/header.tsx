"use client";

import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?:
      | "default"
      | "outline"
      | "destructive"
      | "secondary"
      | "ghost"
      | "link";
  };
}

export function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || "outline"}
          >
            {action.label}
          </Button>
        )}
      </div>
    </header>
  );
}
