import Link from "next/link";
import { User, LogOut, LayoutDashboard } from "lucide-react";

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface MobileMenuProps {
  user: CurrentUser | null;
  onLogout: () => void;
  onClose: () => void;
}

export function MobileMenu({ user, onLogout, onClose }: MobileMenuProps) {
  return (
    <div className="md:hidden border-t border-border-main/50 glass animate-in slide-in-from-top-2">
      <div className="px-4 py-4 space-y-4">
        <div className="grid gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-2.5 text-fg-secondary hover:text-fg-primary hover:bg-surface-secondary/40 rounded-lg transition-colors"
                onClick={onClose}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href={`/user/${user.username}`}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-secondary/40 rounded-lg transition-colors"
                onClick={onClose}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-fg-primary" />
                </div>
                <span className="text-fg-primary font-medium">
                  {user.username}
                </span>
              </Link>
              <button
                onClick={onLogout}
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
                onClick={onClose}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2.5 btn-premium text-fg-primary font-medium rounded-xl text-center"
                onClick={onClose}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
