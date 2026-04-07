import { supabase } from "./supabase";
import {
  Conversation,
  ConversationWithDetails,
  Message,
  SendMessageData,
} from "@/types";

async function getFallbackAdminId(excludeUserId?: string): Promise<string | null> {
  try {
    let query = supabase
      .from("users")
      .select("id, roles!inner(name)")
      .eq("roles.name", "admin")
      .order("created_at", { ascending: true })
      .limit(1);

    if (excludeUserId) {
      query = query.neq("id", excludeUserId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Get fallback admin error:", error);
      return null;
    }

    return (data as { id: string } | null)?.id || null;
  } catch (err) {
    console.error("Get fallback admin exception:", err);
    return null;
  }
}

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

    const fallbackAdminId = await getFallbackAdminId(user.id);

    // Try to get existing conversation
    const { data: existing, error: fetchError } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Get existing conversation error:", fetchError);
      return { data: null, error: fetchError.message };
    }

    if (existing) {
      if (!existing.admin_id && fallbackAdminId) {
        const { data: updatedConv } = await supabase
          .from("conversations")
          .update({ admin_id: fallbackAdminId })
          .eq("id", existing.id)
          .select("*")
          .single();

        return { data: updatedConv || existing, error: null };
      }

      return { data: existing, error: null };
    }

    // Create new conversation if doesn't exist
    const { data: newConv, error: createError } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        admin_id: fallbackAdminId || null,
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
 * Ensure conversation has an admin assigned
 */
export async function ensureConversationAdmin(
  conversationId: string,
): Promise<{ adminId: string | null; error: string | null }> {
  try {
    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .select("id, user_id, admin_id")
      .eq("id", conversationId)
      .single();

    if (convError) {
      console.error("Get conversation error:", convError);
      return { adminId: null, error: convError.message };
    }

    if (conv.admin_id) {
      return { adminId: conv.admin_id, error: null };
    }

    const fallbackAdminId = await getFallbackAdminId(conv.user_id);
    if (!fallbackAdminId) {
      return { adminId: null, error: "No admin available" };
    }

    const { data: updated, error: updateError } = await supabase
      .from("conversations")
      .update({ admin_id: fallbackAdminId })
      .eq("id", conversationId)
      .select("admin_id")
      .single();

    if (updateError) {
      console.error("Assign admin to conversation error:", updateError);
      return { adminId: null, error: updateError.message };
    }

    return { adminId: updated.admin_id, error: null };
  } catch (err) {
    console.error("Ensure conversation admin exception:", err);
    return {
      adminId: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Assign current admin to conversation (for "Start Chat" action)
 */
export async function assignConversationToCurrentAdmin(
  conversationId: string,
): Promise<{ success: boolean; adminId: string | null; error: string | null }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, adminId: null, error: "User not authenticated" };
    }

    const { data: conv, error: convError } = await supabase
      .from("conversations")
      .select("id, admin_id")
      .eq("id", conversationId)
      .single();

    if (convError) {
      console.error("Get conversation for assign error:", convError);
      return { success: false, adminId: null, error: convError.message };
    }

    if (conv.admin_id && conv.admin_id !== user.id) {
      return { success: true, adminId: conv.admin_id, error: null };
    }

    const { data: updated, error: updateError } = await supabase
      .from("conversations")
      .update({ admin_id: user.id })
      .eq("id", conversationId)
      .select("admin_id")
      .single();

    if (updateError) {
      console.error("Assign conversation to current admin error:", updateError);
      return { success: false, adminId: null, error: updateError.message };
    }

    return { success: true, adminId: updated.admin_id, error: null };
  } catch (err) {
    console.error("Assign conversation to current admin exception:", err);
    return {
      success: false,
      adminId: null,
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
      .select("*")
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Get all conversations error:", error);
      return { data: null, error: error.message };
    }

    if (!data || data.length === 0) {
      return { data: [], error: null };
    }

    const userIds = Array.from(new Set(data.map((conv) => conv.user_id)));
    const { data: usersData, error: usersError } = await supabase.rpc(
      "get_all_users",
    );

    if (usersError) {
      console.error("Get users for conversations error:", usersError);
    }

    const usersMap = new Map(
      ((usersData as { id: string; full_name: string; email: string }[] | null) || [])
        .filter((u) => userIds.includes(u.id))
        .map((u) => [
          u.id,
          {
            id: u.id,
            full_name: u.full_name || "Người dùng",
            email: u.email || "N/A",
          },
        ]),
    );

    // Get unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      (data || []).map(async (conv) => {
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("is_read", false)
          .eq("sender_id", conv.user_id); // Messages from user

        return {
          ...conv,
          user: usersMap.get(conv.user_id) || {
            id: conv.user_id,
            full_name: "Người dùng",
            email: `ID: ${conv.user_id.slice(0, 8)}...`,
          },
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
      .neq("sender_id", user.id)
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
 * Subscribe to all message changes
 */
export function subscribeToMessageChanges(callback: () => void) {
  return supabase
    .channel("messages:all")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      () => {
        callback();
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
