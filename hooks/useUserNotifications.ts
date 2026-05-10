"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type UserNotification = {
  id: string;
  type: "feedback" | "message";
  title: string;
  description: string;
  href: string;
  createdAt: string;
  isUnread: boolean;
};

const getHiddenStorageKey = (userId: string) =>
  `user_notification_hidden_ids:${userId}`;

const NOTIFICATION_SYNC_EVENT = "learning-hub:user-notifications-updated";

export function useUserNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const [feedbackResult, messageResult] = await Promise.all([
      supabase
        .from("feedback")
        .select("id, subject, status, created_at, updated_at")
        .eq("user_id", userId)
        .in("status", ["resolved", "closed"])
        .order("updated_at", { ascending: false })
        .limit(20),
      supabase
        .from("messages")
        .select("id, message, created_at, is_read, sender_id")
        .eq("receiver_id", userId)
        .neq("sender_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (feedbackResult.error) {
      console.error("Fetch user feedback notifications error:", feedbackResult.error);
    }
    if (messageResult.error) {
      console.error("Fetch user message notifications error:", messageResult.error);
    }

    const feedbackNotifications: UserNotification[] = (feedbackResult.data || []).map(
      (item) => ({
        id: `feedback:${item.id}:${item.status}`,
        type: "feedback",
        title:
          item.status === "resolved"
            ? "Phản hồi đã được giải quyết"
            : "Phản hồi đã đóng",
        description: item.subject,
        href: "/feedback",
        createdAt: item.updated_at || item.created_at,
        isUnread: true,
      }),
    );

    const messageNotifications: UserNotification[] = (messageResult.data || []).map(
      (item) => ({
        id: `message:${item.id}`,
        type: "message",
        title: "Tin nhắn mới từ quản trị viên",
        description: item.message,
        href: "/messages",
        createdAt: item.created_at,
        isUnread: !item.is_read,
      }),
    );

    const merged = [...feedbackNotifications, ...messageNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    setNotifications(merged.slice(0, 30));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!userId) {
      setHiddenIds([]);
      return;
    }

    const loadHiddenIds = () => {
      const raw = window.localStorage.getItem(getHiddenStorageKey(userId));
      if (!raw) {
        setHiddenIds([]);
        return;
      }

      try {
        const parsed = JSON.parse(raw);
        setHiddenIds(
          Array.isArray(parsed)
            ? parsed.filter((item) => typeof item === "string")
            : [],
        );
      } catch {
        setHiddenIds([]);
      }
    };

    loadHiddenIds();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === getHiddenStorageKey(userId)) loadHiddenIds();
    };
    const handleLocalSync = () => loadHiddenIds();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(NOTIFICATION_SYNC_EVENT, handleLocalSync);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(NOTIFICATION_SYNC_EVENT, handleLocalSync);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const feedbackChannel = supabase
      .channel(`user-feedback:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "feedback",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void fetchNotifications();
        },
      )
      .subscribe();

    const messageChannel = supabase
      .channel(`user-messages:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        () => {
          void fetchNotifications();
        },
      )
      .subscribe();

    return () => {
      feedbackChannel.unsubscribe();
      messageChannel.unsubscribe();
    };
  }, [userId, fetchNotifications]);

  const persistHiddenIds = useCallback(
    (ids: string[]) => {
      if (!userId) return;

      const deduped = Array.from(new Set(ids)).slice(-200);
      setHiddenIds(deduped);
      window.localStorage.setItem(
        getHiddenStorageKey(userId),
        JSON.stringify(deduped),
      );
      window.dispatchEvent(new Event(NOTIFICATION_SYNC_EVENT));
    },
    [userId],
  );

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => !hiddenIds.includes(item.id)),
    [notifications, hiddenIds],
  );

  const unreadCount = useMemo(
    () => visibleNotifications.filter((item) => item.isUnread).length,
    [visibleNotifications],
  );

  const dismissNotification = useCallback(
    async (id: string) => {
      if (hiddenIds.includes(id)) return;

      persistHiddenIds([...hiddenIds, id]);

      if (!userId || !id.startsWith("message:")) return;

      const messageId = id.replace("message:", "");
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId)
        .eq("receiver_id", userId);
      void fetchNotifications();
    },
    [fetchNotifications, hiddenIds, persistHiddenIds, userId],
  );

  const markAllAsSeen = useCallback(() => {
    persistHiddenIds([
      ...hiddenIds,
      ...visibleNotifications.map((item) => item.id),
    ]);

    if (!userId) return;

    const messageIds = visibleNotifications
      .filter((item) => item.type === "message")
      .map((item) => item.id.replace("message:", ""));

    if (messageIds.length > 0) {
      void supabase
        .from("messages")
        .update({ is_read: true })
        .in("id", messageIds)
        .eq("receiver_id", userId)
        .then(() => {
          void fetchNotifications();
        });
    }
  }, [fetchNotifications, hiddenIds, persistHiddenIds, userId, visibleNotifications]);

  return {
    notifications,
    visibleNotifications,
    unreadCount,
    loading,
    refetch: fetchNotifications,
    dismissNotification,
    markAllAsSeen,
  };
}
