import Link from "next/link";
import Image from "next/image";
import { Video, User } from "lucide-react";

interface StreamCardProps {
  id: string;
  title: string;
  username: string;
  avatarUrl?: string;
  thumbnailUrl?: string;
  viewerCount: number;
  category?: string;
}

export function StreamCard({
  title,
  username,
  avatarUrl,
  thumbnailUrl,
  viewerCount,
  category,
}: StreamCardProps) {
  return (
    <Link href={`/watch/${username}`} className="group block">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-secondary gradient-border">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-tertiary via-surface-secondary to-surface-primary flex items-center justify-center">
            <Video className="w-12 h-12 text-fg-subtle" />
          </div>
        )}

        {/* Live Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 bg-status-live text-fg-primary text-xs font-bold rounded-md uppercase tracking-wide shadow-lg shadow-status-live/30">
            Live
          </span>
        </div>

        {/* Viewer Count */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="flex items-center gap-1.5 px-2.5 py-1 glass text-fg-primary text-xs font-medium rounded-md">
            <span className="w-1.5 h-1.5 bg-fg-primary rounded-full animate-pulse" />
            {viewerCount.toLocaleString()} viewers
          </span>
        </div>

        {/* Hover Overlay with glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="flex gap-3 mt-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center flex-shrink-0 overflow-hidden relative ring-2 ring-brand-primary/20 group-hover:ring-brand-primary/40 transition-all group-hover:glow-sm">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-fg-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-fg-primary font-semibold truncate group-hover:text-brand-primary-light transition-colors">
            {title}
          </h3>
          <p className="text-fg-secondary text-sm truncate">{username}</p>
          {category && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs text-fg-muted bg-surface-secondary/60 rounded-md">
              {category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
