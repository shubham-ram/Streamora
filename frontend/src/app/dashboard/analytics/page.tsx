"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/utils";
import {
  Loader2,
  Video,
  Clock,
  Eye,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

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

function formatDuration(startedAt: string, endedAt?: string): string {
  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  const diffMs = end - start;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
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
        // First get the current user's username
        const token = localStorage.getItem("token");
        const profileRes = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) return;
        const profile = await profileRes.json();

        // Then get their public profile with streams
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

  // Compute stats
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

  const statCards = [
    {
      label: "Total Streams",
      value: totalStreams,
      icon: Video,
      color: "from-brand-primary to-brand-secondary",
    },
    {
      label: "Hours Streamed",
      value: totalHours,
      icon: Clock,
      color: "from-brand-secondary to-brand-accent",
    },
    {
      label: "Avg Viewers",
      value: avgViewers,
      icon: Eye,
      color: "from-status-success to-brand-accent",
    },
    {
      label: "Followers",
      value: data.followersCount,
      icon: Users,
      color: "from-brand-primary-light to-brand-secondary-light",
    },
  ];

  const recentStreams = data.streams.slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-primary border border-border-main rounded-xl p-4 sm:p-5 group hover:border-brand-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}
              >
                <card.icon className="w-5 h-5 text-fg-primary" />
              </div>
              <TrendingUp className="w-4 h-4 text-fg-subtle" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-fg-primary">
              {typeof card.value === "number"
                ? card.value.toLocaleString()
                : card.value}
            </p>
            <p className="text-xs sm:text-sm text-fg-muted mt-0.5">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Peak Viewers + Following count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface-primary border border-border-main rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-status-live/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-status-live" />
            </div>
            <span className="text-sm text-fg-secondary">Peak Viewers</span>
          </div>
          <p className="text-3xl font-bold text-fg-primary">
            {peakViewers.toLocaleString()}
          </p>
          <p className="text-xs text-fg-muted mt-1">
            Highest concurrent viewers across all streams
          </p>
        </div>

        <div className="bg-surface-primary border border-border-main rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-brand-primary-light" />
            </div>
            <span className="text-sm text-fg-secondary">Following</span>
          </div>
          <p className="text-3xl font-bold text-fg-primary">
            {data.followingCount.toLocaleString()}
          </p>
          <p className="text-xs text-fg-muted mt-1">
            Channels you are following
          </p>
        </div>
      </div>

      {/* Recent Streams Table */}
      <section className="bg-surface-primary border border-border-main rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-main">
          <h2 className="text-lg font-semibold text-fg-primary flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-primary-light" />
            Recent Streams
          </h2>
          <p className="text-sm text-fg-muted mt-0.5">
            Your last {recentStreams.length} streams
          </p>
        </div>

        {recentStreams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-main text-left">
                  <th className="px-6 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider">
                    Viewers
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider hidden md:table-cell">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main">
                {recentStreams.map((stream) => (
                  <tr
                    key={stream.id}
                    className="hover:bg-surface-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-fg-primary truncate max-w-[200px]">
                        {stream.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-fg-secondary">
                        {stream.category?.name || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-fg-secondary">
                        <Eye className="w-3.5 h-3.5" />
                        {stream.viewerCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-fg-secondary">
                        {formatDuration(stream.startedAt, stream.endedAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-fg-muted">
                        {new Date(stream.startedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {stream.isLive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-live/20 text-status-live text-xs font-medium rounded-full">
                          <span className="w-1.5 h-1.5 bg-status-live rounded-full animate-pulse" />
                          Live
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-surface-secondary text-fg-muted text-xs rounded-full">
                          Ended
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-fg-secondary">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No streams yet. Start your first stream!</p>
          </div>
        )}
      </section>
    </div>
  );
}
