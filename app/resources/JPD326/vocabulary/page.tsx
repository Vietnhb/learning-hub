"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  Shuffle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
import { useAuth } from "@/contexts/AuthContext";
import vocabularyData from "./kotoba.json";

type PosTag =
  | "verb"
  | "noun"
  | "adjective"
  | "adverb"
  | "adnominal"
  | "conjunction"
  | "other";

type TransitivityTag =
  | "transitive"
  | "intransitive"
  | "both"
  | "unknown"
  | null;

type TransitivityFilter =
  | "all"
  | "transitive"
  | "intransitive"
  | "both"
  | "unknown";

interface VocabItem {
  id: string;
  slot: number;
  lesson: string;
  slotOrder: number;
  term: string;
  reading: string | null;
  definition: string;
  pos: PosTag;
  transitivity: TransitivityTag;
  image: string | null;
}

const data = vocabularyData as VocabItem[];

function shuffleArray<T>(arr: T[]): T[] {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function posLabel(pos: PosTag): string {
  switch (pos) {
    case "verb":
      return "Động từ";
    case "noun":
      return "Danh từ";
    case "adjective":
      return "Tính từ";
    case "adverb":
      return "Phó từ";
    case "adnominal":
      return "Liên thể từ";
    case "conjunction":
      return "Liên từ";
    default:
      return "Khác";
  }
}

function transitivityLabel(tag: TransitivityTag): string | null {
  switch (tag) {
    case "transitive":
      return "他動詞 (tha động từ)";
    case "intransitive":
      return "自動詞 (tự động từ)";
    case "both":
      return "自・他動詞 (cả hai)";
    case "unknown":
      return "Động từ (chưa phân loại)";
    default:
      return null;
  }
}

function transitivityClass(tag: TransitivityTag): string {
  switch (tag) {
    case "transitive":
      return "bg-rose-100 text-rose-700 border-rose-300";
    case "intransitive":
      return "bg-emerald-100 text-emerald-700 border-emerald-300";
    case "both":
      return "bg-violet-100 text-violet-700 border-violet-300";
    case "unknown":
      return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600";
    default:
      return "";
  }
}

export default function JPD326VocabularyPage() {
  const { user, loading } = useAuth();
  const groupedListRef = useRef<HTMLDivElement | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<number | "all">("all");
  const [selectedLesson, setSelectedLesson] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState<PosTag | "all">("all");
  const [transFilter, setTransFilter] = useState<TransitivityFilter>("all");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReadingBlurred, setIsReadingBlurred] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [deck, setDeck] = useState<VocabItem[]>([]);

  const lessons = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.lesson))).sort((a, b) =>
      a.localeCompare(b, "vi", { numeric: true }),
    );
  }, []);

  const slots = useMemo(() => {
    if (selectedLesson === "all") return [];

    const base =
      data.filter((item) => item.lesson === selectedLesson);

    return Array.from(new Set(base.map((item) => item.slot))).sort((a, b) => a - b);
  }, [selectedLesson]);

  useEffect(() => {
    setSelectedSlot("all");
  }, [selectedLesson]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return data
      .filter((item) =>
        selectedLesson === "all" ? true : item.lesson === selectedLesson,
      )
      .filter((item) =>
        selectedSlot === "all" ? true : item.slot === selectedSlot,
      )
      .filter((item) => (posFilter === "all" ? true : item.pos === posFilter))
      .filter((item) =>
        transFilter === "all" ? true : item.transitivity === transFilter,
      )
      .filter((item) => {
        if (!q) return true;
        return (
          item.term.toLowerCase().includes(q) ||
          (item.reading ?? "").toLowerCase().includes(q) ||
          item.definition.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const lessonCompare = a.lesson.localeCompare(b.lesson, "vi", {
          numeric: true,
        });
        if (lessonCompare !== 0) return lessonCompare;
        if (a.slot !== b.slot) return a.slot - b.slot;
        const aOrder =
          a.slotOrder === 0 ? Number.MAX_SAFE_INTEGER : a.slotOrder;
        const bOrder =
          b.slotOrder === 0 ? Number.MAX_SAFE_INTEGER : b.slotOrder;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.id.localeCompare(b.id);
      });
  }, [selectedSlot, selectedLesson, posFilter, transFilter, search]);

  useEffect(() => {
    setDeck(isShuffled ? shuffleArray(filtered) : filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filtered, isShuffled]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!isFlipped && deck[currentIndex]?.reading) {
          setIsReadingBlurred((prev) => !prev);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) =>
          Math.min(prev + 1, Math.max(deck.length - 1, 0)),
        );
        setIsFlipped(false);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
        setIsFlipped(false);
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deck, currentIndex, isFlipped]);

  useEffect(() => {
    if (groupedListRef.current) {
      groupedListRef.current.scrollTop = 0;
    }
  }, [selectedSlot, selectedLesson, search, posFilter, transFilter]);

  const current = deck[currentIndex] ?? null;
  const progress =
    deck.length > 0 ? ((currentIndex + 1) / deck.length) * 100 : 0;

  const grouped = useMemo(() => {
    type GroupBucket = {
      title: string;
      items: VocabItem[];
      slot: number;
      lesson: string;
      slotOrder: number;
    };

    const map = new Map<string, GroupBucket>();

    for (const item of deck) {
      const key = `${item.slot}|||${item.lesson}`;
      const existing = map.get(key);

      if (!existing) {
        map.set(key, {
          title: `${item.lesson} - Slot ${item.slot}`,
          items: [item],
          slot: item.slot,
          lesson: item.lesson,
          slotOrder: item.slotOrder,
        });
        continue;
      }

      existing.items.push(item);
      if (item.slotOrder < existing.slotOrder) {
        existing.slotOrder = item.slotOrder;
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      const lessonCompare = a.lesson.localeCompare(b.lesson, "vi", {
        numeric: true,
      });
      if (lessonCompare !== 0) return lessonCompare;

      if (a.slot !== b.slot) return a.slot - b.slot;

      const aIsExtra = a.slotOrder === 0;
      const bIsExtra = b.slotOrder === 0;
      if (aIsExtra !== bIsExtra) return aIsExtra ? 1 : -1;

      if (a.slotOrder !== b.slotOrder) return a.slotOrder - b.slotOrder;

      return 0;
    });
  }, [deck]);

  if (loading) {
    return (
      <div className="min-h-screen bg-japan-cream dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-japan-indigo mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  return (
    <div className="min-h-screen bg-japan-cream dark:bg-gray-900 bg-seigaiha py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link href="/resources/JPD326">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại JPD326
            </Button>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedSlot("all");
                setSelectedLesson("all");
                setSearch("");
                setPosFilter("all");
                setTransFilter("all");
                setIsShuffled(false);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              title="Reset bộ lọc"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant={isShuffled ? "default" : "outline"}
              size="icon"
              onClick={() => setIsShuffled((prev) => !prev)}
              title="Xáo trộn"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className="p-5 bg-white/95 dark:bg-gray-800/95">
          <h1 className="text-2xl md:text-3xl font-bold text-japan-indigo dark:text-indigo-300 mb-4">
            語彙 JPD326
          </h1>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">Chọn Bài</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLesson("all")}
                  className={`px-3 py-1.5 rounded-full border text-sm ${
                    selectedLesson === "all"
                      ? "bg-japan-red text-white border-japan-red"
                      : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  }`}
                >
                  Tất cả bài
                </button>
                {lessons.map((lesson) => (
                  <button
                    key={lesson}
                    type="button"
                    onClick={() => setSelectedLesson(lesson)}
                    className={`px-3 py-1.5 rounded-full border text-sm ${
                      selectedLesson === lesson
                        ? "bg-japan-red text-white border-japan-red"
                        : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    }`}
                  >
                    {lesson}
                  </button>
                ))}
              </div>
            </div>
            {selectedLesson !== "all" && (
              <div>
                <p className="text-sm font-semibold mb-2">Chọn Slot</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot("all")}
                    className={`px-3 py-1.5 rounded-full border text-sm ${
                      selectedSlot === "all"
                        ? "bg-japan-indigo text-white border-japan-indigo"
                        : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    }`}
                  >
                    Tất cả slot
                  </button>
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-1.5 rounded-full border text-sm ${
                        selectedSlot === slot
                          ? "bg-japan-indigo text-white border-japan-indigo"
                          : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      }`}
                    >
                      Slot {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm theo từ Nhật / cách đọc / nghĩa Việt..."
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              </div>

              <select
                value={posFilter}
                onChange={(e) => setPosFilter(e.target.value as PosTag | "all")}
                aria-label="Lọc theo từ loại"
                title="Lọc theo từ loại"
                className="h-10 rounded-md border border-gray-300 bg-white px-3 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="all">Tất cả từ loại</option>
                <option value="verb">Động từ</option>
                <option value="noun">Danh từ</option>
                <option value="adjective">Tính từ</option>
                <option value="adverb">Phó từ</option>
                <option value="adnominal">Liên thể từ</option>
                <option value="conjunction">Liên từ</option>
                <option value="other">Khác</option>
              </select>

              <select
                value={transFilter}
                onChange={(e) =>
                  setTransFilter(
                    e.target.value === "all"
                      ? "all"
                      : (e.target.value as TransitivityFilter),
                  )
                }
                aria-label="Lọc theo loại động từ"
                title="Lọc theo loại động từ"
                className="h-10 rounded-md border border-gray-300 bg-white px-3 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="all">Tất cả</option>
                <option value="transitive">他動詞 (tha động từ)</option>
                <option value="intransitive">自動詞 (tự động từ)</option>
                <option value="both">自・他動詞</option>
                <option value="unknown">Động từ chưa phân loại</option>
              </select>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white/95 dark:bg-gray-800/95">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Số từ đang học
            </p>
            <p className="text-3xl font-bold text-japan-indigo dark:text-indigo-300">
              {deck.length}
            </p>
          </Card>
          <Card className="p-4 bg-white/95 dark:bg-gray-800/95">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Vị trí hiện tại
            </p>
            <p className="text-3xl font-bold text-japan-red">
              {deck.length > 0 ? `${currentIndex + 1}/${deck.length}` : "0/0"}
            </p>
          </Card>
          <Card className="p-4 bg-white/95 dark:bg-gray-800/95">
            <p className="text-sm text-gray-500 dark:text-gray-300">Ghi chú</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-100">
              Bấm Space để ẩn/hiện reading, mũi tên trái/phải để chuyển từ.
            </p>
          </Card>
        </div>

        <Card className="p-4 bg-white/95 dark:bg-gray-800/95">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-japan-indigo to-japan-red transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {!current ? (
            <div className="py-10 text-center text-gray-600 dark:text-gray-300">
              Không có dữ liệu phù hợp bộ lọc hiện tại.
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                className="w-full text-left"
              >
                <Card className="p-6 min-h-[260px] border-2 border-indigo-200 bg-white hover:shadow-md transition dark:bg-gray-900 dark:border-indigo-700">
                  {!isFlipped ? (
                    <div className="flex gap-6 h-full">
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap text-xs mb-4">
                          <span className="px-2 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                            Slot {current.slot}
                          </span>
                          <span className="px-2 py-1 rounded-full border bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
                            {current.lesson}
                          </span>
                          <span className="px-2 py-1 rounded-full border bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                            {posLabel(current.pos)}
                          </span>
                          {current.transitivity && (
                            <span
                              className={`px-2 py-1 rounded-full border ${transitivityClass(current.transitivity)}`}
                            >
                              {transitivityLabel(current.transitivity)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
                            {current.term}
                          </p>
                          {current.reading && (
                            <p
                              className={`mt-2 text-xl md:text-2xl text-gray-600 dark:text-gray-300 transition ${
                                isReadingBlurred
                                  ? "blur-sm select-none"
                                  : "blur-none"
                              }`}
                            >
                              {current.reading}
                            </p>
                          )}
                        </div>
                      </div>

                      {current.image && (
                        <div className="flex items-center justify-end">
                          <img
                            src={current.image}
                            alt={current.term}
                            className="max-h-[200px] max-w-[200px] object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-6 h-full">
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap text-xs mb-4">
                          <span className="px-2 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                            Slot {current.slot}
                          </span>
                          <span className="px-2 py-1 rounded-full border bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800">
                            {current.lesson}
                          </span>
                          {current.transitivity && (
                            <span
                              className={`px-2 py-1 rounded-full border ${transitivityClass(current.transitivity)}`}
                            >
                              {transitivityLabel(current.transitivity)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-3xl md:text-4xl font-semibold text-emerald-700 dark:text-emerald-300">
                            {current.definition}
                          </p>
                        </div>
                      </div>

                      {current.image && (
                        <div className="flex items-center justify-end">
                          <img
                            src={current.image}
                            alt={current.term}
                            className="max-h-[200px] max-w-[200px] object-contain rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </button>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentIndex((prev) => Math.max(prev - 1, 0));
                    setIsFlipped(false);
                  }}
                  disabled={currentIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trước
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsFlipped((prev) => !prev)}
                >
                  Lật thẻ
                </Button>
                <a
                  href={`https://mazii.net/vi-VN/search/kanji/javi/${encodeURIComponent(current.term)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">Giải nghĩa</Button>
                </a>
                <Button
                  variant={isReadingBlurred ? "outline" : "default"}
                  onClick={() => setIsReadingBlurred((prev) => !prev)}
                  disabled={!current?.reading}
                >
                  {isReadingBlurred ? "Mở reading" : "Làm mờ reading"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentIndex((prev) =>
                      Math.min(prev + 1, Math.max(deck.length - 1, 0)),
                    );
                    setIsFlipped(false);
                  }}
                  disabled={currentIndex >= deck.length - 1}
                  className="gap-2"
                >
                  Sau
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-5 bg-white/95 dark:bg-gray-800/95">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Danh sách theo Bài/Slot
          </h2>
          <div
            ref={groupedListRef}
            className="space-y-4 max-h-[520px] overflow-auto pr-2"
          >
            {grouped.map((group) => (
              <div
                key={group.title}
                className="border rounded-lg overflow-hidden dark:border-gray-700"
              >
                <div className="px-3 py-2 bg-indigo-50 border-b text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
                  {group.title}
                </div>
                <div className="divide-y dark:divide-gray-700">
                  {group.items.map((item) => {
                    const idx = deck.findIndex((x) => x.id === item.id);
                    const active = idx === currentIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (idx >= 0) {
                            setCurrentIndex(idx);
                            setIsFlipped(false);
                          }
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition ${
                          active
                            ? "bg-rose-100 dark:bg-rose-900/40"
                            : "bg-white dark:bg-gray-900"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-bold text-xl md:text-2xl leading-tight truncate text-gray-900 dark:text-gray-100">
                              {item.term}
                            </p>
                            {item.reading && (
                              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                {item.reading}
                              </p>
                            )}
                            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 truncate mt-1">
                              {item.definition}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap justify-end">
                            <span className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
                              {posLabel(item.pos)}
                            </span>
                            {item.transitivity && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full border ${transitivityClass(item.transitivity)}`}
                              >
                                {transitivityLabel(item.transitivity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
