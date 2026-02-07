import { supabase } from "./supabase";
import { User, UpdateUserData } from "@/types/user";

/**
 * Lấy thông tin user từ bảng users
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Get user profile error:", error);
    return null;
  }

  return data;
}

/**
 * Cập nhật thông tin user
 * Chỉ cho phép update: full_name, date_of_birth
 * RLS sẽ đảm bảo user chỉ update chính họ
 */
export async function updateUserProfile(
  userId: string,
  data: UpdateUserData,
): Promise<{ success: boolean; error?: string }> {
  // Chỉ cho phép update các field được phép
  const allowedFields: UpdateUserData = {};
  if (data.full_name !== undefined) allowedFields.full_name = data.full_name;
  if (data.date_of_birth !== undefined)
    allowedFields.date_of_birth = data.date_of_birth;

  const { error } = await supabase
    .from("users")
    .update(allowedFields)
    .eq("id", userId);

  if (error) {
    console.error("Update user profile error:", error);
    return {
      success: false,
      error: error.message || "Cập nhật thông tin thất bại",
    };
  }

  return { success: true };
}

/**
 * Kiểm tra xem user đã hoàn thành profile chưa
 */
export async function isProfileComplete(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  if (!profile) return false;

  return !!(
    profile.full_name &&
    profile.full_name.trim() !== "" &&
    profile.date_of_birth
  );
}

/**
 * Hoàn thiện thông tin profile lần đầu (sau khi verify email)
 */
export async function completeUserProfile(
  userId: string,
  data: { full_name: string; date_of_birth: string },
): Promise<{ success: boolean; error?: string }> {
  return updateUserProfile(userId, data);
}
