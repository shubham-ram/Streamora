import { Search, Loader2 } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: SearchInputProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search streams, users, categories..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 px-6 pl-14 text-white text-lg placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          autoFocus
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        {isLoading && (
          <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 animate-spin" />
        )}
      </div>
    </form>
  );
}
