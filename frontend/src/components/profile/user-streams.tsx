import Link from "next/link";
import { Video, Clock, Eye } from "lucide-react";

interface Stream {
  id: string;
  title: string;
  viewerCount: number;
  startedAt: string;
  endedAt?: string;
  isLive: boolean;
  category?: { name: string; slug: string };
}

interface UserStreamsProps {
  streams: Stream[];
  username: string;
}

export function UserStreams({ streams, username }: UserStreamsProps) {
  const liveStream = streams.find((s) => s.isLive);
  const pastStreams = streams.filter((s) => !s.isLive);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Live Now */}
      {liveStream && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-fg-primary mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-status-live rounded-full animate-pulse" />
            Live Now
          </h2>
          <Link
            href={`/watch/${username}`}
            className="block p-4 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/30 rounded-xl hover:border-brand-primary/60 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                <Video className="w-8 h-8 text-fg-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-fg-primary">
                  {liveStream.title}
                </h3>
                <p className="text-fg-secondary text-sm">
                  {liveStream.category?.name || "No category"} •{" "}
                  {liveStream.viewerCount} viewers
                </p>
              </div>
              <span className="px-4 py-2 bg-status-live text-fg-primary font-semibold rounded-lg">
                Watch Now
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Past Streams */}
      <div>
        <h2 className="text-xl font-bold text-fg-primary mb-4">
          Past Streams
        </h2>
        {pastStreams.length > 0 ? (
          <div className="space-y-3">
            {pastStreams.map((stream) => (
              <div
                key={stream.id}
                className="flex items-center gap-4 p-4 bg-surface-secondary/50 rounded-xl"
              >
                <div className="w-12 h-12 rounded-lg bg-surface-tertiary flex items-center justify-center">
                  <Video className="w-6 h-6 text-fg-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-fg-primary font-medium">
                    {stream.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-fg-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(stream.startedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {stream.viewerCount} peak viewers
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-fg-secondary">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{username} hasn&apos;t streamed yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
