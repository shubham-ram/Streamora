import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-16">
      <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        Search StreamHub
      </h3>
      <p className="text-slate-400">Find live streams, users, and categories</p>
    </div>
  );
}

export function NoResults() {
  return (
    <div className="text-center py-16">
      <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        No results found
      </h3>
      <p className="text-slate-400">Try a different search term</p>
    </div>
  );
}
