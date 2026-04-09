"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { startOnlinePresence, stopOnlinePresence } from "@/lib/onlinePresenceStore";

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
      stopOnlinePresence();
      return;
    }

    startOnlinePresence(user.id);
  }, [user?.id]);

  const signOut = async () => {
    stopOnlinePresence();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

