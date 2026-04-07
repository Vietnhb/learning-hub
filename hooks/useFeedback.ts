"use client";

import { useState, useEffect } from "react";
import { FeedbackWithUser, FeedbackStatus } from "@/types";
import { getAllFeedback, getFeedbackByStatus } from "@/lib/adminService";

export function useFeedback(status?: FeedbackStatus) {
  const [feedback, setFeedback] = useState<FeedbackWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async () => {
    setLoading(true);

    const { data, error: err } = status
      ? await getFeedbackByStatus(status)
      : await getAllFeedback();

    if (err) {
      setError(err);
      setFeedback([]);
    } else {
      setFeedback(data || []);
      setError(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, [status]);

  return {
    feedback,
    loading,
    error,
    refetch: fetchFeedback,
  };
}
