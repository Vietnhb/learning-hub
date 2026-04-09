"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { setRealtimeAuthFromSession } from "@/lib/realtimeAuth";
import { USERS_ONLINE_PRESENCE_CHANNEL } from "@/lib/realtimeChannels";
import { supabase } from "@/lib/supabase";

type PresenceMeta = {
  user_id?: string;
};

function normalizeId(value?: string | null): string {
  return (value || "").trim().toLowerCase();
}

function buildOnlineSetFromPresenceState(
  state: Record<string, PresenceMeta[]>,
): Set<string> {
  const next = new Set<string>();

  for (const [key, metas] of Object.entries(state)) {
    const normalizedKey = normalizeId(key);
    if (normalizedKey) {
      next.add(normalizedKey);
    }

    for (const meta of metas) {
      const normalizedUserId = normalizeId(meta.user_id);
      if (normalizedUserId) {
        next.add(normalizedUserId);
      }
    }
  }

  return next;
}

function areSetsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) {
    return false;
  }

  return Array.from(a).every((value) => b.has(value));
}

export function useOnlineUsers() {
  const { user } = useAuth();
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");

  useEffect(() => {
    if (!user?.id) {
      setOnlineUserIds(new Set());
      setConnectionStatus("idle");
      return;
    }

    let active = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let retryCount = 0;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const cleanupChannel = () => {
      if (!channel) {
        return;
      }

      void supabase.removeChannel(channel);
      channel = null;
    };

    const scheduleReconnect = () => {
      if (!active || reconnectTimer) {
        return;
      }

      const delay = Math.min(500 * 2 ** retryCount, 4000);
      retryCount += 1;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        void connect();
      }, delay);
    };

    const connect = async () => {
      if (!active) {
        return;
      }

      cleanupChannel();
      setConnectionStatus("connecting");

      try {
        await setRealtimeAuthFromSession();
      } catch (error) {
        console.error("Set realtime auth error:", error);
      }

      const nextChannel = supabase.channel(USERS_ONLINE_PRESENCE_CHANNEL);
      channel = nextChannel;

      const syncPresence = () => {
        const state = nextChannel.presenceState<PresenceMeta>();
        const next = buildOnlineSetFromPresenceState(state);
        setOnlineUserIds((prev) => (areSetsEqual(prev, next) ? prev : next));
      };

      nextChannel.on("presence", { event: "sync" }, syncPresence);
      nextChannel.on("presence", { event: "join" }, syncPresence);
      nextChannel.on("presence", { event: "leave" }, syncPresence);

      nextChannel.subscribe((status) => {
        if (!active) {
          return;
        }

        if (status === "SUBSCRIBED") {
          retryCount = 0;
          setConnectionStatus("connected");
          syncPresence();
          return;
        }

        if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          setConnectionStatus("error");
          cleanupChannel();
          scheduleReconnect();
        }
      });
    };

    void connect();

    return () => {
      active = false;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      cleanupChannel();
    };
  }, [user?.id]);

  return {
    onlineUserIds,
    onlineCount: onlineUserIds.size,
    connectionStatus,
    isOnline: (userId: string) => onlineUserIds.has(normalizeId(userId)),
  };
}
