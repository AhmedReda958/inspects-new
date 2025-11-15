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
  success: boolean;
  price: number;
  basePrice: number;
  priceBeforeVat: number;
  vatAmount: number;
  breakdown: {
    step1_baseCalculation: {
      coveredArea: number;
      packageBasePrice: number;
      exceedsThreshold: boolean;
      areaAboveThreshold?: number;
      pricePerSqm?: number;
      calculatedPrice: number;
    };
    step2_ageMultiplier: {
      ageRange: string;
      multiplier: number;
      priceAfterAge: number;
    };
    step3_purposeMultiplier: {
      purpose: string;
      multiplier: number;
      priceAfterPurpose: number;
    };
    step4_neighborhoodMultiplier?: {
      neighborhood: string;
      level: string;
      multiplier: number;
      applied: boolean;
      reason?: string;
      priceAfterNeighborhood: number;
    };
    step5_vat: {
      percentage: number;
      vatAmount: number;
      finalPrice: number;
    };
  };
}

interface CalcConfig {
  packages: Array<{ value: string; label: string }>;
  cities: Array<{ value: string; label: string }>;
  cityNeighborhoods: Record<string, string[]>;
  propertyAges: Array<{ value: string; label: string }>;
  inspectionPurposes: Array<{ value: string; label: string }>;
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
  const [config, setConfig] = useState<CalcConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const searchParams = useSearchParams();

  const totalSteps = 4;

  // Fetch calculator configuration on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/api/calculator/config");

        if (!response.ok) {
          throw new Error("فشل في تحميل البيانات من الخادم");
        }

        const data = await response.json();

