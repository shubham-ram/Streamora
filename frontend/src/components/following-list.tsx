import Link from "next/link";
import Image from "next/image";
import { Video, User } from "lucide-react";

interface FollowedStreamer {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  isLive: boolean;
  currentStreamTitle?: string;
}

interface FollowingListProps {
  streamers: FollowedStreamer[];
}

export function FollowingList({ streamers }: FollowingListProps) {
  if (streamers.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-fg-muted mx-auto mb-3" />
        <p className="text-fg-secondary">
          You&apos;re not following anyone yet
        </p>
        <p className="text-fg-muted text-sm mt-1">
          Discover streamers and follow them to see when they go live
        </p>
      </div>
    );
  }

  const liveStreamers = streamers.filter((s) => s.isLive);
  const offlineStreamers = streamers.filter((s) => !s.isLive);

  return (
    <div className="space-y-4">
      {/* Live Streamers */}
      {liveStreamers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-fg-muted uppercase tracking-wider mb-3">
            Live Now
          </h3>
          <div className="space-y-2">
            {liveStreamers.map((streamer) => (
              <Link
                key={streamer.id}
                href={`/watch/${streamer.username}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-secondary/50 hover:bg-surface-secondary transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center overflow-hidden">
                    {streamer.avatarUrl ? (
                      <Image
                        src={streamer.avatarUrl}
                        alt={streamer.username}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-fg-primary" />
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-status-live rounded-full border-2 border-page-bg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-fg-primary truncate">
                    {streamer.displayName || streamer.username}
                  </p>
                  <p className="text-sm text-fg-secondary truncate">
                    {streamer.currentStreamTitle || "Streaming now"}
                  </p>
                </div>
                <Video className="w-4 h-4 text-status-live" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Offline Streamers */}
      {offlineStreamers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-fg-muted uppercase tracking-wider mb-3">
            Offline
          </h3>
          <div className="space-y-2">
            {offlineStreamers.map((streamer) => (
              <Link
                key={streamer.id}
                href={`/user/${streamer.username}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center overflow-hidden opacity-60">
                  {streamer.avatarUrl ? (
                    <Image
                      src={streamer.avatarUrl}
                      alt={streamer.username}
                      width={40}
                      height={40}
                      className="object-cover grayscale"
                    />
                  ) : (
                    <User className="w-5 h-5 text-fg-muted" />
                  )}
                </div>
                <p className="font-medium text-fg-secondary truncate">
                  {streamer.displayName || streamer.username}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
