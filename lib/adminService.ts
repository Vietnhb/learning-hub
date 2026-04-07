import { supabase } from "./supabase";
import {
  UserWithRole,
  Feedback,
  FeedbackWithUser,
  CreateFeedbackData,
  UpdateFeedbackData,
  FeedbackStatus,
} from "@/types";

/**
 * Get all users (Admin only)
 */
export async function getAllUsers(): Promise<{
  data: UserWithRole[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase.rpc("get_all_users");

    if (error) {
      console.error("Get all users error:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Get all users exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Update user role (Admin only)
 */
export async function updateUserRole(
  userId: string,
  roleId: number,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.rpc("admin_update_user_role", {
      target_user_id: userId,
      new_role_id: roleId,
    });

    if (error) {
      console.error("Update user role error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Update user role exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Delete user (Admin only)
 */
export async function deleteUser(
  userId: string,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.rpc("admin_delete_user", {
      target_user_id: userId,
    });

    if (error) {
      console.error("Delete user error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Delete user exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get all feedback (Admin only)
 */
export async function getAllFeedback(): Promise<{
  data: FeedbackWithUser[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select(
        `
        *,
        user:users!feedback_user_id_fkey (
          id,
          full_name,
          email
        ),
        admin:users!feedback_admin_id_fkey (
          id,
          full_name
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get all feedback error:", error);
      return { data: null, error: error.message };
    }

    return { data: data as FeedbackWithUser[], error: null };
  } catch (err) {
    console.error("Get all feedback exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get feedback by status (Admin only)
 */
export async function getFeedbackByStatus(status: FeedbackStatus): Promise<{
  data: FeedbackWithUser[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select(
        `
        *,
        user:users!feedback_user_id_fkey (
          id,
          full_name,
          email
        ),
        admin:users!feedback_admin_id_fkey (
          id,
          full_name
        )
      `,
      )
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get feedback by status error:", error);
      return { data: null, error: error.message };
    }

    return { data: data as FeedbackWithUser[], error: null };
  } catch (err) {
    console.error("Get feedback by status exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Update feedback (Admin only)
 */
export async function updateFeedback(
  feedbackId: string,
  updates: UpdateFeedbackData,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("feedback")
      .update(updates)
      .eq("id", feedbackId);

    if (error) {
      console.error("Update feedback error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Update feedback exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get pending feedback count (Admin only)
 */
export async function getPendingFeedbackCount(): Promise<{
  count: number;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase.rpc("get_pending_feedback_count");

    if (error) {
      console.error("Get pending feedback count error:", error);
      return { count: 0, error: error.message };
    }

    return { count: data || 0, error: null };
  } catch (err) {
    console.error("Get pending feedback count exception:", err);
    return {
      count: 0,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
