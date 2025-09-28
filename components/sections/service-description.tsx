import content from "@/content";

export default function ServiceDescriptionSection() {
  return (
    <section id="service-description" className="bg-blue-50/20 py-20 lg:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8" dir="rtl">
            {/* Icon */}
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-secondary rounded"></div>
            </div>

            {/* Title with divider */}
            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                {content.serviceDescription.title}
              </h2>
              <div className="w-48 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-full"></div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              {content.serviceDescription.description.map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                )
              )}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gray-100 rounded-tr-[100px] rounded-bl-[100px] overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary/20 rounded"></div>
                  </div>
                  <p className="text-sm">صورة الخدمة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
