import { supabase } from "./supabase";
import { Feedback, FeedbackWithUser, CreateFeedbackData } from "@/types";

/**
 * Create new feedback
 */
export async function createFeedback(
  data: CreateFeedbackData,
): Promise<{ success: boolean; error: string | null; data?: Feedback }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { data: feedback, error } = await supabase
      .from("feedback")
      .insert({
        user_id: user.id,
        subject: data.subject,
        message: data.message,
        category: data.category || "general",
      })
      .select()
      .single();

    if (error) {
      console.error("Create feedback error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null, data: feedback };
  } catch (err) {
    console.error("Create feedback exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get user's own feedback
 */
export async function getMyFeedback(): Promise<{
  data: Feedback[] | null;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get my feedback error:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Get my feedback exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Get feedback by ID
 */
export async function getFeedbackById(feedbackId: string): Promise<{
  data: FeedbackWithUser | null;
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
      .eq("id", feedbackId)
      .single();

    if (error) {
      console.error("Get feedback by ID error:", error);
      return { data: null, error: error.message };
    }

    return { data: data as FeedbackWithUser, error: null };
  } catch (err) {
    console.error("Get feedback by ID exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
