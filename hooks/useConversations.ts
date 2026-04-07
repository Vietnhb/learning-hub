"use client";

import { useState, useEffect, useRef } from "react";
import { ConversationWithDetails } from "@/types";
import {
  getAllConversations,
  subscribeToConversations,
  subscribeToMessageChanges,
} from "@/lib/chatService";

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchConversations = async () => {
    setLoading(true);

    const { data, error: err } = await getAllConversations();

    if (err) {
      setError(err);
      setConversations([]);
    } else {
      setConversations(data || []);
      setError(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    const scheduleRefresh = () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        fetchConversations();
      }, 250);
    };

    const convChannel = subscribeToConversations(() => {
      scheduleRefresh();
    });

    const messageChannel = subscribeToMessageChanges(() => {
      scheduleRefresh();
    });

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      convChannel.unsubscribe();
      messageChannel.unsubscribe();
    };
  }, []);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
  };
}
