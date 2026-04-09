import { supabase } from "./supabase";
import {
  UserWithRole,
  Feedback,
  FeedbackWithUser,
  CreateFeedbackData,
  UpdateFeedbackData,
  FeedbackStatus,
} from "@/types";

type UserLite = {
  id: string;
  full_name: string;
  email: string;
};

async function getUsersMapByIds(userIds: string[]): Promise<Map<string, UserLite>> {
  const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));
  if (uniqueIds.length === 0) {
    return new Map();
  }

  const { data, error } = await getAllUsers();
  if (error || !data) {
    if (error) {
      console.error("Get all users for feedback mapping error:", error);
    }
    return new Map();
  }

  const idSet = new Set(uniqueIds);
  const users = data
    .filter((u) => idSet.has(u.id))
    .map((u) => ({
      id: u.id,
      full_name: u.full_name || "Người dùng",
      email: u.email || "N/A",
    }));

  return new Map(users.map((u) => [u.id, u]));
}

/**
 * Get all users (Admin only)
 */
export async function getAllUsers(): Promise<{
  data: UserWithRole[] | null;
  error: string | null;
}> {
  try {
    const { data: v2Data, error: v2Error } = await supabase.rpc(
      "get_all_users_v2",
    );

    if (!v2Error) {
      return { data: v2Data, error: null };
    }

    const { data, error } = await supabase.rpc("get_all_users");

    if (error) {
      console.error("Get all users error:", {
        v2Error,
        v1Error: error,
      });
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
 * Update user profile fields (Admin only)
 */
export async function adminUpdateUserProfile(
  userId: string,
  fullName: string,
  dateOfBirth: string | null,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.rpc("admin_update_user_profile", {
      target_user_id: userId,
      new_full_name: fullName,
      new_date_of_birth: dateOfBirth,
    });

    if (error) {
      console.error("Admin update user profile error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Admin update user profile exception:", err);
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
 * Ban or unban user (Admin only)
 */
export async function setUserBanStatus(
  userId: string,
  banned: boolean,
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.rpc("admin_set_user_ban_status", {
      target_user_id: userId,
      ban_status: banned,
    });

    if (error) {
      console.error("Set user ban status error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Set user ban status exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get all feedback (Admin only)
 */
/**
 * Get all feedback (Admin only)
 */
export async function getAllFeedback(): Promise<{
  data: FeedbackWithUser[] | null;
  error: string | null;
}> {
  try {
    // First get all feedback
    const { data: feedbackData, error: feedbackError } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (feedbackError) {
      console.error("Get all feedback error:", feedbackError);
      return { data: null, error: feedbackError.message };
    }

    if (!feedbackData || feedbackData.length === 0) {
      return { data: [], error: null };
    }

    // Get unique user IDs
    const userIds = Array.from(
      new Set([
        ...feedbackData.map((f) => f.user_id),
        ...feedbackData.map((f) => f.admin_id).filter(Boolean),
      ]),
    );

    const usersMap = await getUsersMapByIds(userIds as string[]);

    const feedbackWithUser: FeedbackWithUser[] = feedbackData.map((f) => ({
      ...f,
      user: usersMap.get(f.user_id) || {
        id: f.user_id,
        full_name: "Người dùng",
        email: `ID: ${f.user_id.slice(0, 8)}...`,
      },
      admin: f.admin_id
        ? (() => {
            const admin = usersMap.get(f.admin_id);
            return admin
              ? { id: admin.id, full_name: admin.full_name }
              : undefined;
          })()
        : undefined,
    }));

    return { data: feedbackWithUser, error: null };
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
/**
 * Get feedback by status (Admin only)
 */
export async function getFeedbackByStatus(status: FeedbackStatus): Promise<{
  data: FeedbackWithUser[] | null;
  error: string | null;
}> {
  try {
    // First get feedback by status
    const { data: feedbackData, error: feedbackError } = await supabase
      .from("feedback")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (feedbackError) {
      console.error("Get feedback by status error:", feedbackError);
      return { data: null, error: feedbackError.message };
    }

    if (!feedbackData || feedbackData.length === 0) {
      return { data: [], error: null };
    }

    // Get unique user IDs
    const userIds = Array.from(
      new Set([
        ...feedbackData.map((f) => f.user_id),
        ...feedbackData.map((f) => f.admin_id).filter(Boolean),
      ]),
    );

    const usersMap = await getUsersMapByIds(userIds as string[]);

    const feedbackWithUser: FeedbackWithUser[] = feedbackData.map((f) => ({
      ...f,
      user: usersMap.get(f.user_id) || {
        id: f.user_id,
        full_name: "Người dùng",
        email: `ID: ${f.user_id.slice(0, 8)}...`,
      },
      admin: f.admin_id
        ? (() => {
            const admin = usersMap.get(f.admin_id);
            return admin
              ? { id: admin.id, full_name: admin.full_name }
              : undefined;
          })()
        : undefined,
    }));

    return { data: feedbackWithUser, error: null };
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
