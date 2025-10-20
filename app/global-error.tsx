"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-2xl w-full text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-8xl font-bold text-primary">500</h1>
              <h2 className="text-3xl font-bold text-foreground">
                حدث خطأ في الخادم
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                عذراً، حدث خطأ غير متوقع. نحن نعمل على إصلاح المشكلة. يرجى
                المحاولة مرة أخرى.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={reset}
                className="bg-primary hover:bg-primary-light text-white px-8 py-6 text-lg"
              >
                حاول مرة أخرى
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg"
              >
                العودة للصفحة الرئيسية
              </Button>
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
      </body>
    </html>
  );
}
