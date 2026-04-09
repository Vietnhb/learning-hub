"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { USERS_ONLINE_PRESENCE_CHANNEL } from "@/lib/realtimeChannels";
import { setRealtimeAuthFromSession } from "@/lib/realtimeAuth";
import { useAuth } from "@/contexts/AuthContext";

type PresenceMeta = {
  user_id?: string;
};

function buildOnlineSetFromPresenceState(
  state: Record<string, PresenceMeta[]>,
): Set<string> {
  const next = new Set<string>();

  for (const [key, metas] of Object.entries(state)) {
    if (key) {
      next.add(key);
    }

    for (const meta of metas) {
      if (meta.user_id) {
        next.add(meta.user_id);
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
      setConnectionStatus("idle");
      return;
    }

    let active = true;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let currentChannel:
      | ReturnType<typeof supabase.channel>
      | null = null;

    const cleanupChannel = () => {
      if (!currentChannel) {
        return;
      }

      currentChannel.untrack().catch(() => {});
      void supabase.removeChannel(currentChannel);
      currentChannel = null;
    };

    const scheduleReconnect = () => {
      if (!active || reconnectTimer) {
        return;
      }

      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        void connect();
      }, 2000);
    };

    const connect = async () => {
      if (!active) {
        return;
      }

      setConnectionStatus("connecting");
      void setRealtimeAuthFromSession();

      const channel = supabase.channel(USERS_ONLINE_PRESENCE_CHANNEL, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });
      currentChannel = channel;

      const syncPresence = () => {
        const state = channel.presenceState<PresenceMeta>();
        const next = buildOnlineSetFromPresenceState(state);

        setOnlineUserIds((prev) => {
          return areSetsEqual(prev, next) ? prev : next;
        });
      };

      channel.on("presence", { event: "sync" }, syncPresence);
      channel.on("presence", { event: "join" }, syncPresence);
      channel.on("presence", { event: "leave" }, syncPresence);

      channel.subscribe((status) => {
        if (!active) {
          return;
        }

        if (status === "SUBSCRIBED") {
          setConnectionStatus("connected");
          channel
            .track({
              user_id: user.id,
              online_at: new Date().toISOString(),
            })
            .catch((error) =>
              console.error("Track admin online presence error:", error),
            );
          syncPresence();
          return;
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
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
    isOnline: (userId: string) => onlineUserIds.has(userId),
  };
}
