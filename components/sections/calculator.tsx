"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

// Define validation schema
const calculatorSchema = z.object({
  firstName: z.string().min(2, {
    message: "يجب أن يكون الاسم الأول على الأقل حرفين",
  }),
  familyName: z.string().min(2, {
    message: "يجب أن يكون اسم العائلة على الأقل حرفين",
  }),
  mobileNumber: z
    .string()
    .regex(/^((05|5)\d{8}|01[1-7]\d{7}|9200\d{5}|800\d{6})$/, {
      message: "يرجى إدخال رقم جوال سعودي صحيح",
    }),
  package: z.string().min(1, {
    message: "يرجى اختيار الباقة",
  }),
  inspectionPurpose: z.string().min(1, {
    message: "يرجى اختيار الهدف من الفحص",
  }),
  city: z.string().min(1, {
    message: "يرجى اختيار المدينة",
  }),
  neighborhood: z.string().optional(),
  propertyAge: z.string().min(1, {
    message: "يرجى اختيار عمر العقار",
  }),
  landArea: z
    .string()
    .min(1, { message: "يرجى إدخال مساحة الأرض" })
    .regex(/^\d+(\.\d+)?$/, {
      message: "يرجى إدخال رقم صحيح",
    }),
  coveredArea: z
    .string()
    .min(1, { message: "يرجى إدخال مسطحات البناء" })
    .regex(/^\d+(\.\d+)?$/, {
      message: "يرجى إدخال رقم صحيح",
    }),
});

type CalculatorFormValues = z.infer<typeof calculatorSchema>;

interface PriceCalculationResponse {
  price: number;
  basePrice: number;
  vatAmount: number;
  breakdown: {
    floorsCost: number;
    ageMultiplier: number;
    numberOfFloors: number;
  };
}

