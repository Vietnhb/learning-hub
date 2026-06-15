"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateConversation } from "@/lib/chatService";

type UseAdminConversationOptions = {
  enabled?: boolean;
  redirectUnauthenticatedTo?: string;
};

export function useAdminConversation({
  enabled = true,
  redirectUnauthenticatedTo,
}: UseAdminConversationOptions = {}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [loadingConversation, setLoadingConversation] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoadingConversation(false);
      return;
    }

    let cancelled = false;

    async function initConversation() {
      if (authLoading) return;

      if (!user) {
        if (redirectUnauthenticatedTo) {
          router.replace(
            `/auth/login?redirect=${encodeURIComponent(redirectUnauthenticatedTo)}`,
          );
        }
        setLoadingConversation(false);
        return;
      }

      if (conversationId) {
        setLoadingConversation(false);
        return;
      }

      setLoadingConversation(true);
      const { data, error } = await getOrCreateConversation();

      if (cancelled) return;

      if (data) {
        setConversationId(data.id);
        setAdminId(data.admin_id || null);
      } else {
        console.error("Cannot create or load admin conversation:", error);
      }

      setLoadingConversation(false);
    }

    void initConversation();

    return () => {
      cancelled = true;
    };
  }, [
    authLoading,
    conversationId,
    enabled,
    redirectUnauthenticatedTo,
    router,
    user,
  ]);

  const getReceiverId = () => {
    if (!user) return null;
    return adminId || user.id;
  };

  return {
    user,
    authLoading,
    conversationId,
    adminId,
    loadingConversation: authLoading || loadingConversation,
    getReceiverId,
  };
}
