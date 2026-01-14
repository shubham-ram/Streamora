import Link from "next/link";
import { Video } from "lucide-react";
import { StreamCard } from "@/components/stream-card";

interface Stream {
  id: string;
  title: string;
  viewerCount: number;
  thumbnailUrl?: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
    streamKey: string;
  };
  category?: {
    name: string;
  };
}

interface LiveStreamsSectionProps {
  streams: Stream[];
}

export function LiveStreamsSection({ streams }: LiveStreamsSectionProps) {
  return (
    <section
      id="live-streams"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            Live Now
          </h2>
          <p className="text-slate-400 mt-1">{streams.length} streams live</p>
        </div>
      </div>

      {streams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {streams.map((stream) => (
            <StreamCard
              key={stream.id}
              id={stream.id}
              title={stream.title}
              username={stream.user.username}
              avatarUrl={stream.user.avatarUrl}
              thumbnailUrl={stream.thumbnailUrl}
              viewerCount={stream.viewerCount}
              category={stream.category?.name}
              streamKey={stream.user.streamKey}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
        <Video className="w-12 h-12 text-slate-600" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No Live Streams</h3>
      <p className="text-slate-400 max-w-md">
        No one is streaming right now. Be the first to go live!
      </p>
      <Link
        href="/register"
        className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors"
      >
        Start Streaming
      </Link>
    </div>
  );
}
