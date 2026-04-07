"use client";

import { useState, useEffect } from "react";
import { ConversationWithDetails } from "@/types";
import { getAllConversations } from "@/lib/chatService";

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
  };
}
