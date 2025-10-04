import { SectionTitle } from "@/components/ui/section-title";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function FeaturedClients() {
  return (
    <section className="py-16 lg:py-24 bg-background" id="featured-clients">
      {/* Section Title */}

      <SectionTitle>العملاء المميزون</SectionTitle>

      {/* Clients Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8  mt-16 bg-white">
        {Array.from({ length: 16 }, (_, i) => i + 1).map((id) => (
          <div
            key={id}
            className={cn(
              `flex items-center justify-center p-4 aspect-square border-0 lg:border-[1px]`,
              {
                "!border-b-0": id >= 9,
                "!border-t-0": id < 9,
                "!border-l-0": id === 8 || id === 16,
              }
            )}
          >
            <div className="relative w-full h-full">
              <Image
                src={`/images/featured-clients/Logo-${id}.png`}
                alt={`Client ${id}`}
                fill
                className="object-contain"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
