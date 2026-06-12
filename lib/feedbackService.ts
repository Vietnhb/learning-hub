import { supabase } from "./supabase";
import { Feedback, CreateFeedbackData } from "@/types";

function getFriendlyFeedbackError(err: unknown): string {
  if (err instanceof Error) {
    const message = err.message.toLowerCase();

    if (
      err instanceof TypeError &&
      (message.includes("fetch") || message.includes("network"))
    ) {
      return "Không thể kết nối máy chủ. Vui lòng kiểm tra mạng rồi thử lại.";
    }

    return err.message;
  }

  return "Unknown error";
}

/**
 * Create new feedback
 */
export async function createFeedback(
  data: CreateFeedbackData,
): Promise<{ success: boolean; error: string | null; data?: Feedback }> {
  try {
    const subject = data.subject.trim();
    const message = data.message.trim();

    if (!subject || !message) {
      return {
        success: false,
        error: "Vui lòng nhập đầy đủ tiêu đề và nội dung.",
      };
    }

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
        admin_id: null,
        subject,
        message,
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
      error: getFriendlyFeedbackError(err),
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
      error: getFriendlyFeedbackError(err),
    };
  }
}
