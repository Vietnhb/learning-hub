"use client";

import { useState, useEffect } from "react";
import { Feedback } from "@/types";
import { getMyFeedback } from "@/lib/feedbackService";

export function useMyFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedback = async () => {
    setLoading(true);

    const { data, error: err } = await getMyFeedback();

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
  }, []);

  return {
    feedback,
    loading,
    error,
    refetch: fetchFeedback,
  };
}
