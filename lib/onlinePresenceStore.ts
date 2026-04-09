import { supabase } from "@/lib/supabase";
import { USERS_ONLINE_PRESENCE_CHANNEL } from "@/lib/realtimeChannels";
import { setRealtimeAuthFromSession } from "@/lib/realtimeAuth";

export type PresenceConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "error";

type PresenceMeta = {
  user_id?: string;
  online_at?: string;
};

type PresenceSnapshot = {
  connectionStatus: PresenceConnectionStatus;
  onlineUserIds: Set<string>;
  lastSeenByUserId: Record<string, string>;
};

const listeners = new Set<() => void>();

let snapshot: PresenceSnapshot = {
  connectionStatus: "idle",
  onlineUserIds: new Set(),
  lastSeenByUserId: {},
};

let channel: ReturnType<typeof supabase.channel> | null = null;
let active = false;
let currentUserId: string | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let retryCount = 0;
let lastPersistAt = 0;

function emit() {
  listeners.forEach((listener) => listener());
}

function normalizeId(value?: string | null): string {
  return (value || "").trim().toLowerCase();
}

function maxIso(a?: string, b?: string): string | undefined {
  if (!a) return b;
  if (!b) return a;
  return new Date(a).getTime() >= new Date(b).getTime() ? a : b;
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) {
    return false;
  }
  return Array.from(a).every((x) => b.has(x));
}

function recordsEqual(
  a: Record<string, string>,
  b: Record<string, string>,
): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every((k) => a[k] === b[k]);
}

function setSnapshot(next: PresenceSnapshot) {
  const sameStatus = snapshot.connectionStatus === next.connectionStatus;
  const sameOnline = setsEqual(snapshot.onlineUserIds, next.onlineUserIds);
  const sameLastSeen = recordsEqual(snapshot.lastSeenByUserId, next.lastSeenByUserId);

  if (sameStatus && sameOnline && sameLastSeen) {
    return;
  }

  snapshot = next;
  emit();
}

function buildOnlineSet(state: Record<string, PresenceMeta[]>): Set<string> {
  const next = new Set<string>();

  for (const [key, metas] of Object.entries(state)) {
    const normalizedKey = normalizeId(key);
    if (normalizedKey) {
      next.add(normalizedKey);
    }

    for (const meta of metas) {
      const metaUserId = normalizeId(meta.user_id);
      if (metaUserId) {
        next.add(metaUserId);
      }
    }
  }

  return next;
}

function buildOnlineMeta(state: Record<string, PresenceMeta[]>): Record<string, string> {
  const next: Record<string, string> = {};

  for (const [key, metas] of Object.entries(state)) {
    const normalizedKey = normalizeId(key);
    if (!normalizedKey) {
      continue;
    }

    for (const meta of metas) {
      if (!meta.online_at) {
        continue;
      }
      next[normalizedKey] = maxIso(next[normalizedKey], meta.online_at) || meta.online_at;
    }
  }

  return next;
}

function cleanupChannel() {
  if (!channel) {
    return;
  }

  channel.untrack().catch(() => {});
  void supabase.removeChannel(channel);
  channel = null;
}

function stopHeartbeat() {
  if (!heartbeatTimer) {
    return;
  }
  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

function startHeartbeat() {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    void persistLastOnline();
  }, 60_000);
}

async function persistLastOnline(force = false) {
  if (!currentUserId) {
    return;
  }

  const now = Date.now();
  if (!force && now - lastPersistAt < 50_000) {
    return;
  }

  lastPersistAt = now;
  const { error } = await supabase
    .from("users")
    .update({ last_online_at: new Date().toISOString() })
    .eq("id", currentUserId);

  if (error) {
    console.error("Persist last_online_at error:", error);
  }
}

function scheduleReconnect() {
  if (!active || reconnectTimer) {
    return;
  }

  const delay = Math.min(500 * 2 ** retryCount, 4000);
  retryCount += 1;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void connect();
  }, delay);
}

function syncPresence() {
  if (!channel) {
    return;
  }

  const state = channel.presenceState<PresenceMeta>();
  const nextOnline = buildOnlineSet(state);
  const nextOnlineMeta = buildOnlineMeta(state);
  const now = new Date().toISOString();

  const prevOnline = snapshot.onlineUserIds;
  const nextLastSeen = { ...snapshot.lastSeenByUserId };

  for (const [id, onlineAt] of Object.entries(nextOnlineMeta)) {
    nextLastSeen[id] = maxIso(nextLastSeen[id], onlineAt) || onlineAt;
  }

  for (const id of Array.from(nextOnline)) {
    if (!nextLastSeen[id]) {
      nextLastSeen[id] = now;
    }
  }

  for (const id of Array.from(prevOnline)) {
    if (!nextOnline.has(id)) {
      nextLastSeen[id] = now;
    }
  }

  setSnapshot({
    connectionStatus: snapshot.connectionStatus,
    onlineUserIds: nextOnline,
    lastSeenByUserId: nextLastSeen,
  });
}

async function connect() {
  if (!active || !currentUserId) {
    return;
  }

  cleanupChannel();
  stopHeartbeat();

  setSnapshot({
    ...snapshot,
    connectionStatus: "connecting",
  });

  try {
    await setRealtimeAuthFromSession();
  } catch (error) {
    console.error("Set realtime auth error:", error);
  }

  const nextChannel = supabase.channel(USERS_ONLINE_PRESENCE_CHANNEL, {
    config: {
      presence: {
        key: currentUserId,
      },
    },
  });
  channel = nextChannel;

  nextChannel.on("presence", { event: "sync" }, syncPresence);
  nextChannel.on("presence", { event: "join" }, syncPresence);
  nextChannel.on("presence", { event: "leave" }, syncPresence);

  nextChannel.subscribe((status) => {
    if (!active) {
      return;
    }

    if (status === "SUBSCRIBED") {
      retryCount = 0;
      setSnapshot({
        ...snapshot,
        connectionStatus: "connected",
      });
      nextChannel
        .track({
          user_id: currentUserId || undefined,
          online_at: new Date().toISOString(),
        })
        .catch((error) => console.error("Track presence error:", error))
        .finally(() => {
          syncPresence();
          void persistLastOnline(true);
          startHeartbeat();
        });
      return;
    }

    if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
      setSnapshot({
        ...snapshot,
        connectionStatus: "error",
      });
      stopHeartbeat();
      cleanupChannel();
      scheduleReconnect();
    }
  });
}

export function startOnlinePresence(userId: string) {
  const normalizedUserId = normalizeId(userId);
  if (!normalizedUserId) {
    return;
  }

  if (active && currentUserId === normalizedUserId && channel) {
    return;
  }

  active = true;
  currentUserId = normalizedUserId;
  void connect();
}

export function stopOnlinePresence() {
  void persistLastOnline(true);

  active = false;
  currentUserId = null;
  retryCount = 0;
  lastPersistAt = 0;

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  stopHeartbeat();
  cleanupChannel();

  setSnapshot({
    connectionStatus: "idle",
    onlineUserIds: new Set(),
    lastSeenByUserId: {},
  });
}

export function subscribeOnlinePresence(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getOnlinePresenceSnapshot(): PresenceSnapshot {
  return snapshot;
}
