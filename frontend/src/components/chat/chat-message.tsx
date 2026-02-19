import { User } from "lucide-react";
import Image from "next/image";

interface ChatMessageProps {
  username: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  isOwnMessage?: boolean;
}

export function ChatMessage({
  username,
  avatarUrl,
  content,
  timestamp,
  isOwnMessage,
}: ChatMessageProps) {
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group flex gap-2 px-4 py-1.5 hover:bg-surface-secondary/30 transition-colors">
      {/* Avatar */}
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center flex-shrink-0 overflow-hidden relative mt-0.5">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={username} fill className="object-cover" />
        ) : (
          <User className="w-3 h-3 text-fg-primary" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <span className="inline">
          <span
            className={`text-sm font-semibold mr-1.5 ${
              isOwnMessage ? "text-brand-primary-light" : "text-fg-primary"
            }`}
          >
            {username}
          </span>
          <span className="text-sm text-fg-secondary break-words">
            {content}
          </span>
        </span>
      </div>

      {/* Timestamp (shown on hover) */}
      <span className="text-[10px] text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
        {time}
      </span>
    </div>
  );
}
