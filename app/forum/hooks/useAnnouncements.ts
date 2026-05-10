import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { AnnouncementRow } from "../types";

const fallbackAnnouncements: AnnouncementRow[] = [
  {
    id: "fallback-announcement-1",
    title: "Forum community đã sẵn sàng",
    content:
      "Bạn có thể chat nhanh, đăng bài dài hơn và theo dõi hoạt động mới nhất trong một không gian chung.",
    author_name: "Learning Hub",
    created_at: new Date().toISOString(),
  },
];

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>(
    fallbackAnnouncements,
  );

  const loadAnnouncements = useCallback(async () => {
    const { data, error: announcementError } = await supabase
      .from("community_announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(2);

    if (!announcementError && data?.length) {
      setAnnouncements(data as AnnouncementRow[]);
    }
  }, []);

  useEffect(() => {
    void loadAnnouncements();
  }, []);

  return { announcements, setAnnouncements, loadAnnouncements };
}
