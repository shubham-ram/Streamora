"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Video, Search, Menu, X, User, LogOut } from "lucide-react";
import { API_URL } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

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
  }, []);

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

            {/* Desktop: Auth Buttons or User Menu */}
            {!isLoading && (
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <>
                    <Link
                      href={`/user/${user.username}`}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-surface-secondary/40 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center ring-2 ring-brand-primary/20">
                        <User className="w-4 h-4 text-fg-primary" />
                      </div>
                      <span className="text-fg-primary text-sm font-medium">
                        {user.username}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-fg-secondary hover:text-fg-primary hover:bg-surface-secondary/40 rounded-lg transition-colors"
                      title="Log out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-fg-secondary hover:text-fg-primary transition-colors"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="btn-premium px-5 py-2 text-fg-primary font-medium rounded-xl"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}

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
        <div className="md:hidden border-t border-border-main/50 glass animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-4">
            <div className="grid gap-2">
              {user ? (
                <>
                  <Link
                    href={`/user/${user.username}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-secondary/40 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                      <User className="w-4 h-4 text-fg-primary" />
                    </div>
                    <span className="text-fg-primary font-medium">
                      {user.username}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-fg-secondary hover:text-fg-primary hover:bg-surface-secondary/40 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2.5 text-fg-secondary hover:text-fg-primary hover:bg-surface-secondary/40 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2.5 btn-premium text-fg-primary font-medium rounded-xl text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
