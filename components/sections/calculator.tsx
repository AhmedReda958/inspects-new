"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import content from "@/content";
import { SectionTitle } from "@/components/ui/section-title";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { AnimatedButton } from "../ui/animated-button";

// Define validation schema
const calculatorSchema = z.object({
  familyName: z.string().min(2, {
    message: "يجب أن يكون اسم العائلة على الأقل حرفين",
  }),
  firstName: z.string().min(2, {
    message: "يجب أن يكون الاسم الأول على الأقل حرفين",
  }),
  city: z.string().min(1, {
    message: "يرجى اختيار المدينة",
  }),
  mobileNumber: z.string().regex(/^(05|5)[0-9]{8}$/, {
    message: "يرجى إدخال رقم جوال سعودي صحيح",
  }),
  propertyType: z.string().min(1, {
    message: "يرجى اختيار نوع العقار",
  }),
  neighborhood: z.string().optional(),
  landArea: z
    .string()
    .min(1, { message: "يرجى إدخال مساحة الأرض" })
    .regex(/^\d+(\.\d+)?$/, {
      message: "يرجى إدخال رقم صحيح",
    }),
  propertyAge: z.string().min(1, {
    message: "يرجى اختيار عمر العقار",
  }),
  inspectionPurpose: z.string().min(1, {
    message: "يرجى اختيار الهدف من الفحص",
  }),
  coveredArea: z
    .string()
    .min(1, { message: "يرجى إدخال مساحة البناء المسقوفة" })
    .regex(/^\d+(\.\d+)?$/, {
      message: "يرجى إدخال رقم صحيح",
    }),
});

type CalculatorFormValues = z.infer<typeof calculatorSchema>;

// Calculation logic based on the detailed formula from the provided documentation
function calculateInspectionCost(data: CalculatorFormValues): number {
  const coveredArea = parseFloat(data.coveredArea);
  const landArea = parseFloat(data.landArea);

  let basePrice = 0;

  // Case 1: Small properties (≤ 250 m²)
  if (coveredArea <= 250) {
    basePrice = 5000;
  } else {
    // Case 2: Larger properties (> 250 m²)
    // Calculate number of floors
    const rawFloors = coveredArea / landArea;

    // Round to standard floor increments as per formula
    let numberOfFloors = 0;
    if (rawFloors <= 1.3) {
      numberOfFloors = rawFloors <= 1.1 ? 1.1 : 1.5;
    } else if (rawFloors <= 2.35) {
      numberOfFloors = rawFloors <= 2.2 ? 2.2 : 2.5;
    } else if (rawFloors <= 3.4) {
      numberOfFloors = rawFloors <= 3.3 ? 3.3 : 3.5;
    } else if (rawFloors <= 4.4) {
      numberOfFloors = 4.4;
    } else {
      numberOfFloors = Math.ceil(rawFloors);
    }

    // Base price calculation for properties > 250 m²
    basePrice = 5000; // Base for first floor

    // Calculate additional floors cost
    const additionalFloors = Math.max(0, numberOfFloors - 1);

    if (numberOfFloors <= 2) {
      // For up to 2 floors: add up to 5000 SAR (capped)
      const additionalCost = Math.min(additionalFloors * 9000, 5000);
      basePrice += additionalCost;
    } else {
      // For more than 2 floors:
      // - First additional floor costs up to 5000 SAR (capped at 5000)
      basePrice += 5000;
      // - Each additional floor beyond 2nd floor costs 750 SAR
      const floorsAboveTwo = numberOfFloors - 2;
      basePrice += floorsAboveTwo * 750;
    }
  }

  // Property type multiplier
  const typeMultipliers: Record<string, number> = {
    فيلا: 1.0,
    شقة: 0.85,
    دور: 0.9,
    عمارة: 1.15,
    قصر: 1.3,
    استراحة: 0.85,
  };

  basePrice *= typeMultipliers[data.propertyType] || 1.0;

  // Property age adjustment
  const ageMultipliers: Record<string, number> = {
    "أقل من سنة": 0.95,
    "من 1 إلى 3 سنوات": 1.0,
    "من 3 إلى 5 سنوات": 1.05,
    "من 5 إلى 10 سنوات": 1.1,
    "أكثر من 10 سنوات": 1.15,
  };

  basePrice *= ageMultipliers[data.propertyAge] || 1.0;

  // Add VAT (15%)
  const priceWithVAT = basePrice * 1.15;

  return Math.round(priceWithVAT);
}

