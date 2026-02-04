import Link from "next/link";
import { Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryResultsProps {
  categories: Category[];
}

export function CategoryResults({ categories }: CategoryResultsProps) {
  if (categories.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5" />
        Categories
      </h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="px-4 py-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-white font-medium"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
