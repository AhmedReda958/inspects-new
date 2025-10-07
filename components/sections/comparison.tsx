"use client";

import { SectionTitle } from "@/components/ui/section-title";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import content from "@/content";
import Image from "next/image";
import { MinusIcon, PlusIcon } from "lucide-react";

export function Comparison() {
  return (
    <section id="comparison" className="py-18 lg:py-24 bg-background">
      <div className="container">
        <SectionTitle
          variant="center"
          className="text-primary lg:text-foreground max-w-[358px] lg:max-w-none"
        >
          {content.comparison.title}
        </SectionTitle>

        {/* Desktop View - Table Layout */}
        <div className="hidden lg:block">
          <div className="space-y-0">
            {content.comparison.items.map((item) => (
              <div key={item.id}>
                {/* Category Title */}
                <div className="bg-primary py-4 px-6">
                  <h3 className="text-lg font-bold text-primary-foreground text-center">
                    {item.title}
                  </h3>
                </div>

                {/* Comparison Row */}
                <div className="grid grid-cols-2 gap-0 border-b border-border">
                  {/* Inspects Column */}
                  <div className="bg-white p-8 border-l border-border">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <Image
                        src={"/logo.svg"}
                        alt={"انسبكتكس"}
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                      <h4 className="text-xl font-bold text-primary">
                        انسبكتكس
                      </h4>
                    </div>
                    <ul className="space-y-3">
                      {item.inspects.map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-foreground"
                        >
                          <span className="text-secondary mt-1 flex-shrink-0">
                            ●
                          </span>
                          <span className="text-sm leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Competitors Column */}
                  <div className="bg-gray-50 p-8 border-r border-border">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <h4 className="text-xl font-bold text-foreground">
                        المنافسين
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                      {item.competitors}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View - Accordion */}
        <div className="lg:hidden mt-12">
          <Accordion type="single" collapsible className="space-y-4">
            {content.comparison.items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-border data-[state=open]:border-0 overflow-hidden bg-white"
              >
                <AccordionTrigger className="px-6 py-8 hover:no-underline bg-background data-[state=open]:bg-white data-[state=open]:text-primary-light  focus-visible:!border-none [&>svg]:hidden [&[data-state=open]_.plus-icon]:opacity-0 [&[data-state=open]_.plus-icon]:rotate-90 [&[data-state=open]_.minus-icon]:opacity-100 [&[data-state=closed]_.minus-icon]:opacity-0">
                  <span className="text-base font-bold flex-1 text-right">
                    {item.title}
                  </span>
                  <div className="size-5 flex items-center justify-center transition-colors relative">
                    <PlusIcon className="plus-icon size-5 transition-all duration-200 absolute" />
                    <MinusIcon className="minus-icon size-5 transition-all duration-200 absolute opacity-0 text-secondary" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  {/* Inspects Section */}
                  <div className="mb-6 border-b border-border pb-6">
                    <div className="flex items-center justify-start gap-3 mb-4">
                      <Image
                        src={"/logo.svg"}
                        alt={"انسبكتكس"}
                        width={50}
                        height={50}
                        className="w-12 h-12"
                      />
                      <h5 className="text-xl font-bold text-primary">
                        انسبكتكس
                      </h5>
                    </div>
                    <ul className="space-y-3">
                      {item.inspects.map((point, idx) => (
                        <li
                          key={idx}
                          className="text-base leading-relaxed text-foreground font-normal"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Competitors Section */}
                  <div>
                    <h5 className="text-xl font-bold text-primary pb-4">
                      المنافسين
                    </h5>
                    <p className="text-base leading-relaxed text-foreground font-normal">
                      {item.competitors}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