export default function CalculatorSection() {
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<
    string[]
  >([]);

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      familyName: "",
      firstName: "",
      city: "",
      mobileNumber: "",
      propertyType: "",
      neighborhood: "",
      landArea: "",
      propertyAge: "",
      inspectionPurpose: "",
      coveredArea: "",
    },
  });

  // Watch for city changes and update neighborhoods
  const selectedCity = form.watch("city");

  useEffect(() => {
    if (selectedCity) {
      const neighborhoods =
        content.calculator.cityNeighborhoods[
          selectedCity as keyof typeof content.calculator.cityNeighborhoods
        ] || [];
      setAvailableNeighborhoods(neighborhoods);
      // Reset neighborhood when city changes
      form.setValue("neighborhood", "");
    } else {
      setAvailableNeighborhoods([]);
    }
  }, [selectedCity, form]);

  function onSubmit(data: CalculatorFormValues) {
    const price = calculateInspectionCost(data);
    setCalculatedPrice(price);
    console.log("Form data:", data);
    console.log("Calculated price:", price);
  }

  return (
    <section
      id="price-calculator"
      className="min-h-screen py-20 md:py-32 bg-white relative"
    >
      <div className="container space-y-16 px-4 md:px-6">
        <SectionTitle variant="center">{content.calculator.title}</SectionTitle>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-8 items-start max-w-6xl mx-auto">
          {/* Right side - Form */}
          <div className="col-span-3 lg:col-span-2 w-full  mx-auto lg:mx-0 order-last lg:order-first">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" grid lg:grid-cols-2 gap-6 lg:gap-8"
              >
                {/* Family Name */}
                <FormField
                  control={form.control}
                  name="familyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.familyName.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            content.calculator.fields.familyName.placeholder
                          }
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />

                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.firstName.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            content.calculator.fields.firstName.placeholder
                          }
                          {...field}
                          dir="rtl"
                        />
                      </FormControl>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />
                {/* Mobile Number */}
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.mobileNumber.label}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            content.calculator.fields.mobileNumber.placeholder
                          }
                          {...field}
                          dir="rtl"
                          type="tel"
                        />
                      </FormControl>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />
                {/* City */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.city.label}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger dir="rtl" className="w-full">
                            <SelectValue
                              placeholder={
                                content.calculator.fields.city.placeholder
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {content.calculator.fields.city.options.map(
                            (option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />

                {/* Neighborhood */}
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.neighborhood.label}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={
                          !selectedCity || availableNeighborhoods.length === 0
                        }
                      >
                        <FormControl>
                          <SelectTrigger dir="rtl" className="w-full">
                            <SelectValue
                              placeholder={
                                !selectedCity
                                  ? "اختر المدينة أولاً"
                                  : availableNeighborhoods.length === 0
                                  ? "لا توجد أحياء متاحة"
                                  : content.calculator.fields.neighborhood
                                      .placeholder
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableNeighborhoods.map((neighborhood) => (
                            <SelectItem key={neighborhood} value={neighborhood}>
                              {neighborhood}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />

                {/* Property Type */}
                <FormField
                  control={form.control}
                  name="propertyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.propertyType.label}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger dir="rtl" className="w-full">
                            <SelectValue
                              placeholder={
                                content.calculator.fields.propertyType
                                  .placeholder
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {content.calculator.fields.propertyType.options.map(
                            (option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />

                {/* Property Age */}
                <FormField
                  control={form.control}
                  name="propertyAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.propertyAge.label}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger dir="rtl" className="w-full">
                            <SelectValue
                              placeholder={
                                content.calculator.fields.propertyAge
                                  .placeholder
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {content.calculator.fields.propertyAge.options.map(
                            (option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />

                {/* Land Area */}
                <FormField
                  control={form.control}
                  name="landArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.landArea.label}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder={
                              content.calculator.fields.landArea.placeholder
                            }
                            {...field}
                            dir="rtl"
                            type="text"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-primary">
                            {content.calculator.fields.landArea.suffix}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />

                {/* Covered Area */}
                <FormField
                  control={form.control}
                  name="coveredArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.coveredArea.label}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder={
                              content.calculator.fields.coveredArea.placeholder
                            }
                            {...field}
                            dir="rtl"
                            type="text"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-primary">
                            {content.calculator.fields.coveredArea.suffix}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />

                {/* Inspection Purpose */}
                <FormField
                  control={form.control}
                  name="inspectionPurpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir="rtl">
                        {content.calculator.fields.inspectionPurpose.label}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger dir="rtl" className="w-full">
                            <SelectValue
                              placeholder={
                                content.calculator.fields.inspectionPurpose
                                  .placeholder
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {content.calculator.fields.inspectionPurpose.options.map(
                            (option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage dir="rtl" />
                    </FormItem>
                  )}
                />
                <div className="lg:col-span-2">
                  {/* Display calculated price */}
                  {calculatedPrice !== null && (
                    <div
                      className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                      dir="rtl"
                    >
                      <p className="text-lg text-foreground mb-3 font-medium">
                        التكلفة التقديرية للفحص
                      </p>
                      <p className="text-4xl font-bold text-primary mb-2">
                        {calculatedPrice.toLocaleString("ar-SA")} ريال
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        (شامل ضريبة القيمة المضافة 15%)
                      </p>
                      <p className="text-xs text-muted-foreground border-t border-primary/20 pt-3 mt-3">
                        * هذا السعر تقديري وقد يختلف حسب الحالة الفعلية للعقار
                      </p>
                    </div>
                  )}
                </div>
                {/* Submit Button */}
                <div className="lg:col-span-2 flex justify-center lg:justify-end">
                  <AnimatedButton
                    type="submit"
                    className="w-[200px] lg:w-[250px] h-fit"
                  >
                    {content.calculator.submitButton}
                  </AnimatedButton>
                </div>
              </form>
            </Form>
          </div>
          {/* Left side - Image (Hidden on mobile, shown on desktop) */}
          <div className="col-span-3 lg:col-span-1 relative w-full h-[450px] lg:h-[calc(100%-88px)]">
            <Image
              src="/images/sections/calulator.png"
              alt="Calculator illustration"
              fill
              className="object-fit"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
