import content from "@/content";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Fragment } from "react";
import { SectionTitle } from "@/components/ui/section-title";
import { PlusIcon } from "lucide-react";

interface InspectionItem {
  title: string;
  icon?: string;
  subItems: string[];
}

interface TabContentProps {
  items: InspectionItem[];
  image: string;
  imageMobile: string;
}

function TabContentSection({ items, image, imageMobile }: TabContentProps) {
  return (
    <div className="grid  lg:grid-cols-12 gap-8">
      {/* Accordion List */}
      <div className="order-2 lg:order-1 col-span-12 lg:col-span-7">
        <Accordion type="single" collapsible className="space-y-0">
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={cn(
                "border-b-2 border-[#032DA619]",
                index === 0 && "border-t-2"
              )}
            >
              <AccordionTrigger
                className={cn(
                  "hover:no-underline py-5 lg:py-6 text-right gap-6 lg:gap-8 [&>svg]:hidden",
                  "lg:[&[data-state=open]_.icon-wrapper]:bg-secondary",
                  "[&[data-state=open]_.icon-wrapper]:text-secondary lg:[&[data-state=open]_.icon-wrapper]:text-white",
                  "[&[data-state=open]_.icon]:rotate-45",
                  "[&[data-state=open]]:text-primary-light",
                  item.subItems.length === 0 &&
                    "pointer-events-none cursor-default"
                )}
              >
                <div className="flex items-center gap-4 flex-1">
                  {item.icon && (
                    <div className="flex-shrink-0 lg:p-1 lg:bg-background">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    </div>
                  )}
                  <span className="flex-1 font-semibold text-base lg:text-xl leading-[1.45] text-right">
                    {item.title}
                  </span>
                </div>
                <div className="icon-wrapper flex items-center justify-center lg:w-10 lg:h-10 transition-colors">
                  <PlusIcon className="icon size-5 transition-transform duration-200" />
                </div>
              </AccordionTrigger>
              {item.subItems.length > 0 && (
                <AccordionContent className="pb-6 pt-0">
                  <ul className="space-y-5 text-right">
                    {item.subItems.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className="lg:text-primary text-base lg:text-xl leading-[1.45]"
                      >
                        {subItem}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {/* Image */}
      <div className="col-span-12 lg:col-span-5 relative aspect-[4/3] lg:aspect-auto h-[450px] lg:h-[750px] w-full overflow-hidden order-1 lg:order-2">
        {/* Mobile Image */}
        <Image
          src={imageMobile}
          alt="Inspection illustration"
          fill
          className="object-contain lg:hidden"
        />
        {/* Desktop Image */}
        <Image
          src={image}
          alt="Inspection illustration"
          fill
          className="object-contain hidden lg:block"
        />
      </div>
    </div>
  );
}

export default function InspectionContentsSection() {
  return (
    <section id="inspection-contents" className="bg-white py-20 lg:py-32">
      <div className="container space-y-12 lg:space-y-[70px]">
        {/* Header */}
        <SectionTitle variant="center">
          {content.inspectionContents.title}
        </SectionTitle>

        {/* Tabs */}
        <Tabs defaultValue="architectural" className="w-full" dir="rtl">
          <div className="flex justify-center mb-8 lg:mb-12">
            <TabsList className="inline-flex flex-col lg:flex-row h-auto w-full lg:w-fit bg-transparent p-0 gap-5">
              {content.inspectionContents.tabs.map((tab, index) => (
                <Fragment key={tab.id}>
                  <TabsTrigger
                    value={tab.id}
                    className="p-4 lg:p-0 text-base font-semibold cursor-pointer flex items-center gap-3"
                  >
                    <div className="lg:p-1 lg:bg-background flex-shrink-0">
                      <Image
                        src={tab.icon}
                        alt={tab.label}
                        width={40}
                        height={40}
                        className="w-12 h-12"
                      />
                    </div>
                    {tab.label}
                  </TabsTrigger>
                  {index < content.inspectionContents.tabs.length - 1 && (
                    <div className="hidden lg:flex items-center text-neutral-300">
                      {"//"}
                    </div>
                  )}
                </Fragment>
              ))}
            </TabsList>
          </div>

          <TabsContent value="mechanical" className="mt-0">
            <TabContentSection
              items={content.inspectionContents.content.mechanical.items}
              image={content.inspectionContents.content.mechanical.image}
              imageMobile="/images/sections/inspection-contents/mobile/mechanical.png"
            />
          </TabsContent>

          <TabsContent value="electrical" className="mt-0">
            <TabContentSection
              items={content.inspectionContents.content.electrical.items}
              image={content.inspectionContents.content.electrical.image}
              imageMobile="/images/sections/inspection-contents/mobile/electrical.png"
            />
          </TabsContent>

          <TabsContent value="architectural" className="mt-0">
            <TabContentSection
              items={content.inspectionContents.content.architectural.items}
              image={content.inspectionContents.content.architectural.image}
              imageMobile="/images/sections/inspection-contents/mobile/architectural.png"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
