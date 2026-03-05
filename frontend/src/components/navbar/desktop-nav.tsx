import Link from "next/link";
import { User, LogOut, LayoutDashboard } from "lucide-react";

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface DesktopNavProps {
  user: CurrentUser | null;
  isLoading: boolean;
  onLogout: () => void;
}

export function DesktopNav({ user, isLoading, onLogout }: DesktopNavProps) {
  if (isLoading) return null;

  return (
    <div className="hidden md:flex items-center gap-3">
      {user ? (
        <>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 text-fg-secondary hover:text-fg-primary hover:bg-surface-secondary/40 rounded-xl transition-colors text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
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
            onClick={onLogout}
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
  );
}
