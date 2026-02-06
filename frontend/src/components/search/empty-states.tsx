import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <Search className="w-16 h-16 text-border-subtle mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-fg-primary mb-2">
        Search StreamHub
      </h3>
      <p className="text-fg-secondary">
        Find live streams, users, and categories
      </p>
    </div>
  );
}

export function NoResults() {
  return (
    <div className="text-center py-16">
      <Search className="w-16 h-16 text-border-subtle mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-fg-primary mb-2">
        No results found
      </h3>
      <p className="text-fg-secondary">Try a different search term</p>
    </div>
  );
}
