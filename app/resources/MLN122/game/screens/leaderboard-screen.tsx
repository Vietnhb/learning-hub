"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Clock, Medal, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScreenHeading } from "../ui/components";
import {
  fetchMln122Leaderboard,
  formatQuizDuration,
  type Mln122LeaderboardEntry,
} from "./leaderboard-db";

type LeaderboardStatus = "loading" | "ready" | "error";

export function LeaderboardScreen({
  currentUserId,
  currentScore,
  totalQuestions,
  currentDurationMs,
  refreshKey,
  onRestartQuiz,
}: {
  currentUserId: string;
  currentScore: number;
  totalQuestions: number;
  currentDurationMs: number | null;
  refreshKey: number;
  onRestartQuiz: () => void;
}) {
  const [entries, setEntries] = useState<Mln122LeaderboardEntry[]>([]);
  const [status, setStatus] = useState<LeaderboardStatus>("loading");

  useEffect(() => {
    let active = true;

    setStatus("loading");
    fetchMln122Leaderboard()
      .then((nextEntries) => {
        if (!active) return;
        setEntries(nextEntries);
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Could not load MLN122 leaderboard:", error);
        if (!active) return;
        setEntries([]);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const currentEntry = entries.find((entry) => entry.userId === currentUserId);
  const displayedScore = currentDurationMs !== null
    ? currentScore
    : currentEntry?.score;
  const displayedDurationMs = currentDurationMs ?? currentEntry?.durationMs ?? null;
  const hasCurrentAttempt =
    displayedScore !== undefined && displayedDurationMs !== null;

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <ScreenHeading
          eyebrow="Xếp hạng"
          title="Bảng điểm quiz"
          text="Top 1 thuộc về người có nhiều câu đúng nhất. Nếu cùng số câu đúng, người hoàn thành nhanh hơn sẽ xếp trên."
        />
        <div className="grid min-w-[220px] gap-1 border-4 border-[#0b1209] bg-[#f5cf72] p-3 text-[#2d2114] shadow-[4px_4px_0_#0b1209]">
          <p className="text-[10px] font-black uppercase tracking-wide">
            Lượt hiện tại
          </p>
          <p className="font-mono text-3xl font-black">
            {hasCurrentAttempt ? `${displayedScore}/${totalQuestions}` : "--"}
          </p>
          <p className="font-mono text-sm font-black">
            {hasCurrentAttempt
              ? formatQuizDuration(displayedDurationMs)
              : "Chưa nộp quiz"}
          </p>
        </div>
      </div>

      {currentDurationMs !== null && (
        <div className="grid gap-3 border-4 border-[#0b1209] bg-[#10190d] p-4 text-center shadow-[4px_4px_0_#0b1209] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:text-left">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#f5cf72]">
              Đã nộp bài
            </p>
            <p className="mt-1 text-sm font-bold text-[#fff5cf]/78">
              Bạn có muốn làm lại quiz không?
            </p>
          </div>
          <Button
            type="button"
            onClick={onRestartQuiz}
            className="pixel-button border-2 border-[#0b1209] bg-[#f5cf72] px-6 py-5 font-black text-[#2d2114] hover:bg-[#ffe08c]"
          >
            Làm lại
          </Button>
        </div>
      )}

      {status === "loading" && (
        <LeaderboardNotice text="Đang tải bảng xếp hạng..." />
      )}

      {status === "error" && (
        <LeaderboardNotice text="Chưa đọc được DB bảng xếp hạng. Hãy chạy SQL trong thư mục supabase rồi tải lại trang." />
      )}

      {status === "ready" && entries.length === 0 && (
        <LeaderboardNotice text="Chưa có ai trong bảng xếp hạng. Nộp quiz để ghi lượt đầu tiên." />
      )}

      {status === "ready" && entries.length > 0 && (
        <div className="grid gap-3">
          {entries.map((entry, index) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              rank={index + 1}
              isCurrent={entry.userId === currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LeaderboardRow({
  entry,
  rank,
  isCurrent,
}: {
  entry: Mln122LeaderboardEntry;
  rank: number;
  isCurrent: boolean;
}) {
  const accuracy = Math.round((entry.score / entry.totalQuestions) * 100);

  return (
    <div
      className={`grid gap-3 border-4 p-4 shadow-[4px_4px_0_#0b1209] md:grid-cols-[64px_minmax(0,1fr)_240px] md:items-center ${
        isCurrent
          ? "border-[#f5cf72] bg-[#20361d]"
          : "border-[#0b1209] bg-[#10190d]"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center border-2 border-[#0b1209] font-mono text-xl font-black ${
          rank === 1
            ? "bg-[#f5cf72] text-[#2d2114]"
            : "bg-[#263f22] text-[#fff5cf]"
        }`}
      >
        {rank === 1 ? <Trophy className="h-6 w-6" /> : rank}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-black text-white">
            {entry.displayName}
          </h3>
          {isCurrent && (
            <span className="border-2 border-[#0b1209] bg-[#f5cf72] px-2 py-0.5 text-[10px] font-black uppercase text-[#2d2114]">
              Hiện tại
            </span>
          )}
        </div>
        <p className="mt-1 text-sm font-bold text-[#fff5cf]/70">
          {rank === 1
            ? "Đang dẫn đầu về độ chính xác và tốc độ"
            : "Xếp theo điểm đúng, rồi tới thời gian"}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-1">
        <RankMetric
          icon={<Medal className="h-4 w-4" />}
          label="Điểm"
          value={`${entry.score}/${entry.totalQuestions}`}
        />
        <RankMetric
          icon={<Target className="h-4 w-4" />}
          label="Đúng"
          value={`${accuracy}%`}
        />
        <RankMetric
          icon={<Clock className="h-4 w-4" />}
          label="Thời gian"
          value={formatQuizDuration(entry.durationMs)}
        />
      </div>
    </div>
  );
}

function RankMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-9 items-center justify-between gap-2 border-2 border-[#0b1209] bg-[#263f22] px-2 py-1">
      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-[#f5cf72]">
        {icon}
        {label}
      </span>
      <span className="font-mono text-sm font-black text-white">{value}</span>
    </div>
  );
}

function LeaderboardNotice({ text }: { text: string }) {
  return (
    <div className="border-4 border-[#0b1209] bg-[#10190d] p-5 text-center shadow-[4px_4px_0_#0b1209]">
      <p className="text-sm font-black text-[#fff5cf]/80">{text}</p>
    </div>
  );
}
