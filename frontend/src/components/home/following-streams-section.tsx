"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { StreamCard } from "@/components/stream-card";
import { API_URL } from "@/lib/utils";

interface FollowedStream {
  id: string;
  title: string;
  viewerCount: number;
  category?: { name: string };
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

export function FollowingStreamsSection() {
  const [streams, setStreams] = useState<FollowedStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    setIsLoggedIn(true);
    fetchFollowingStreams(token);
  }, []);

  const fetchFollowingStreams = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/follow/streams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStreams(await res.json());
      }
    } catch (error) {
      console.error("Error fetching following streams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-surface-secondary rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-video bg-surface-secondary rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (streams.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-brand-primary" />
        <h2 className="text-2xl font-bold text-fg-primary">Following</h2>
        <span className="text-fg-secondary">{streams.length} live</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {streams.map((stream) => (
          <StreamCard
            key={stream.id}
            id={stream.id}
            title={stream.title}
            username={stream.user.username}
            avatarUrl={stream.user.avatarUrl}
            viewerCount={stream.viewerCount}
            category={stream.category?.name}
          />
        ))}
      </div>
    </section>
  );
}
