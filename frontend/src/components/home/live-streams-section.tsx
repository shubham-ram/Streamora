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
          <h2 className="text-2xl font-bold text-fg-primary flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-live opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-status-live shadow-lg shadow-status-live/40" />
            </span>
            Live Now
          </h2>
          <p className="text-fg-secondary mt-1">
            {streams.length} streams live
          </p>
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
      <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center mb-6 glow-sm">
        <Video className="w-12 h-12 text-brand-primary-light" />
      </div>
      <h3 className="text-xl font-semibold text-fg-primary mb-2">
        No Live Streams
      </h3>
      <p className="text-fg-secondary max-w-md">
        No one is streaming right now. Be the first to go live!
      </p>
      <Link
        href="/register"
        className="mt-6 btn-premium px-6 py-2.5 text-fg-primary font-medium rounded-xl"
      >
        Start Streaming
      </Link>
    </div>
  );
}
