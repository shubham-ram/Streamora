import { Video, Clock, Eye, Users, TrendingUp } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

interface StatCardsProps {
  totalStreams: number;
  totalHours: number;
  avgViewers: number;
  followersCount: number;
  peakViewers: number;
  followingCount: number;
}

export function StatCards({
  totalStreams,
  totalHours,
  avgViewers,
  followersCount,
  peakViewers,
  followingCount,
}: StatCardsProps) {
  const cards: StatCard[] = [
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
      value: followersCount,
      icon: Users,
      color: "from-brand-primary-light to-brand-secondary-light",
    },
  ];

  return (
    <>
      {/* Main stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
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
              {card.value.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-fg-muted mt-0.5">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Peak Viewers + Following */}
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
            {followingCount.toLocaleString()}
          </p>
          <p className="text-xs text-fg-muted mt-1">
            Channels you are following
          </p>
        </div>
      </div>
    </>
  );
}
