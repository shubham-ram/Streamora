"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  className?: string;
}

export function VideoPlayer({
  src,
  autoPlay = true,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check HLS support outside of effect to avoid lint issue
  const hlsSupported = useMemo(() => Hls.isSupported(), []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Check if browser natively supports HLS (Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => setIsLoading(false));
      if (autoPlay) video.play();
      return;
    }

    // Use hls.js for other browsers
    if (hlsSupported) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDurationCount: 3, // Sync to 3 segments behind live
        liveMaxLatencyDurationCount: 6,
        liveDurationInfinity: true, // Treat as infinite live stream
        startPosition: -1, // Start at live edge (-1 means live edge)
      });

      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        // Seek to live edge before playing
        if (hls.liveSyncPosition) {
          video.currentTime = hls.liveSyncPosition;
        }
        if (autoPlay) video.play();
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Network error - stream may be offline");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError("Media error - attempting recovery");
              hls.recoverMediaError();
              break;
            default:
              setError("Stream unavailable");
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }
  }, [src, autoPlay, hlsSupported]);

  // Compute display error - includes HLS not supported case
  const displayError = !hlsSupported
    ? "HLS not supported in this browser"
    : error;

  return (
    <div className={`relative bg-black ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        playsInline
        muted
      />

      {isLoading && !displayError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-fg-primary text-sm">Loading stream...</p>
          </div>
        </div>
      )}

      {displayError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <svg
              className="w-12 h-12 text-fg-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-fg-secondary text-sm">{displayError}</p>
          </div>
        </div>
      )}
    </div>
  );
}
