import content from "@/content";

export function PackageNote() {
  return (
    <div className="bg-background p-6 md:p-12 text-center rounded-xl">
      <h4 className="text-secondary mb-6">{content.packages.note.title}</h4>
      <ul className="space-y-4">
        {content.packages.note.items.map((item, index) => (
          <li
            key={index}
            className="text-[#333333] text-base md:text-lg leading-relaxed flex items-start gap-3"
          >
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
