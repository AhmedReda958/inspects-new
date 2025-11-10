"use client";

import * as React from "react";
import { SectionTitle } from "@/components/ui/section-title";
import content from "@/content";
import { PackageCard, type Package } from "./package-card";
import { PackageComparison } from "./package-comparison";
import Icon1 from "@/icons/packages/1.svg";
import Icon2 from "@/icons/packages/2.svg";
import Icon3 from "@/icons/packages/3.svg";

const getPackageIcon = (id: string) => {
  switch (id) {
    case "visual":
      return <Icon1 />;
    case "comprehensive":
      return <Icon2 />;
    case "advanced":
      return <Icon3 />;
    default:
      return null;
  }
};

const packages: Package[] = content.packages.items.map((pkg) => ({
  ...pkg,
  icon: getPackageIcon(pkg.id),
}));

export default function PackagesSection() {
  return (
    <section id="packages" className="min-h-screen py-20 md:py-32 bg-white">
      <div className="container space-y-16 px-4 xl:px-20">
        <SectionTitle variant="center">{content.packages.title}</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-6 items-stretch">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <PackageComparison />
      </div>
    </section>
  );
}
