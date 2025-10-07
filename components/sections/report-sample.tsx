import Image from "next/image";
import { Button } from "../ui/button";

export function ReportSampleSection() {
  return (
    <section
      className="bg-primary bg-[url('/images/bg/report-bg.png')] bg-cover bg-center"
      id="report-sample"
    >
      <div className=" container max-w-[1070px] mx-auto  py-16 lg:py-44 flex flex-col lg:flex-row items-center justify-between gap-8">
        <Image
          src="/logo-full-dark.svg"
          alt="انسبكتكس"
          width={144}
          height={144}
          className="w-36 h-36"
        />

        <div className="text-center lg:text-start max-w-[500px]">
          <h2 className="text-xl lg:text-2xl font-bold mb-4 text-white">
            الاطلاع على نموذج التقرير
          </h2>
          <p className=" leading-relaxed text-white/60 max-w-xl mx-auto">
            يمكنك معاينة نموذج تقرير فحص سابق للتعرف على شكل التفاصيل والملاحظات
            التي ستصلك بعد الفحص، مما يساعدك على فهم آلية العمل وجودة التقارير
            المقدمة
          </p>
        </div>

        <Button
          variant={"secondary"}
          size={"lg"}
          className="text-white rounded-none h-[50px] w-[190px] lg:h-[70px] lg:w-[230px] text-lg lg:text-xl cursor-pointer"
        >
          تحميل
        </Button>
      </div>
    </section>
  );
}
