import { supabase } from "./supabase";

export async function uploadAvatarToSupabase(
  userId: string,
  file: File,
): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err: any) {
    console.error("Avatar upload error:", err);
    throw new Error(err.message || "Lỗi khi tải ảnh lên");
  }
}
