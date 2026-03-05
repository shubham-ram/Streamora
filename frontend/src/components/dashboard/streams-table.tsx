import { Eye, Video, Calendar } from "lucide-react";

interface StreamData {
  id: string;
  title: string;
  viewerCount: number;
  startedAt: string;
  endedAt?: string;
  isLive: boolean;
  category?: { name: string; slug: string };
}

interface StreamsTableProps {
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

export function StreamsTable({ streams }: StreamsTableProps) {
  return (
    <section className="bg-surface-primary border border-border-main rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border-main">
        <h2 className="text-lg font-semibold text-fg-primary flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-primary-light" />
          Recent Streams
        </h2>
        <p className="text-sm text-fg-muted mt-0.5">
          Your last {streams.length} streams
        </p>
      </div>

      {streams.length > 0 ? (
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
              {streams.map((stream) => (
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
                      {new Date(stream.startedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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
  );
}
