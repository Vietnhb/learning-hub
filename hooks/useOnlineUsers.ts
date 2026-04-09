"use client";

import { useSyncExternalStore } from "react";
import {
  getOnlinePresenceSnapshot,
  subscribeOnlinePresence,
} from "@/lib/onlinePresenceStore";

function normalizeId(value?: string | null): string {
  return (value || "").trim().toLowerCase();
}

export function useOnlineUsers() {
  const snapshot = useSyncExternalStore(
    subscribeOnlinePresence,
    getOnlinePresenceSnapshot,
    getOnlinePresenceSnapshot,
  );

  return {
    onlineUserIds: snapshot.onlineUserIds,
    onlineCount: snapshot.onlineUserIds.size,
    lastSeenByUserId: snapshot.lastSeenByUserId,
    connectionStatus: snapshot.connectionStatus,
    isOnline: (userId: string) =>
      snapshot.onlineUserIds.has(normalizeId(userId)),
  };
}
