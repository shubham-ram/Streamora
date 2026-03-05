"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Video, Search, Menu, X } from "lucide-react";
import { API_URL } from "@/lib/utils";
import { DesktopNav } from "@/components/navbar/desktop-nav";
import { MobileMenu } from "@/components/navbar/mobile-menu";

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export function Navbar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);

  const hasToken = useMemo(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  }, []);

  const [isLoading, setIsLoading] = useState(hasToken);

  useEffect(() => {
    if (!hasToken) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/auth/currentUser`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          throw new Error("Invalid token");
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [hasToken]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 glass-heavy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center glow-sm group-hover:glow-md transition-shadow duration-300">
              <Video className="w-5 h-5 text-fg-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-primary-light to-brand-accent bg-clip-text text-transparent hidden sm:block">
              StreamHub
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-md mx-8 hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search streams, creators..."
                className="w-full bg-surface-secondary/40 border border-border-main rounded-xl py-2.5 px-4 pl-10 text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-brand-primary/50 focus:bg-surface-secondary/60 focus:shadow-[0_0_15px_-3px_oklch(0.45_0.2_293_/_20%)] transition-all duration-300"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-fg-secondary hover:text-fg-primary hover:bg-surface-secondary/50 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Desktop Nav */}
            <DesktopNav
              user={user}
              isLoading={isLoading}
              onLogout={handleLogout}
            />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-fg-secondary hover:text-fg-primary hover:bg-surface-secondary/50 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Overlay */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full bg-surface-secondary/50 border border-border-main rounded-xl py-2.5 px-4 pl-10 text-fg-primary placeholder:text-fg-muted focus:outline-none focus:border-brand-primary/50 transition-all"
                autoFocus
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <MobileMenu
          user={user}
          onLogout={handleLogout}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}
