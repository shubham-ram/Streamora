"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  SearchInput,
  StreamResults,
  UserResults,
  CategoryResults,
  EmptyState,
  NoResults,
} from "@/components/search";

interface SearchResults {
  streams: Array<{
    id: string;
    title: string;
    viewerCount: number;
    user: { id: string; username: string; streamKey: string };
    category?: { name: string; slug: string };
  }>;
  users: Array<{
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
    isLive: boolean;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = useCallback(async (term: string) => {
    if (!term || term.length < 2) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/search?q=${encodeURIComponent(term)}`,
      );
      if (res.ok) {
        setResults(await res.json());
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) performSearch(query);
  }, [query, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const totalResults = results
    ? results.streams.length + results.users.length + results.categories.length
    : 0;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {query && (
          <p className="text-fg-secondary mb-6">
            {isLoading
              ? "Searching..."
              : `${totalResults} results for "${query}"`}
          </p>
        )}

        {results && (
          <div className="space-y-8">
            <StreamResults streams={results.streams} />
            <UserResults users={results.users} />
            <CategoryResults categories={results.categories} />
            {totalResults === 0 && !isLoading && <NoResults />}
          </div>
        )}

        {!query && <EmptyState />}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-page-bg">
      <Navbar />
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto px-4 py-8 text-fg-secondary">
            Loading...
          </div>
        }
      >
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
