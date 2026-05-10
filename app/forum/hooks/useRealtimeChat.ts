import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ChatMessageRow } from "../types";

const fallbackChatMessages: ChatMessageRow[] = [
  {
    id: "welcome-chat-1",
    username: "Learning Hub",
    content:
      "Chào mừng mọi người vào lounge chung. Có câu hỏi gì cứ thả vào đây nhé.",
    created_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "welcome-chat-2",
    username: "Community",
    content: "Ai đang ôn NextJS hoặc Supabase thì cùng trao đổi trong hub này.",
    created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
];

export function useRealtimeChat(userId: string | undefined) {
  const [chatMessages, setChatMessages] = useState<ChatMessageRow[]>(fallbackChatMessages);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatNotice, setChatNotice] = useState<string | null>(null);
  const [sendingChat, setSendingChat] = useState(false);

  const loadChat = useCallback(async (showLoading = true) => {
    if (showLoading) setChatLoading(true);
    const { data, error: chatError } = await supabase
      .from("community_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);

    if (chatError) {
      setChatNotice("Chat sẽ hoạt động sau khi tạo bảng community_messages.");
      setChatMessages(fallbackChatMessages);
    } else {
      setChatNotice(null);
      setChatMessages(((data ?? []) as ChatMessageRow[]).reverse());
    }

    if (showLoading) setChatLoading(false);
  }, []);

  useEffect(() => {
    void loadChat();
  }, [userId]);

  return { 
    chatMessages, 
    setChatMessages, 
    chatLoading, 
    chatNotice, 
    setChatNotice,
    sendingChat, 
    setSendingChat,
    loadChat 
  };
}
