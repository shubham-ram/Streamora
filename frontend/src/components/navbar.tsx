"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Video, Search } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-page-bg/80 backdrop-blur-xl border-b border-border-main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
              <Video className="w-5 h-5 text-fg-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-primary-light to-brand-secondary-light bg-clip-text text-transparent">
              StreamHub
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-md mx-8 hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search streams..."
                className="w-full bg-surface-secondary/50 border border-border-subtle rounded-lg py-2 px-4 pl-10 text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-fg-secondary hover:text-fg-primary transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-gradient-to-r from-brand-primary-dark to-brand-secondary hover:from-brand-primary hover:to-brand-secondary-light text-fg-primary font-medium rounded-lg transition-all"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
