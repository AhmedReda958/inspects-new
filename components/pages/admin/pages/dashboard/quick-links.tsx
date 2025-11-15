import Link from "next/link";
import {
  Package,
  MapPin,
  Calculator,
  List,
  Sparkles,
  Phone,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface QuickLinkItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  gradient: string;
}

const quickLinks: QuickLinkItem[] = [
  {
    href: "/admin/packages",
    label: "Manage Packages",
    icon: <Package className="w-6 h-6" />,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    href: "/admin/locations",
    label: "Manage Locations",
    icon: <MapPin className="w-6 h-6" />,
    gradient: "from-green-500 to-green-600",
  },
  {
    href: "/admin/multipliers",
    label: "Manage Multipliers",
    icon: <Calculator className="w-6 h-6" />,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    href: "/admin/leads",
    label: "View All Leads",
    icon: <List className="w-6 h-6" />,
    gradient: "from-orange-500 to-orange-600",
  },
  {
    href: "/admin/leads?status=new",
    label: "New Leads",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-yellow-500 to-yellow-600",
  },
  {
    href: "/admin/leads?status=contacted",
    label: "Contacted Leads",
    icon: <Phone className="w-6 h-6" />,
    gradient: "from-teal-500 to-teal-600",
  },
  {
    href: "/admin/settings",
    label: "System Settings",
    icon: <Settings className="w-6 h-6" />,
    gradient: "from-gray-500 to-gray-600",
  },
];

export function QuickLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quickLinks.map((link, index) => (
        <Link key={index} href={link.href}>
          <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer h-full flex flex-col items-center justify-center text-center group">
            <div
              className={`p-4 rounded-xl bg-gradient-to-br ${link.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-200`}
            >
              {link.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {link.label}
            </h3>
          </Card>
        </Link>
      ))}
    </div>
  );
}
