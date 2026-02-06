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
          className="w-full bg-surface-secondary/50 border border-border-subtle rounded-xl py-4 px-6 pl-14 text-fg-primary text-lg placeholder:text-fg-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          autoFocus
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-muted" />
        {isLoading && (
          <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-primary animate-spin" />
        )}
      </div>
    </form>
  );
}
