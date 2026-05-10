"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type UserNotification = {
  id: string;
  type: "feedback" | "message" | "reward";
  title: string;
  description: string;
  href: string;
  createdAt: string;
  isUnread: boolean;
};

const getHiddenStorageKey = (userId: string) =>
  `user_notification_hidden_ids:${userId}`;
const getLocalNotificationsKey = (userId: string) =>
  `user_local_notifications:${userId}`;

const NOTIFICATION_SYNC_EVENT = "learning-hub:user-notifications-updated";
const REWARD_EVENT = "learning-hub:reward-points";

export function useUserNotifications(userId?: string) {
  const [serverNotifications, setServerNotifications] = useState<UserNotification[]>([]);
  const [localNotifications, setLocalNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  // Derived state: merge and sort
  const notifications = useMemo(() => {
    return [...serverNotifications, ...localNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ).slice(0, 30);
  }, [serverNotifications, localNotifications]);

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setServerNotifications([]);
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

    setServerNotifications([...feedbackNotifications, ...messageNotifications]);
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

    const loadLocalNotifications = () => {
      const raw = window.localStorage.getItem(getLocalNotificationsKey(userId));
      if (!raw) {
        setLocalNotifications([]);
        return;
      }
      try {
        setLocalNotifications(JSON.parse(raw));
      } catch {
        setLocalNotifications([]);
      }
    };

    loadHiddenIds();
    loadLocalNotifications();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === getHiddenStorageKey(userId)) loadHiddenIds();
      if (event.key === getLocalNotificationsKey(userId)) loadLocalNotifications();
    };
    const handleLocalSync = () => {
      loadHiddenIds();
      loadLocalNotifications();
    };

    const handleRewardEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ points: number }>;
      const points = customEvent.detail?.points;
      if (!points) return;
      
      const newNotif: UserNotification = {
        id: `reward:${Date.now()}`,
        type: "reward",
        title: "Điểm danh hàng ngày",
        description: `Bạn vừa nhận được +${points} điểm Learning Hub!`,
        href: "#",
        createdAt: new Date().toISOString(),
        isUnread: true,
      };
      
      setLocalNotifications(prev => {
        const next = [newNotif, ...prev].slice(0, 10);
        window.localStorage.setItem(getLocalNotificationsKey(userId), JSON.stringify(next));
        return next;
      });
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(NOTIFICATION_SYNC_EVENT, handleLocalSync);
    window.addEventListener(REWARD_EVENT, handleRewardEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(NOTIFICATION_SYNC_EVENT, handleLocalSync);
      window.removeEventListener(REWARD_EVENT, handleRewardEvent);
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

      if (id.startsWith("reward:")) {
        setLocalNotifications(prev => {
          const next = prev.filter(n => n.id !== id);
          if (userId) {
            window.localStorage.setItem(getLocalNotificationsKey(userId), JSON.stringify(next));
          }
          return next;
        });
        return;
      }

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
