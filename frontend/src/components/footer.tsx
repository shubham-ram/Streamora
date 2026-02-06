import Link from "next/link";
import { Video } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border-main py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
              <Video className="w-4 h-4 text-fg-primary" />
            </div>
            <span className="text-fg-secondary text-sm">
              StreamHub © 2026
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-fg-secondary">
            <Link
              href="/about"
              className="hover:text-fg-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="hover:text-fg-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-fg-primary transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
