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

const CATEGORY_GRADIENTS = [
  "from-brand-primary/30 to-brand-secondary/10",
  "from-brand-secondary/30 to-brand-accent/10",
  "from-brand-accent/25 to-brand-primary/10",
  "from-brand-primary-light/25 to-brand-secondary/10",
  "from-brand-secondary-light/25 to-brand-primary/10",
  "from-brand-primary/20 to-brand-accent/15",
];

export function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border-main/50">
      <h2 className="text-2xl font-bold text-fg-primary mb-8">
        Browse Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((category, i) => (
          <Link
            key={category}
            href={`/category/${slugify(category)}`}
            className="group relative aspect-[4/5] rounded-xl overflow-hidden gradient-border transition-all duration-300 hover:scale-[1.03]"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[i]} group-hover:opacity-80 transition-opacity`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-fg-primary font-semibold text-lg group-hover:text-brand-primary-light transition-colors drop-shadow-lg">
                {category}
              </h3>
            </div>
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-brand-primary/10 to-transparent" />
          </Link>
        ))}
      </div>
    </section>
  );
}
