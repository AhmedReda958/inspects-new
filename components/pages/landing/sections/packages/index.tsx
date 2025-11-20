"use client";

import * as React from "react";
import { SectionTitle } from "@/components/ui/section-title";
import content from "@/content";
import { PackageCard, type Package } from "./package-card";
import { PackageComparison } from "./package-comparison";
import { PackageComparisonMobileList } from "./package-comparison-mobile";
import { PackageNote } from "./package-note";
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

// Format price without number formatting
function formatPrice(basePrice: number): string {
  return `ابتداء من ${basePrice} ريال`;
}

export default function PackagesSection() {
  const [packages, setPackages] = React.useState<Package[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchPackagePrices() {
      try {
        const response = await fetch("/api/packages");
        if (!response.ok) throw new Error("Failed to fetch packages");

        const result = await response.json();
        if (result.success && result.data) {
          // Create a map of package IDs to basePrice
          const priceMap = new Map<string, number>();
          result.data.forEach((pkg: { id: string; basePrice: number }) => {
            priceMap.set(pkg.id, pkg.basePrice);
          });

          // Merge database prices with content.ts data
          const packagesWithPrices: Package[] = content.packages.items.map(
            (pkg) => {
              const basePrice = priceMap.get(pkg.id);
              const price = basePrice ? formatPrice(basePrice) : pkg.price; // Fallback to content.ts price

              return {
                ...pkg,
                price,
                icon: getPackageIcon(pkg.id),
              };
            }
          );

          setPackages(packagesWithPrices);
        } else {
          // Fallback to content.ts prices
          setPackages(
            content.packages.items.map((pkg) => ({
              ...pkg,
              icon: getPackageIcon(pkg.id),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching package prices:", error);
        // Fallback to content.ts prices
        setPackages(
          content.packages.items.map((pkg) => ({
            ...pkg,
            icon: getPackageIcon(pkg.id),
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPackagePrices();
  }, []);

  return (
    <section id="packages" className="min-h-screen py-20 md:py-32 bg-white">
      <div className="container space-y-16 px-4 xl:px-20">
        <SectionTitle variant="center">{content.packages.title}</SectionTitle>

        {/* Desktop Version */}
        <div className="hidden xl:block">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-6 items-stretch">
              {content.packages.items.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={{
                    ...pkg,
                    icon: getPackageIcon(pkg.id),
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-6 items-stretch">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
          <h4 className="mx-auto my-18 text-center font-medium">
            المزيد من التفاصيل
          </h4>
          <PackageComparison />
        </div>

        {/* Mobile Version */}
        <div className="block xl:hidden">
          <PackageComparisonMobileList
            packages={
              loading
                ? undefined
                : packages.map((pkg) => ({
                    id: pkg.id,
                    title: pkg.title,
                    price: pkg.price,
                  }))
            }
            loading={loading}
          />
        </div>

        <PackageNote />
      </div>
    </section>
  );
}
