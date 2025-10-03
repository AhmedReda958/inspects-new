import content from "@/content";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { SectionTitle } from "../ui/section-title";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";

interface InspectionItem {
  title: string;
  subItems: string[];
}

interface TabContentProps {
  items: InspectionItem[];
}

const ContentItem = ({ item }: { item: InspectionItem }) => {
  return (
    <AccordionItem
      key={item.title}
      value={`item-${item.title}`}
      className={cn(
        "border-1 transition-all duration-200",
        "[&[data-state=open]]:bg-white [&[data-state=open]]:outline-3 outline-border"
      )}
    >
      <AccordionTrigger
        className={cn(
          "hover:no-underline px-6 py-3 lg:py-5 text-right gap-6 lg:gap-8 [&>svg]:hidden",
          "[&[data-state=open]_.icon]:hidden",
          "[&[data-state=open]_.icon-minus]:block",
          "[&[data-state=open]]:text-primary-light",
          item.subItems.length === 0 && "pointer-events-none cursor-default"
        )}
      >
        <span className="flex-1 font-semibold text-sm lg:text-base leading-[1.45] text-right flex items-center gap-4">
          <MinusIcon className="icon-minus size-5 text-secondary hidden" />
          {item.title}
        </span>
        <div>
          <PlusIcon className="icon size-5 transition-transform duration-200" />
        </div>
      </AccordionTrigger>
      {item.subItems.length > 0 && (
        <AccordionContent className="px-6 pb-6 pt-0">
          <ul className="space-y-5 text-right">
            {item.subItems.map((subItem, subIndex) => (
              <li
                key={subIndex}
                className="text-base lg:text-xl leading-[1.45]"
              >
                {subItem}
              </li>
            ))}
          </ul>
        </AccordionContent>
      )}
    </AccordionItem>
  );
};

function TabContentSection({ items }: TabContentProps) {
  const midPoint = Math.ceil(items.length / 2);
  const firstHalf = items.slice(0, midPoint);
  const secondHalf = items.slice(midPoint);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* First half */}
      <Accordion type="single" collapsible className="space-y-4">
        {firstHalf.map((item) => (
          <ContentItem key={item.title} item={item} />
        ))}
      </Accordion>

      {/* Second half */}
      <Accordion type="single" collapsible className="space-y-4">
        {secondHalf.map((item) => (
          <ContentItem key={item.title} item={item} />
        ))}
      </Accordion>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="bg-background py-20 lg:py-32 min-h-screen relative overflow-hidden"
    >
      <div className="container space-y-12 lg:space-y-[70px] ">
        {/* Header */}
        <SectionTitle variant="center">{content.faq.title}</SectionTitle>

        {/* Tabs */}
        <Tabs className="w-full" dir="rtl" defaultValue="customers">
          <div className="flex justify-center mb-8 lg:mb-12">
            <TabsList className="inline-flex flex-col lg:flex-row h-auto w-full lg:w-fit bg-transparent p-0 gap-5">
              {content.faq.tabs.map((tab, index) => (
                <Fragment key={tab.id}>
                  <TabsTrigger
                    value={tab.id}
                    className="p-4 lg:p-0 text-base font-semibold cursor-pointer"
                  >
                    {tab.label}
                  </TabsTrigger>
                  {index < content.faq.tabs.length - 1 && (
                    <div className="hidden lg:flex items-center text-neutral-300">
                      {"//"}
                    </div>
                  )}
                </Fragment>
              ))}
            </TabsList>
          </div>

          <TabsContent value="inspectors" className="mt-0">
            <TabContentSection items={content.faq.content.inspectors.items} />
          </TabsContent>

          <TabsContent value="strategies" className="mt-0">
            <TabContentSection items={content.faq.content.strategies.items} />
          </TabsContent>

          <TabsContent value="customers" className="mt-0">
            <TabContentSection items={content.faq.content.customers.items} />
          </TabsContent>
        </Tabs>
        {/* Background Image - Desktop Only */}
      </div>
      <Image
        src="/images/bg/faq-bg.png"
        alt="Hero Background"
        width={400}
        height={700}
        className="absolute -bottom-30 left-20 object-cover -z-10  w-2/3 h-full opacity-70 hidden lg:block mix-blend-luminosity"
        draggable={false}
        loading="lazy"
      />
    </section>
  );
}
