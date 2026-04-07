import { supabase } from "./supabase";
import {
  Conversation,
  ConversationWithDetails,
  Message,
  SendMessageData,
} from "@/types";

/**
 * Get or create conversation for current user
 */
export async function getOrCreateConversation(): Promise<{
  data: Conversation | null;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    // Try to get existing conversation
    const { data: existing, error: fetchError } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      return { data: existing, error: null };
    }

    // Create new conversation if doesn't exist
    const { data: newConv, error: createError } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
      })
      .select()
      .single();

    if (createError) {
      console.error("Create conversation error:", createError);
      return { data: null, error: createError.message };
    }

    return { data: newConv, error: null };
  } catch (err) {
    console.error("Get or create conversation exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get all conversations (Admin only)
 */
export async function getAllConversations(): Promise<{
  data: ConversationWithDetails[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        *,
        user:users!conversations_user_id_fkey (
          id,
          full_name,
          email
        )
      `,
      )
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Get all conversations error:", error);
      return { data: null, error: error.message };
    }

    // Get unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      (data || []).map(async (conv) => {
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("is_read", false)
          .not("sender_id", "eq", conv.user_id); // Messages from admin

        return {
          ...conv,
          unread_count: count || 0,
        } as ConversationWithDetails;
      }),
    );

    return { data: conversationsWithUnread, error: null };
  } catch (err) {
    console.error("Get all conversations exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get messages in a conversation
 */
export async function getMessages(conversationId: string): Promise<{
  data: Message[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Get messages error:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Get messages exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Send message
 */
export async function sendMessage(
  messageData: SendMessageData,
): Promise<{ success: boolean; error: string | null; data?: Message }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: messageData.conversation_id,
        sender_id: user.id,
        receiver_id: messageData.receiver_id,
        message: messageData.message,
      })
      .select()
      .single();

    if (error) {
      console.error("Send message error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null, data };
  } catch (err) {
    console.error("Send message exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  conversationId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .eq("receiver_id", user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Mark messages as read error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Mark messages as read exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get unread message count
 */
export async function getUnreadCount(): Promise<{
  count: number;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase.rpc("get_unread_message_count");

    if (error) {
      console.error("Get unread count error:", error);
      return { count: 0, error: error.message };
    }

    return { count: data || 0, error: null };
  } catch (err) {
    console.error("Get unread count exception:", err);
    return {
      count: 0,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Subscribe to new messages in a conversation
 */
export function subscribeToMessages(
  conversationId: string,
  callback: (message: Message) => void,
) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      },
    )
    .subscribe();
}

/**
 * Subscribe to conversation updates
 */
export function subscribeToConversations(
  callback: (conversation: Conversation) => void,
) {
  return supabase
    .channel("conversations")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "conversations",
      },
      (payload) => {
        callback(payload.new as Conversation);
      },
    )
    .subscribe();
}
