import { supabase } from "@/lib/supabase";

export async function setRealtimeAuthFromSession(): Promise<void> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    await supabase.realtime.setAuth(session.access_token);
  }
}
