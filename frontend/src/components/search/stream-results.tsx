import Link from "next/link";
import { Video } from "lucide-react";

interface Stream {
  id: string;
  title: string;
  viewerCount: number;
  user: { id: string; username: string; streamKey: string };
  category?: { name: string };
}

interface StreamResultsProps {
  streams: Stream[];
}

export function StreamResults({ streams }: StreamResultsProps) {
  if (streams.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Video className="w-5 h-5" />
        Live Streams
      </h2>
      <div className="space-y-3">
        {streams.map((stream) => (
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
    </div>
  );
}
