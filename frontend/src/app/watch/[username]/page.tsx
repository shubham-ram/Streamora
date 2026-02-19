"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VideoPlayer } from "@/components/video-player";
import { ChatPanel } from "@/components/chat";
import Image from "next/image";
import { User } from "lucide-react";

interface StreamData {
  id: string;
  title: string;
  viewerCount: number;
  hlsUrl: string;
  user: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  category?: { name: string };
}

export default function WatchPage() {
  const params = useParams();
  const username = params.username as string;
  const [stream, setStream] = useState<StreamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStream() {
      try {
        const res = await fetch(
          `http://localhost:8000/api/streams/user/${username}/live`,
        );
        if (res.ok) {
          setStream(await res.json());
        }
      } catch (error) {
        console.error("Error fetching stream:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStream();
  }, [username]);

  const hlsUrl = stream?.hlsUrl ?? "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-fg-primary mb-2">
            Stream Not Found
          </h1>
          <p className="text-fg-secondary">{username} is not currently live.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-page-bg flex flex-col">
      {/* Main Content: Video + Chat */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video + Info Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Video Player */}
          <div className="w-full aspect-video bg-black">
            <VideoPlayer src={hlsUrl} className="w-full h-full" />
          </div>

          {/* Stream Info */}
          <div className="px-4 py-4 overflow-y-auto">
            <div className="flex items-start gap-4 max-w-5xl">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                {stream.user.avatarUrl ? (
                  <Image
                    src={stream.user.avatarUrl}
                    alt={stream.user.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-fg-primary" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-fg-primary truncate">
                  {stream.title}
                </h1>
                <p className="text-fg-secondary text-sm mt-0.5">
                  {stream.user.displayName || stream.user.username}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-status-live text-fg-primary text-xs font-medium rounded uppercase">
                    Live
                  </span>
                  <span className="text-fg-muted text-sm">
                    {stream.viewerCount.toLocaleString()} viewers
                  </span>
                  {stream.category && (
                    <span className="px-2 py-0.5 bg-surface-secondary text-fg-secondary text-xs rounded">
                      {stream.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Follow Button */}
              <button className="px-4 py-2 bg-brand-primary-dark hover:bg-brand-primary text-fg-primary text-sm font-medium rounded-lg transition-colors flex-shrink-0">
                Follow
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-[340px] flex-shrink-0 hidden lg:flex">
          <ChatPanel streamId={stream.id} />
        </div>
      </div>
    </div>
  );
}
