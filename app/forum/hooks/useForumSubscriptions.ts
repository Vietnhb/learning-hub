import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ChatMessageRow } from "../types";

export function useForumSubscriptions(
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessageRow[]>>,
  loadFeed: (showLoading?: boolean) => Promise<void>,
  loadAnnouncements: () => Promise<void>,
  loadChat: (showLoading?: boolean) => Promise<void>
) {
  useEffect(() => {
    const channel = supabase
      .channel("community-hub-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_messages" },
        (payload) => {
          setChatMessages((current) => {
            const newMessage = payload.new as ChatMessageRow;
            if (current.some((m) => m.id === newMessage.id)) return current;
            return [...current, newMessage].slice(-80);
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => void loadFeed(false), // Pass false to not show loading spinner when updating!
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comments" },
        () => void loadFeed(false),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () => void loadFeed(false),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_announcements" },
        () => void loadAnnouncements(),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [setChatMessages, loadChat, loadFeed, loadAnnouncements]);
}
