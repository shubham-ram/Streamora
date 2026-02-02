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
  streamKey: string;
}

export function StreamCard({
  title,
  username,
  avatarUrl,
  thumbnailUrl,
  viewerCount,
  category,
  streamKey,
}: StreamCardProps) {
  return (
    <Link href={`/watch/${streamKey}`} className="group block">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <Video className="w-12 h-12 text-slate-700" />
          </div>
        )}

        {/* Live Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded uppercase">
            Live
          </span>
        </div>

        {/* Viewer Count */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-0.5 bg-black/70 text-white text-xs font-medium rounded">
            {viewerCount.toLocaleString()} viewers
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info */}
      <div className="flex gap-3 mt-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm truncate">{username}</p>
          {category && (
            <p className="text-slate-500 text-sm truncate">{category}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
