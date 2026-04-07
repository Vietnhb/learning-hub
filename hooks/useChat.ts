"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types";
import { supabase } from "@/lib/supabase";
import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
} from "@/lib/chatService";

export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const sortByCreatedAt = (items: Message[]) =>
    [...items].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  useEffect(() => {
    async function resolveUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    }

    resolveUser();
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error: err } = await getMessages(conversationId);

    if (err) {
      setError(err);
      setMessages([]);
    } else {
      setMessages(sortByCreatedAt(data || []));
      setError(null);

      // Mark messages as read
      await markMessagesAsRead(conversationId);
    }

    setLoading(false);
  }, [conversationId]);

  const send = async (message: string, receiverId: string) => {
    if (!conversationId) return { success: false, error: "No conversation" };
    if (!currentUserId) {
      return { success: false, error: "User not authenticated" };
    }

    setSending(true);
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMessage: Message = {
      id: optimisticId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      receiver_id: receiverId,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => sortByCreatedAt([...prev, optimisticMessage]));

    const result = await sendMessage({
      conversation_id: conversationId,
      receiver_id: receiverId,
      message,
    });

    setSending(false);

    if (result.success && result.data) {
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.id !== optimisticId);
        if (withoutOptimistic.some((m) => m.id === result.data!.id)) {
          return sortByCreatedAt(withoutOptimistic);
        }
        return sortByCreatedAt([...withoutOptimistic, result.data!]);
      });
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setError(result.error || "Failed to send message");
    }

    return result;
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Subscribe to new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = subscribeToMessages(conversationId, (newMessage) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === newMessage.id)) {
          return sortByCreatedAt(prev);
        }
        return sortByCreatedAt([...prev, newMessage]);
      });

      // Auto-mark as read only for incoming messages to current user
      if (currentUserId && newMessage.receiver_id === currentUserId) {
        void markMessagesAsRead(conversationId);
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, currentUserId]);

  return {
    messages,
    loading,
    error,
    sending,
    send,
    refetch: fetchMessages,
  };
}
