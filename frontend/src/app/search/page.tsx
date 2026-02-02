"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Video, User, Tag, Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface SearchResults {
  streams: Array<{
    id: string;
    title: string;
    viewerCount: number;
    user: {
      id: string;
      username: string;
      avatarUrl?: string;
      streamKey: string;
    };
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

export default function SearchPage() {
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
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const totalResults = results
    ? results.streams.length + results.users.length + results.categories.length
    : 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

        {/* Results */}
        {query && (
          <div className="mb-6">
            <p className="text-slate-400">
              {isLoading
                ? "Searching..."
                : `${totalResults} results for "${query}"`}
            </p>
          </div>
        )}

        {results && (
          <div className="space-y-8">
            {/* Live Streams */}
            {results.streams.length > 0 && (
              <ResultSection
                title="Live Streams"
                icon={<Video className="w-5 h-5" />}
              >
                <div className="space-y-3">
                  {results.streams.map((stream) => (
                    <Link
                      key={stream.id}
                      href={`/watch/${stream.user.streamKey}`}
                      className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {stream.title}
                        </h3>
                        <p className="text-slate-400 text-sm truncate">
                          {stream.user.username} •{" "}
                          {stream.category?.name || "No category"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                          LIVE
                        </span>
                        <span className="text-slate-400 text-sm">
                          {stream.viewerCount} viewers
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </ResultSection>
            )}

            {/* Users */}
            {results.users.length > 0 && (
              <ResultSection title="Users" icon={<User className="w-5 h-5" />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/user/${user.username}`}
                      className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center overflow-hidden">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.username}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">
                          {user.displayName || user.username}
                        </h3>
                        <p className="text-slate-400 text-sm truncate">
                          @{user.username}
                        </p>
                      </div>
                      {user.isLive && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                          LIVE
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </ResultSection>
            )}

            {/* Categories */}
            {results.categories.length > 0 && (
              <ResultSection
                title="Categories"
                icon={<Tag className="w-5 h-5" />}
              >
                <div className="flex flex-wrap gap-3">
                  {results.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="px-4 py-2 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors text-white font-medium"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </ResultSection>
            )}

            {/* No Results */}
            {totalResults === 0 && !isLoading && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No results found
                </h3>
                <p className="text-slate-400">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Search StreamHub
            </h3>
            <p className="text-slate-400">
              Find live streams, users, and categories
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function ResultSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}
