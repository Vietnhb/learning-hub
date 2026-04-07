"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getResourceFavoriteCounts } from "@/lib/resourceFavoriteService";

export function useResourceFavoriteCounts(resourceIds: string[]) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const stableIds = useMemo(
    () => Array.from(new Set(resourceIds.filter(Boolean))).sort(),
    [resourceIds],
  );

  const fetchCounts = useCallback(async () => {
    if (stableIds.length === 0) {
      setCounts({});
      return;
    }

    const { data } = await getResourceFavoriteCounts(stableIds);
    setCounts(data || {});
  }, [stableIds]);

  useEffect(() => {
    void fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    const channel = supabase
      .channel("resource_favorites:counts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "resource_favorites" },
        () => {
          void fetchCounts();
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchCounts]);

  return { counts, refetch: fetchCounts };
}

