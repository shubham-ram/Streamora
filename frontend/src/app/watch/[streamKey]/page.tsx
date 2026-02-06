"use client";

import { useParams } from "next/navigation";
import { VideoPlayer } from "@/components/video-player";

export default function WatchPage() {
  const params = useParams();
  const streamKey = params.streamKey as string;

  // HLS stream URL from Node-Media-Server
  const hlsUrl = `http://localhost:8888/live/${streamKey}/index.m3u8`;

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Video Player Section */}
      <div className="w-full aspect-video max-h-[70vh] bg-black">
        <VideoPlayer src={hlsUrl} className="w-full h-full" />
      </div>

      {/* Stream Info Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-start gap-4">
          {/* Streamer Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-fg-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-fg-primary">Live Stream</h1>
            <p className="text-fg-secondary text-sm mt-1">Streamer Name</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-status-live text-fg-primary text-xs font-medium rounded">
                LIVE
              </span>
              <span className="text-fg-muted text-sm">• 0 viewers</span>
            </div>
          </div>

          {/* Follow Button */}
          <button className="px-4 py-2 bg-brand-primary-dark hover:bg-brand-primary text-fg-primary font-medium rounded-lg transition-colors">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
