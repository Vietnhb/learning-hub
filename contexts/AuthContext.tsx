"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { USERS_ONLINE_PRESENCE_CHANNEL } from "@/lib/realtimeChannels";
import { setRealtimeAuthFromSession } from "@/lib/realtimeAuth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enforceBanStatus = async (nextUser: User | null) => {
      if (!nextUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("is_banned")
        .eq("id", nextUser.id)
        .single();

      if (data?.is_banned) {
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        if (typeof window !== "undefined") {
          window.location.replace("/auth/login?error=banned");
        }
        return;
      }

      setUser(nextUser);
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        void supabase.realtime.setAuth(session.access_token);
      }
      enforceBanStatus(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        void supabase.realtime.setAuth(session.access_token);
      }
      enforceBanStatus(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let active = true;
    let isSubscribed = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const cleanupChannel = () => {
      isSubscribed = false;
      if (!channel) {
        return;
      }

      channel.untrack().catch(() => {});
      void supabase.removeChannel(channel);
      channel = null;
    };

    const trackPresence = async () => {
      if (!isSubscribed || !channel) {
        return;
      }

      try {
        await channel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Track user presence error:", error);
      }
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

      await setRealtimeAuthFromSession();
      cleanupChannel();

      const nextChannel = supabase.channel(USERS_ONLINE_PRESENCE_CHANNEL, {
        config: {
          presence: {
            key: user.id,
          },
        },
      });
      channel = nextChannel;

      nextChannel.subscribe((status) => {
        if (!active) {
          return;
        }

        if (status === "SUBSCRIBED") {
          isSubscribed = true;
          void trackPresence();
          return;
        }

        if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          cleanupChannel();
          scheduleReconnect();
        }
      });
    };

    const handleActivity = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return;
      }
      void trackPresence();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleActivity);
      document.addEventListener("visibilitychange", handleActivity);
    }

    void connect();

    return () => {
      active = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      if (typeof window !== "undefined") {
        window.removeEventListener("focus", handleActivity);
        document.removeEventListener("visibilitychange", handleActivity);
      }

      cleanupChannel();
    };
  }, [user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

