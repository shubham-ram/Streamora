"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

interface UseChatOptions {
  streamId: string;
  enabled?: boolean;
}

interface UseChatReturn {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useChat({
  streamId,
  enabled = true,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled || !streamId) return;

    const token = localStorage.getItem("token");

    const socket = io(API_URL, {
      path: "/socket.io",
      auth: { token },
      query: { streamId },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    });

    socket.on("chatHistory", (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on("newMessage", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("messageDeleted", (messageId: string) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    socket.on("connect_error", (err) => {
      setIsConnecting(false);
      setIsConnected(false);
      setError(err.message || "Connection failed");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [streamId, enabled]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !isConnected || !content.trim()) return;
      socketRef.current.emit("sendMessage", { content: content.trim() });
    },
    [isConnected],
  );

  return { messages, sendMessage, isConnected, isConnecting, error };
}
