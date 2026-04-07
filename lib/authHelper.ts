import { supabase } from "./supabase";

/**
 * Check if current user is admin
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
      .from("users")
      .select("role_id, roles(name)")
      .eq("id", user.id)
      .single();

    return data?.roles?.name === "admin";
  } catch (error) {
    console.error("Check admin error:", error);
    return false;
  }
}

/**
 * Get current user with role
 */
export async function getCurrentUserWithRole() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        full_name,
        role_id,
        date_of_birth,
        created_at,
        roles (
          id,
          name,
          description
        )
      `,
      )
      .eq("id", user.id)
      .single();

    return data;
  } catch (error) {
    console.error("Get current user with role error:", error);
    return null;
  }
}
