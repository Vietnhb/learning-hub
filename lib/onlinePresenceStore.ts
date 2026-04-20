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

type PresenceChannel = ReturnType<typeof supabase.channel>;

let channel: PresenceChannel | null = null;
let active = false;
let currentUserId: string | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let retryCount = 0;
let lastPersistAt = 0;
let canUseRpcPersist: boolean | null = null;

const PRESENCE_HEARTBEAT_MS = 30_000;
const PRESENCE_STALE_AFTER_MS = 120_000;
const LAST_ONLINE_PERSIST_MIN_INTERVAL_MS = 50_000;

function emit() {
  listeners.forEach((listener) => listener());
}

function normalizeId(value?: string | null): string {
  return (value || "").trim().toLowerCase();
}

function toEpochMs(iso?: string): number | null {
  if (!iso) {
    return null;
  }

  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : null;
}

function maxIso(a?: string, b?: string): string | undefined {
  const aMs = toEpochMs(a);
  const bMs = toEpochMs(b);
  if (aMs === null) return b;
  if (bMs === null) return a;
  return aMs >= bMs ? a : b;
}

function isPresenceFresh(onlineAt?: string, nowMs = Date.now()): boolean {
  const onlineAtMs = toEpochMs(onlineAt);
  if (onlineAtMs === null) {
    return true;
  }
  return nowMs - onlineAtMs <= PRESENCE_STALE_AFTER_MS;
}

function isMissingRpcFunction(error: { code?: string; message?: string } | null): boolean {
  if (!error) {
    return false;
  }

  const code = (error.code || "").toLowerCase();
  const message = (error.message || "").toLowerCase();
  if (code === "pgrst202" || code === "42883") {
    return true;
  }

  return (
    message.includes("update_my_last_online") &&
    (message.includes("not found") || message.includes("schema cache"))
  );
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
  const nowMs = Date.now();

  for (const [key, metas] of Object.entries(state)) {
    const normalizedKey = normalizeId(key);
    for (const meta of metas) {
      const userId = normalizeId(meta.user_id) || normalizedKey;
      if (!userId) {
        continue;
      }

      if (!isPresenceFresh(meta.online_at, nowMs)) {
        continue;
      }

      next.add(userId);
    }

    if (metas.length === 0 && normalizedKey) {
      next.add(normalizedKey);
    }
  }

  return next;
}

function buildOnlineMeta(state: Record<string, PresenceMeta[]>): Record<string, string> {
  const next: Record<string, string> = {};

  for (const [key, metas] of Object.entries(state)) {
    const normalizedKey = normalizeId(key);
    for (const meta of metas) {
      const userId = normalizeId(meta.user_id) || normalizedKey;
      if (!userId || !meta.online_at || toEpochMs(meta.online_at) === null) {
        continue;
      }

      next[userId] = maxIso(next[userId], meta.online_at) || meta.online_at;
    }
  }

  return next;
}

function cleanupChannel(target: PresenceChannel | null = channel) {
  if (!target) {
    return;
  }

  if (channel === target) {
    channel = null;
  }

  target.untrack().catch(() => {});
  void supabase.removeChannel(target);
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
    void refreshPresence();
    void persistLastOnline();
  }, PRESENCE_HEARTBEAT_MS);
}

async function refreshPresence() {
  if (!active || !channel || !currentUserId) {
    return;
  }

  const status = await channel.track({
    user_id: currentUserId,
    online_at: new Date().toISOString(),
  });

  if (status !== "ok") {
    console.error("Track presence error:", status);
  }
}

async function persistLastOnline(force = false) {
  if (!currentUserId) {
    return;
  }

  const now = Date.now();
  if (!force && now - lastPersistAt < LAST_ONLINE_PERSIST_MIN_INTERVAL_MS) {
    return;
  }

  lastPersistAt = now;
  if (canUseRpcPersist !== false) {
    const { error: rpcError } = await supabase.rpc("update_my_last_online");
    if (!rpcError) {
      canUseRpcPersist = true;
      return;
    }

    if (isMissingRpcFunction(rpcError)) {
      canUseRpcPersist = false;
    } else {
      console.error("Persist last_online_at via RPC error:", rpcError);
      return;
    }
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ last_online_at: new Date().toISOString() })
    .eq("id", currentUserId);

  if (updateError) {
    console.error("Persist last_online_at error:", updateError);
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

function syncPresence(source: PresenceChannel | null = channel) {
  if (!source || source !== channel) {
    return;
  }

  const state = source.presenceState<PresenceMeta>();
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

function markConnectionError() {
  const now = new Date().toISOString();
  const nextLastSeen = { ...snapshot.lastSeenByUserId };
  for (const id of Array.from(snapshot.onlineUserIds)) {
    nextLastSeen[id] = maxIso(nextLastSeen[id], now) || now;
  }

  setSnapshot({
    connectionStatus: "error",
    onlineUserIds: new Set(),
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

  const nextChannel: PresenceChannel = supabase.channel(USERS_ONLINE_PRESENCE_CHANNEL, {
    config: {
      presence: {
        key: currentUserId,
      },
    },
  });
  channel = nextChannel;

  nextChannel.on("presence", { event: "sync" }, () => syncPresence(nextChannel));
  nextChannel.on("presence", { event: "join" }, () => syncPresence(nextChannel));
  nextChannel.on("presence", { event: "leave" }, () => syncPresence(nextChannel));

  nextChannel.subscribe((status) => {
    if (!active) {
      return;
    }

    // Ignore status events from channels that are no longer current.
    if (channel !== nextChannel) {
      return;
    }

    if (status === "SUBSCRIBED") {
      retryCount = 0;
      setSnapshot({
        ...snapshot,
        connectionStatus: "connected",
      });
      void refreshPresence().finally(() => {
        syncPresence(nextChannel);
        void persistLastOnline(true);
        startHeartbeat();
      });
      return;
    }

    if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
      markConnectionError();
      stopHeartbeat();
      cleanupChannel(nextChannel);
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
