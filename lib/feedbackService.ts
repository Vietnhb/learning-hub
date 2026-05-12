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

    const { data: fallbackAdmin } = await supabase
      .from("users")
      .select("id")
      .eq("role_id", 1)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const { data: feedback, error } = await supabase
      .from("feedback")
      .insert({
        user_id: user.id,
        admin_id: fallbackAdmin?.id || null,
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
