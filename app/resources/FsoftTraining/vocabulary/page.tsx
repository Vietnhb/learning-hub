"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
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
  unit: number;
  lesson: string;
  lessonOrder: number;
  section: string;
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
      return "Tiếp tục từ";
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

export default function FsoftTrainingVocabularyPage() {
  const { user, loading } = useAuth();

  const units = useMemo(
    () => Array.from(new Set(data.map((x) => x.unit))).sort((a, b) => a - b),
    [],
  );

  const [selectedUnit, setSelectedUnit] = useState<number | "all">("all");
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
    const base =
      selectedUnit === "all"
        ? data
        : data.filter((item) => item.unit === selectedUnit);
    return Array.from(new Set(base.map((x) => x.lesson)));
  }, [selectedUnit]);

  useEffect(() => {
    setSelectedLesson("all");
  }, [selectedUnit]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data
      .filter((item) =>
        selectedUnit === "all" ? true : item.unit === selectedUnit,
      )
      .filter((item) =>
        selectedLesson === "all" ? true : item.lesson === selectedLesson,
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
        if (a.unit !== b.unit) return a.unit - b.unit;
        if (a.lessonOrder !== b.lessonOrder)
          return a.lessonOrder - b.lessonOrder;
        return a.id.localeCompare(b.id);
      });
  }, [selectedUnit, selectedLesson, posFilter, transFilter, search]);

  useEffect(() => {
    const nextDeck = isShuffled ? shuffleArray(filtered) : filtered;
    setDeck(nextDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filtered, isShuffled]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
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
  }, [deck.length]);

  const current = deck[currentIndex] ?? null;
  const progress =
    deck.length > 0 ? ((currentIndex + 1) / deck.length) * 100 : 0;

  const grouped = useMemo(() => {
    const map = new Map<string, VocabItem[]>();
    for (const item of deck) {
      const key = `Unit ${item.unit} - ${item.lesson} - ${item.section}`;
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [deck]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link href="/resources/FsoftTraining">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại FPT Software Training
            </Button>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedUnit(units[0] ?? "all");
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
          <h1 className="text-2xl md:text-3xl font-bold text-orange-600 mb-4">
            Kotoba FsoftTraining • Unit 1–12
          </h1>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">Chọn Unit</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUnit("all")}
                  className={`px-3 py-1.5 rounded-full border text-sm ${
                    selectedUnit === "all"
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  }`}
                >
                  Tất cả
                </button>
                {units.map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setSelectedUnit(unit)}
                    className={`px-3 py-1.5 rounded-full border text-sm ${
                      selectedUnit === unit
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    }`}
                  >
                    Unit {unit}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Chọn Bài</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedLesson("all")}
                  className={`px-3 py-1.5 rounded-full border text-sm ${
                    selectedLesson === "all"
                      ? "bg-amber-500 text-white border-amber-500"
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
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    }`}
                  >
                    {lesson}
                  </button>
                ))}
              </div>
            </div>

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
                <option value="conjunction">Tiếp tục từ</option>
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
            <p className="text-3xl font-bold text-orange-600">{deck.length}</p>
          </Card>
          <Card className="p-4 bg-white/95 dark:bg-gray-800/95">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Vị trí hiện tại
            </p>
            <p className="text-3xl font-bold text-amber-600">
              {deck.length > 0 ? `${currentIndex + 1}/${deck.length}` : "0/0"}
            </p>
          </Card>
          <Card className="p-4 bg-white/95 dark:bg-gray-800/95">
            <p className="text-sm text-gray-500 dark:text-gray-300">Ghi chú</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-100">
              Nhãn 自動詞 / 他動詞 được gắn tự động bằng từ điển.
            </p>
          </Card>
        </div>

        <Card className="p-4 bg-white/95 dark:bg-gray-800/95">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
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
                <Card className="p-6 min-h-[260px] border-2 border-orange-300 bg-white hover:shadow-md transition dark:bg-gray-900 dark:border-orange-700">
                  {!isFlipped ? (
                    <div className="flex gap-6 h-full">
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap text-xs mb-4">
                          <span className="px-2 py-1 rounded-full border bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
                            Unit {current.unit}
                          </span>
                          <span className="px-2 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
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
                          <span className="px-2 py-1 rounded-full border bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
                            Unit {current.unit}
                          </span>
                          <span className="px-2 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
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
                          <p className="text-3xl md:text-4xl font-semibold text-emerald-700">
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

              <div className="flex items-center justify-between gap-3">
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
            Danh sách theo Unit/Bài
          </h2>
          <div className="space-y-4 max-h-[520px] overflow-auto pr-2">
            {grouped.map(([groupTitle, items]) => (
              <div
                key={groupTitle}
                className="border rounded-lg overflow-hidden"
              >
                <div className="px-3 py-2 bg-orange-50 border-b text-sm font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
                  {groupTitle}
                </div>
                <div className="divide-y">
                  {items.map((item) => {
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
                        className={`w-full text-left px-3 py-2 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition ${
                          active
                            ? "bg-amber-100 dark:bg-amber-900/40"
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
