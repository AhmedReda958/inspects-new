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
      <div className="container px-8">
        <SectionTitle
          variant="center"
          className="text-primary lg:text-foreground max-w-[358px] lg:max-w-none"
        >
          {content.comparison.title}
        </SectionTitle>

        {/* Desktop View - Table Layout */}
        <div className=" hidden lg:block mt-16 overflow-hidden bg-background">
          {/* Table Header */}
          <div className="grid grid-cols-3  border-primary-light/10 border-b-2 ">
            <div className="p-10  ps-0">
              <h3 className="text-primary">المقياس</h3>
            </div>
            <div className="p-10  bg-white">
              <div className="flex items-center justify-start gap-3">
                <Image
                  src={"/logo.svg"}
                  alt={"انسبكتكس"}
                  width={50}
                  height={50}
                  className="w-12 h-12"
                />
                <h3 className="text-primary">انسبكتكس</h3>
              </div>
            </div>
            <div className="p-10 ">
              <h3 className="text-primary">المنافسين</h3>
            </div>
          </div>

          {/* Table Rows */}
          {content.comparison.items.map((item, index) => (
            <div
              key={item.id}
              className={`grid grid-cols-3 border-primary-light/10 border-b-2 last:border-b-0`}
            >
              {/* Metric Column */}
              <div className="p-12 ps-0 bg-background">
                <h3>{item.title}</h3>
              </div>

              {/* Inspectex Column */}
              <div className="py-12 px-8  bg-white">
                <ul className="space-y-4">
                  {item.inspects.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-foreground/80 "
                    >
                      <span className="mt-1 flex-shrink-0 text-[8px]">●</span>
                      <span className="text-base leading-relaxed font-medium">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Competitors Column */}
              <div className="py-12 px-8 bg-background">
                <p className="text-base font-medium text-foreground/80 leading-relaxed flex items-start gap-2">
                  <span className="mt-1 flex-shrink-0 text-[8px]">●</span>
                  {item.competitors}
                </p>
              </div>
            </div>
          ))}
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
