"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  addResourceFavorite,
  getMyResourceFavorites,
  removeResourceFavorite,
} from "@/lib/resourceFavoriteService";

export function useResourceFavorites(userId?: string) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setFavoriteIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data } = await getMyResourceFavorites();
    setFavoriteIds(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`resource_favorites:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resource_favorites",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void fetchFavorites();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, fetchFavorites]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const toggleFavorite = async (resourceId: string) => {
    const isFavorite = favoriteSet.has(resourceId);
    setFavoriteIds((prev) =>
      isFavorite ? prev.filter((id) => id !== resourceId) : [...prev, resourceId],
    );

    const result = isFavorite
      ? await removeResourceFavorite(resourceId)
      : await addResourceFavorite(resourceId);

    if (!result.success) {
      setFavoriteIds((prev) =>
        isFavorite ? [...prev, resourceId] : prev.filter((id) => id !== resourceId),
      );
    }

    return result;
  };

  return {
    favoriteSet,
    loading,
    toggleFavorite,
    refetch: fetchFavorites,
  };
}

