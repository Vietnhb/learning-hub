import { supabase } from "./supabase";

export async function getMyResourceFavorites(): Promise<{
  data: string[] | null;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from("resource_favorites")
      .select("resource_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Get resource favorites error:", error);
      return { data: null, error: error.message };
    }

    return { data: (data || []).map((item) => item.resource_id), error: null };
  } catch (err) {
    console.error("Get resource favorites exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function addResourceFavorite(resourceId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase.from("resource_favorites").upsert(
      {
        user_id: user.id,
        resource_id: resourceId,
      },
      { onConflict: "user_id,resource_id" },
    );

    if (error) {
      console.error("Add resource favorite error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Add resource favorite exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function removeResourceFavorite(resourceId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase
      .from("resource_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("resource_id", resourceId);

    if (error) {
      console.error("Remove resource favorite error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err) {
    console.error("Remove resource favorite exception:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function getResourceFavoriteCounts(
  resourceIds: string[],
): Promise<{
  data: Record<string, number> | null;
  error: string | null;
}> {
  try {
    const ids = Array.from(new Set(resourceIds.filter(Boolean)));
    if (ids.length === 0) {
      return { data: {}, error: null };
    }

    const { data, error } = await supabase.rpc("get_resource_favorite_counts", {
      resource_ids: ids,
    });

    if (error) {
      console.error("Get resource favorite counts error:", error);
      return { data: null, error: error.message };
    }

    const counts: Record<string, number> = {};
    (data || []).forEach((item: { resource_id: string; favorite_count: number }) => {
      counts[item.resource_id] = item.favorite_count || 0;
    });

    return { data: counts, error: null };
  } catch (err) {
    console.error("Get resource favorite counts exception:", err);
    return {
      data: null,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
