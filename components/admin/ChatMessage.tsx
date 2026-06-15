"use client";

import React from "react";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth();
  const isOwnMessage = user?.id === message.sender_id;
  const sentAt = new Date(message.created_at).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isOwnMessage ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2",
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.message}
        </p>
        <p
          className={cn(
            "text-xs mt-1",
            isOwnMessage
              ? "text-primary-foreground/70"
              : "text-muted-foreground",
          )}
        >
          {sentAt}
        </p>
      </div>
    </div>
  );
}
