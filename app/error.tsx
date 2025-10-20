"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">خطأ</h1>
          <h2 className="text-2xl font-bold text-foreground">
            حدث خطأ أثناء تحميل الصفحة
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={reset}
            className="bg-primary hover:bg-primary-light text-white px-8 py-6 text-lg"
          >
            حاول مرة أخرى
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg"
            >
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            إذا استمرت المشكلة، يرجى{" "}
            <a
              href="https://wa.me/966920005543"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline font-medium"
            >
              التواصل مع الدعم الفني
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
