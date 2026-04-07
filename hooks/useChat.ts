"use client";

import { useState, useEffect, useCallback } from "react";
import { Message } from "@/types";
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

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error: err } = await getMessages(conversationId);

    if (err) {
      setError(err);
      setMessages([]);
    } else {
      setMessages(data || []);
      setError(null);

      // Mark messages as read
      await markMessagesAsRead(conversationId);
    }

    setLoading(false);
  }, [conversationId]);

  const send = async (message: string, receiverId: string) => {
    if (!conversationId) return { success: false, error: "No conversation" };

    setSending(true);

    const result = await sendMessage({
      conversation_id: conversationId,
      receiver_id: receiverId,
      message,
    });

    setSending(false);

    if (result.success && result.data) {
      setMessages((prev) => [...prev, result.data!]);
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
          return prev;
        }
        return [...prev, newMessage];
      });

      // Auto-mark as read
      markMessagesAsRead(conversationId);
    });

    return () => {
      channel.unsubscribe();
    };
  }, [conversationId]);

  return {
    messages,
    loading,
    error,
    sending,
    send,
    refetch: fetchMessages,
  };
}
