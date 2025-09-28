import content from "@/content";

export default function ProblemsGallerySection() {
  return (
    <section id="problems-gallery" className="bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-8" dir="rtl">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground max-w-2xl mx-auto">
              {content.problemsGallery.title}
            </h2>
            <div className="w-48 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-full mx-auto"></div>
          </div>

          {/* Gallery */}
          <div className="flex justify-center items-end gap-6 lg:gap-8 py-16 overflow-x-auto">
            {/* Gallery Images - placeholder */}
            <div className="flex-shrink-0 w-48 h-64 bg-gray-200 rounded-lg"></div>
            <div className="flex-shrink-0 w-56 h-80 bg-gray-300 rounded-lg"></div>
            <div className="flex-shrink-0 w-64 h-96 bg-gray-400 rounded-lg shadow-2xl"></div>
            <div className="flex-shrink-0 w-56 h-80 bg-gray-300 rounded-lg"></div>
            <div className="flex-shrink-0 w-48 h-64 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Problem Name */}
          <p className="text-xl font-medium text-foreground">
            {content.problemsGallery.problemName}
          </p>

          {/* Call to Action */}
          <div className="space-y-6">
            <h3 className="text-2xl lg:text-3xl font-bold text-primary">
              {content.problemsGallery.callToAction.text}
            </h3>
            <button className="bg-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              {content.problemsGallery.callToAction.buttonText}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-8 pt-8">
            <button className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
              <svg
                className="w-5 h-5 rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
            </div>
            <button className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors">
              <svg
                className="w-5 h-5 -rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
