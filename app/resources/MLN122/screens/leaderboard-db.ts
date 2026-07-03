"use client";

import { supabase } from "@/lib/supabase";

export type Mln122LeaderboardEntry = {
  userId: string;
  displayName: string;
  score: number;
  totalQuestions: number;
  durationMs: number;
  submittedAt: string;
};

type Mln122LeaderboardRow = {
  user_id: string;
  display_name: string;
  score: number;
  total_questions: number;
  duration_ms: number;
  submitted_at: string;
};

export type SaveMln122LeaderboardInput = {
  userId: string;
  displayName: string;
  score: number;
  totalQuestions: number;
  durationMs: number;
};

const LEADERBOARD_LIMIT = 20;

export async function fetchMln122Leaderboard(limit = LEADERBOARD_LIMIT) {
  const { data, error } = await supabase
    .from("mln122_quiz_leaderboard")
    .select("user_id, display_name, score, total_questions, duration_ms, submitted_at")
    .order("score", { ascending: false })
    .order("duration_ms", { ascending: true })
    .order("submitted_at", { ascending: true })
    .limit(limit);

  if (error) throw error;

  return sortMln122Leaderboard((data ?? []).map(mapLeaderboardRow));
}

export async function saveMln122LeaderboardEntry({
  userId,
  displayName,
  score,
  totalQuestions,
  durationMs,
}: SaveMln122LeaderboardInput) {
  const { error } = await supabase.from("mln122_quiz_leaderboard").upsert(
    {
      user_id: userId,
      display_name: displayName,
      score,
      total_questions: totalQuestions,
      duration_ms: durationMs,
      submitted_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) throw error;
}

export async function resetMln122LeaderboardEntry(userId: string) {
  const { error } = await supabase
    .from("mln122_quiz_leaderboard")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
}

export function sortMln122Leaderboard(entries: Mln122LeaderboardEntry[]) {
  return [...entries].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.durationMs !== b.durationMs) return a.durationMs - b.durationMs;
    return (
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );
  });
}

export function formatQuizDuration(durationMs: number) {
  const safeDuration = Math.max(0, durationMs);
  const totalSeconds = Math.max(1, Math.round(safeDuration / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) return `${seconds}s`;

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function mapLeaderboardRow(row: Mln122LeaderboardRow): Mln122LeaderboardEntry {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    score: row.score,
    totalQuestions: row.total_questions,
    durationMs: row.duration_ms,
    submittedAt: row.submitted_at,
  };
}
