import Link from "next/link";

const CATEGORIES = [
  "Gaming",
  "Music",
  "Just Chatting",
  "Art",
  "Sports",
  "Science & Tech",
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
}

export function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border-main">
      <h2 className="text-2xl font-bold text-fg-primary mb-8">
        Browse Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/category/${slugify(category)}`}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-gradient-to-br from-surface-secondary to-surface-primary hover:ring-2 hover:ring-brand-primary transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-fg-primary font-semibold text-lg group-hover:text-brand-primary-light transition-colors">
                {category}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