export default function CalculatorSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [priceDetails, setPriceDetails] =
    useState<PriceCalculationResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<
    string[]
  >([]);
  const searchParams = useSearchParams();

  const totalSteps = 4;

  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      familyName: "",
      mobileNumber: "",
      package: "",
      inspectionPurpose: "",
      city: "",
      neighborhood: "",
      propertyAge: "",
      landArea: "",
      coveredArea: "",
    },
  });

  // Auto-select package from URL search params
  useEffect(() => {
    const packageParam = searchParams.get("package");
    if (
      packageParam &&
      (packageParam === "basic" ||
        packageParam === "premium" ||
        packageParam === "vip")
    ) {
      form.setValue("package", packageParam);
    }
  }, [searchParams, form]);

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

  async function validateStep(step: number): Promise<boolean> {
    let fieldsToValidate: (keyof CalculatorFormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ["firstName", "familyName", "mobileNumber"];
        break;
      case 2:
        fieldsToValidate = ["package", "inspectionPurpose"];
        break;
      case 3:
        fieldsToValidate = ["city", "propertyAge", "landArea", "coveredArea"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  }

  async function handleNext() {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep === 3) {
        // Calculate price before moving to final step
        setIsCalculating(true);
        setCalculationError(null);

        try {
          const data = form.getValues();
          const response = await fetch("/api/calculate-price", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "فشل حساب السعر");
          }

          const result: PriceCalculationResponse = await response.json();
          setCalculatedPrice(result.price);
          setPriceDetails(result);
          setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        } catch (error) {
          console.error("Error calculating price:", error);
          setCalculationError(
            error instanceof Error ? error.message : "حدث خطأ أثناء حساب السعر"
          );
        } finally {
          setIsCalculating(false);
        }
      } else {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      }
    }
  }

  function handlePrevious() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  function onSubmit(data: CalculatorFormValues) {
    console.log("Form data:", data);
    console.log("Calculated price:", calculatedPrice);
    // Handle form submission (e.g., send to API)
  }

  const stepTitles = [
    "المعلومات الشخصية",
    "بيانات الفحص",
    "بيانات العقار",
    "النتيجة",
  ];

  return (
    <section
      id="calculator"
      className="min-h-screen py-20 md:py-32 bg-white relative"
    >
      <div className="container space-y-16 px-4 md:px-6">
        <SectionTitle variant="center">{content.calculator.title}</SectionTitle>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-8 items-start max-w-6xl mx-auto">
          {/* Right side - Form */}
          <div className="col-span-3 lg:col-span-2 w-full mx-auto lg:mx-0 order-last lg:order-first">
            {/* Step Indicator */}
            <div className="mb-8" dir="rtl">
              {/* Progress bars */}
              <div className="flex gap-2 ">
                {[...Array(totalSteps)].map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      index < currentStep
                        ? "bg-primary-lighter"
                        : index === currentStep - 1
                        ? "bg-secondary"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              <div className="text-lg font-bold text-primary my-4">
                {currentStep} / {totalSteps}
              </div>

              <h3 className="text-2xl font-bold text-right mb-6">
                {stepTitles[currentStep - 1]}
              </h3>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    {/* First Name */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel dir="rtl">الاسم الأول</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="هنا يكتب اسمك الاول مثال (محمد)"
                              {...field}
                              dir="rtl"
                            />
                          </FormControl>
                          <FormMessage dir="rtl" />
                        </FormItem>
                      )}
                    />

                    {/* Family Name */}
                    <FormField
                      control={form.control}
                      name="familyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel dir="rtl">اسم العائلة</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال ابراهيم محمد علي"
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
                          <FormLabel dir="rtl">رقم الجوال</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="رقم الجوال"
                              {...field}
                              dir="rtl"
                              type="tel"
                            />
                          </FormControl>
                          <FormMessage dir="rtl" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Inspection Data */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Package */}
                    <FormField
                      control={form.control}
                      name="package"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel dir="rtl">الباقة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger dir="rtl" className="w-full">
                                <SelectValue placeholder="اختر الباقة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="basic">
                                الباقة الأساسية
                              </SelectItem>
                              <SelectItem value="premium">
                                الباقة المميزة
                              </SelectItem>
                              <SelectItem value="vip">باقة VIP</SelectItem>
                            </SelectContent>
                          </Select>
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
                          <FormLabel dir="rtl">الهدف من الفحص</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger dir="rtl" className="w-full">
                                <SelectValue placeholder="هدف الفحص" />
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
                  </div>
                )}

                {/* Step 3: Property Data */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    {/* City */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel dir="rtl">المدينة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger dir="rtl" className="w-full">
                                <SelectValue placeholder="اختر المدينة" />
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
                          <FormLabel dir="rtl">الحي</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={
                              !selectedCity ||
                              availableNeighborhoods.length === 0
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
                                      : "اختر الحي"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableNeighborhoods.map((neighborhood) => (
                                <SelectItem
                                  key={neighborhood}
                                  value={neighborhood}
                                >
                                  {neighborhood}
                                </SelectItem>
                              ))}
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
                          <FormLabel dir="rtl">عمر العقار</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger dir="rtl" className="w-full">
                                <SelectValue placeholder="اختر عمر العقار" />
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
                          <FormLabel dir="rtl">مساحة الأرض</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال 300 متر"
                              {...field}
                              dir="rtl"
                              type="text"
                            />
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
                          <FormLabel dir="rtl">مسطحات البناء</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال 200 م"
                              {...field}
                              dir="rtl"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage dir="rtl" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Result */}
                {currentStep === 4 && calculatedPrice !== null && (
                  <div className="space-y-6" dir="rtl">
                    <div className="text-center py-12">
                      <p className="text-5xl lg:text-6xl font-bold text-primary mb-8">
                        {calculatedPrice.toLocaleString("ar-SA")} ريال
                      </p>

                      {priceDetails && (
                        <div className="mt-8 space-y-4 max-w-md mx-auto">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center text-sm mb-2">
                              <span className="text-gray-600">
                                السعر الأساسي:
                              </span>
                              <span className="font-semibold">
                                {priceDetails.basePrice.toLocaleString("ar-SA")}{" "}
                                ريال
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm mb-2">
                              <span className="text-gray-600">
                                ضريبة القيمة المضافة (15%):
                              </span>
                              <span className="font-semibold">
                                {priceDetails.vatAmount.toLocaleString("ar-SA")}{" "}
                                ريال
                              </span>
                            </div>
                            <div className="border-t border-gray-300 my-2 pt-2">
                              <div className="flex justify-between items-center">
                                <span className="font-bold">الإجمالي:</span>
                                <span className="font-bold text-primary">
                                  {calculatedPrice.toLocaleString("ar-SA")} ريال
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            * السعر تقديري وقد يختلف حسب الحالة الفعلية للعقار
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {calculationError && currentStep === 3 && (
                  <div
                    className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                    dir="rtl"
                  >
                    <p className="text-sm font-medium">{calculationError}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div
                  className="flex justify-between items-center pt-6 flex-row-reverse"
                  dir="rtl"
                >
                  {currentStep < 4 && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isCalculating}
                      size="lg"
                      className="h-14 min-w-40 rounded-none text-lg cursor-pointer"
                    >
                      {isCalculating ? (
                        <>
                          <span className="animate-spin inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full ml-2" />
                          جاري الحساب...
                        </>
                      ) : (
                        <>
                          {currentStep === 3 ? "اظهر النتيجة" : "التالي"}
                          {currentStep != 3 && (
                            <ArrowLeft className="mr-2 h-5 w-5" />
                          )}
                        </>
                      )}
                    </Button>
                  )}

                  {currentStep === 4 && (
                    <div className="flex gap-4 w-full justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-14 min-w-40 rounded-none !border-primary/10 text-lg cursor-pointer text-primary hover:!bg-background hover:!text-primary"
                      >
                        تواصل معنا
                      </Button>
                      <Button
                        type="button"
                        className="h-14 min-w-40 rounded-none text-lg cursor-pointer"
                        variant="secondary"
                      >
                        دفع
                      </Button>
                    </div>
                  )}

                  {currentStep > 1 && (
                    <Button
                      type="button"
                      onClick={handlePrevious}
                      disabled={isCalculating}
                      variant="ghost"
                      className="h-14 min-w-40 rounded-none text-lg cursor-pointer text-primary hover:!bg-background hover:!text-primary"
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                      رجوع
                    </Button>
                  )}
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
