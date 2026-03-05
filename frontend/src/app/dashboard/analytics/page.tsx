"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { API_URL } from "@/lib/utils";
import { StatCards } from "@/components/dashboard/stat-cards";
import { StreamsTable } from "@/components/dashboard/streams-table";

interface StreamData {
  id: string;
  title: string;
  viewerCount: number;
  startedAt: string;
  endedAt?: string;
  isLive: boolean;
  category?: { name: string; slug: string };
}

interface AnalyticsData {
  username: string;
  followersCount: number;
  followingCount: number;
  streams: StreamData[];
}

function getDurationMs(startedAt: string, endedAt?: string): number {
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  return end - start;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");
        const profileRes = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) return;
        const profile = await profileRes.json();

        const publicRes = await fetch(
          `${API_URL}/api/user/${profile.username}`,
        );
        if (publicRes.ok) {
          setData(await publicRes.json());
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-fg-secondary">
        Failed to load analytics data.
      </div>
    );
  }

  const totalStreams = data.streams.length;
  const totalHoursMs = data.streams.reduce(
    (acc, s) => acc + getDurationMs(s.startedAt, s.endedAt),
    0,
  );
  const totalHours = Math.round((totalHoursMs / (1000 * 60 * 60)) * 10) / 10;
  const avgViewers =
    totalStreams > 0
      ? Math.round(
          data.streams.reduce((acc, s) => acc + s.viewerCount, 0) /
            totalStreams,
        )
      : 0;
  const peakViewers =
    totalStreams > 0 ? Math.max(...data.streams.map((s) => s.viewerCount)) : 0;

  return (
    <div className="space-y-8">
      <StatCards
        totalStreams={totalStreams}
        totalHours={totalHours}
        avgViewers={avgViewers}
        followersCount={data.followersCount}
        peakViewers={peakViewers}
        followingCount={data.followingCount}
      />
      <StreamsTable streams={data.streams.slice(0, 10)} />
    </div>
  );
}