        if (data.success && data.data) {
          setConfig(data.data);
        } else {
          throw new Error("فشل في تحميل بيانات النموذج");
        }
      } catch (error) {
        console.error("Error fetching calculator config:", error);
        setConfig(null); // Set to null to show error state
      } finally {
        setIsLoadingConfig(false);
      }
    }
    fetchConfig();
  }, []);

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
    if (selectedCity && config) {
      const neighborhoods = config.cityNeighborhoods[selectedCity] || [];
      setAvailableNeighborhoods(neighborhoods);
      // Reset neighborhood when city changes
      form.setValue("neighborhood", "");
    } else {
      setAvailableNeighborhoods([]);
    }
  }, [selectedCity, config, form]);

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

          let responseData;
          try {
            responseData = await response.json();
          } catch {
            throw new Error("فشل في قراءة استجابة الخادم");
          }

          if (!response.ok) {
            throw new Error(responseData.error || "فشل حساب السعر");
          }

          // Check for success field in response
          if (!responseData.success) {
            throw new Error(responseData.error || "فشل حساب السعر");
          }

          const result: PriceCalculationResponse = responseData;
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

  // Show loading state while fetching config
  if (isLoadingConfig) {
    return (
      <section
        id="calculator"
        className="min-h-screen py-20 md:py-32 bg-white relative flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل النموذج...</p>
        </div>
      </section>
    );
  }

  if (!config) {
    return (
      <section
        id="calculator"
        className="min-h-screen py-20 md:py-32 bg-white relative flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-red-600">
            حدث خطأ في تحميل النموذج. يرجى المحاولة لاحقاً.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="calculator"
      className="min-h-screen py-20 md:py-32 bg-white relative"
    >
      <div className="container space-y-16 px-4 md:px-6">
        <SectionTitle variant="center">{content.calculator.title}</SectionTitle>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-start max-w-6xl mx-auto">
          {/* Right side - Form */}
          <div className="col-span-12 lg:col-span-8 w-full mx-auto lg:mx-0 order-last lg:order-first">
            {/* Step Indicator */}
            <div className="mb-8">
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
                          <FormLabel>الاسم الأول</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Family Name */}
                    <FormField
                      control={form.control}
                      name="familyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم العائلة</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Mobile Number */}
                    <FormField
                      control={form.control}
                      name="mobileNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الجوال</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="رقم الجوال"
                              {...field}
                              type="tel"
                              dir="rtl"
                            />
                          </FormControl>
                          <FormMessage />
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
                          <FormLabel>الباقة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر الباقة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {config.packages.map((pkg) => (
                                <SelectItem key={pkg.value} value={pkg.value}>
                                  {pkg.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Inspection Purpose */}
                    <FormField
                      control={form.control}
                      name="inspectionPurpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الهدف من الفحص</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="هدف الفحص" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {config.inspectionPurposes.map((purpose) => (
                                <SelectItem
                                  key={purpose.value}
                                  value={purpose.value}
                                >
                                  {purpose.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
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
                          <FormLabel>المدينة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر المدينة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {config.cities.map((city) => (
                                <SelectItem key={city.value} value={city.value}>
                                  {city.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Neighborhood */}
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الحي</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={
                              !selectedCity ||
                              availableNeighborhoods.length === 0
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Property Age */}
                    <FormField
                      control={form.control}
                      name="propertyAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عمر العقار</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر عمر العقار" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {config.propertyAges.map((age) => (
                                <SelectItem key={age.value} value={age.value}>
                                  {age.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Land Area */}
                    <FormField
                      control={form.control}
                      name="landArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مساحة الأرض</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال 300 م²"
                              {...field}
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Covered Area */}
                    <FormField
                      control={form.control}
                      name="coveredArea"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>مسطحات البناء</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال 200 م²"
                              {...field}
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Result */}
                {currentStep === 4 && calculatedPrice !== null && (
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <p className="text-5xl lg:text-6xl font-bold text-primary mb-8">
                        {calculatedPrice.toLocaleString("ar-SA")} ريال
                      </p>

                      {priceDetails && (
                        <div className="mt-8 space-y-4 max-w-md mx-auto px-4 md:px-0">
                          <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-sm mb-2">
                              <span className="text-gray-600">
                                السعر الأساسي:
                              </span>
                              <span className="font-semibold ">
                                {priceDetails.basePrice.toLocaleString("ar-SA")}{" "}
                                ريال
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 text-sm mb-2">
                              <span className="text-gray-600">
                                ضريبة القيمة المضافة (15%):
                              </span>
                              <span className="font-semibold ">
                                {priceDetails.vatAmount.toLocaleString("ar-SA")}{" "}
                                ريال
                              </span>
                            </div>
                            <div className="border-t border-gray-300 my-2 pt-2">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                                <span className="font-bold text-sm">
                                  الإجمالي:
                                </span>
                                <span className="font-bold text-primary text-sm ">
                                  {calculatedPrice.toLocaleString("ar-SA")} ريال
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] sm:text-xs text-gray-500 px-2 sm:px-0">
                            * السعر تقديري وقد يختلف حسب المساحات الفعلية للعقار
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {calculationError && currentStep === 3 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <p className="text-sm font-medium">{calculationError}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 flex-col lg:flex-row-reverse">
                  {currentStep < 4 && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isCalculating}
                      size="lg"
                      className="h-14 w-full lg:min-w-40 rounded-none text-lg font-medium cursor-pointer"
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
                    <div className="flex gap-4 w-full justify-center lg:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const message = encodeURIComponent(
                            "مرحباً، أحتاج للاستفسار عن خدماتكم"
                          );
                          window.open(
                            `https://wa.me/966920005543?text=${message}`,
                            "_blank"
                          );
                        }}
                        className="h-14 min-w-40 rounded-none !border-primary/10 text-lg font-medium cursor-pointer text-primary hover:!bg-background hover:!text-primary"
                      >
                        تواصل معنا
                      </Button>
                      <Button
                        type="button"
                        className="h-14 min-w-40 rounded-none text-lg font-medium cursor-pointer"
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
                      className="mt-4 lg:mt-0 h-14 min-w-40 rounded-none text-lg font-medium cursor-pointer text-primary hover:!bg-background hover:!text-primary"
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
          <div className="col-span-12 lg:col-span-4 relative w-full h-[450px] lg:h-[calc(100%-88px)]">
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
