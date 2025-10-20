import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <Image
            src="/logo-full.svg"
            alt="Inspectex Logo"
            width={180}
            height={180}
            priority
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold text-foreground">
            الصفحة غير موجودة
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary-light text-white px-8 py-6 text-lg">
              العودة للصفحة الرئيسية
            </Button>
          </Link>
          <Link href="/#calculator">
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 text-lg"
            >
              احجز فحصك الآن
            </Button>
          </Link>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            هل تحتاج مساعدة؟{" "}
            <a
              href="https://wa.me/966920005543"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline font-medium"
            >
              تواصل معنا عبر الواتساب
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
