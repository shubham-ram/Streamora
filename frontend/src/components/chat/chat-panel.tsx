"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  MessageCircle,
  Send,
  Wifi,
  WifiOff,
  Loader2,
  LogIn,
} from "lucide-react";
import { ChatMessage } from "./chat-message";
import { useChat, type ChatMessage as ChatMessageType } from "@/hooks/use-chat";

interface ChatPanelProps {
  streamId: string;
}

export function ChatPanel({ streamId }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUserId = useMemo(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return (payload.sub || payload.id) as string;
    } catch {
      return null;
    }
  }, []);

  const { messages, sendMessage, isConnected, isConnecting, error } = useChat({
    streamId,
    enabled: !!currentUserId,
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-surface-primary border-l border-border-subtle">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-brand-primary" />
          <h3 className="font-semibold text-fg-primary text-sm">Stream Chat</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {isConnecting ? (
            <Loader2 className="w-3.5 h-3.5 text-fg-muted animate-spin" />
          ) : isConnected ? (
            <Wifi className="w-3.5 h-3.5 text-status-online" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-status-live" />
          )}
          <span className="text-xs text-fg-muted">
            {isConnecting
              ? "Connecting..."
              : isConnected
                ? "Connected"
                : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-2 space-y-0.5 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <MessageCircle className="w-10 h-10 text-fg-subtle mb-3" />
            <p className="text-fg-secondary text-sm">No messages yet</p>
            <p className="text-fg-muted text-xs mt-1">
              Be the first to say something!
            </p>
          </div>
        ) : (
          messages.map((msg: ChatMessageType) => (
            <ChatMessage
              key={msg.id}
              username={msg.user.username}
              avatarUrl={msg.user.avatarUrl}
              content={msg.content}
              timestamp={msg.createdAt}
              isOwnMessage={msg.user.id === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 bg-status-live/10 border-t border-status-live/20">
          <p className="text-xs text-status-live">{error}</p>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-border-subtle">
        {!currentUserId ? (
          <div className="flex items-center justify-center gap-2 py-2 text-fg-muted text-sm">
            <LogIn className="w-4 h-4" />
            <span>Log in to chat</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message..."
              maxLength={500}
              disabled={!isConnected}
              className="flex-1 px-3 py-2 bg-surface-secondary text-fg-primary text-sm rounded-lg border border-border-subtle focus:border-brand-primary focus:outline-none placeholder:text-fg-muted disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={!isConnected || !input.trim()}
              className="p-2 bg-brand-primary-dark hover:bg-brand-primary text-fg-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
