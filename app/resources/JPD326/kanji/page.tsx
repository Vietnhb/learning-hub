"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import kanjiData from "./kanji.json";

type KanjiCard = {
  term: string;
  definition: string;
  image: string | null;
};

type Lesson = {
  lesson: number;
  kanji: KanjiCard[];
};

type KanjiData = {
  series: string;
  lessons: Lesson[];
};

type ParsedDefinition = {
  isRoot: boolean;
  meaning: string;
  onyomi?: string;
  kunyomi?: string;
  reading?: string;
};

type KanjiGroup = {
  root: KanjiCard;
  words: KanjiCard[];
};

const data = kanjiData as KanjiData;
const japaneseSerif = {
  fontFamily:
    '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", "MS Mincho", serif',
};

function parseDefinition(definition: string): ParsedDefinition {
  const wordMatch = definition.match(/^（(.+?)）(.+)$/);

  if (wordMatch) {
    return {
      isRoot: false,
      reading: wordMatch[1],
      meaning: wordMatch[2].trim(),
    };
  }

  const [meaning, onyomi, kunyomi] = definition.split(/\s+/);

  return {
    isRoot: true,
    meaning,
    onyomi,
    kunyomi,
  };
}

function groupKanji(cards: KanjiCard[]) {
  return cards.reduce<KanjiGroup[]>((groups, card) => {
    if (parseDefinition(card.definition).isRoot || groups.length === 0) {
      groups.push({ root: card, words: [] });
      return groups;
    }

    groups[groups.length - 1].words.push(card);
    return groups;
  }, []);
}

export default function JPD326KanjiPage() {
  const { user, loading } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(0);

  const currentLesson = data.lessons[selectedLesson];
  const cards = currentLesson?.kanji ?? [];
  const groups = useMemo(() => groupKanji(cards), [cards]);

  if (loading) {
    return <LoadingState />;
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <Link href="/resources/JPD326">
            <Button
              variant="outline"
              className="gap-2 border-slate-300 bg-white dark:border-gray-700 dark:bg-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại JPD326
            </Button>
          </Link>
        </div>

        <LessonHero
          currentLesson={currentLesson}
          groupsCount={groups.length}
          cardsCount={cards.length}
          lessons={data.lessons}
          selectedLesson={selectedLesson}
          onSelectLesson={setSelectedLesson}
        />

        <div className="grid gap-5">
          {groups.map((group) => (
            <KanjiGroupCard key={group.root.term} group={group} />
          ))}
        </div>
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-red-600" />
        <p className="text-gray-600 dark:text-gray-300">Đang tải...</p>
      </div>
    </div>
  );
}

function LessonHero({
  currentLesson,
  groupsCount,
  cardsCount,
  lessons,
  selectedLesson,
  onSelectLesson,
}: {
  currentLesson: Lesson;
  groupsCount: number;
  cardsCount: number;
  lessons: Lesson[];
  selectedLesson: number;
  onSelectLesson: (index: number) => void;
}) {
  return (
    <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">
            <BookOpen className="h-4 w-4" />
            Kanji JPD326 · Bài {currentLesson.lesson}
          </div>
          <h1 className="text-3xl font-black md:text-5xl">Học Kanji theo cụm</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-gray-300 md:text-base">
            Chữ gốc ở bên trái, âm On/Kun nằm ngay dưới chữ. Từ ứng dụng ở bên phải để đọc theo cụm và ôn nhanh.
          </p>

          <div className="mt-5 grid max-w-md grid-cols-3 gap-2 text-center">
            <Stat value={groupsCount} label="chữ gốc" />
            <Stat value={cardsCount} label="mục học" />
            <Stat value={currentLesson.lesson} label="bài" />
          </div>
        </div>

        <LessonSelector
          lessons={lessons}
          selectedLesson={selectedLesson}
          onSelectLesson={onSelectLesson}
        />
      </div>
    </header>
  );
}

function LessonSelector({
  lessons,
  selectedLesson,
  onSelectLesson,
}: {
  lessons: Lesson[];
  selectedLesson: number;
  onSelectLesson: (index: number) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">
            Chọn bài
          </p>
          <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
            Đổi nhanh giữa các bài kanji
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
          {lessons.length} bài
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
        {lessons.map((lesson, index) => (
          <button
            key={lesson.lesson}
            type="button"
            onClick={() => onSelectLesson(index)}
            className={`rounded-lg border px-4 py-3 text-sm font-bold transition ${
              selectedLesson === index
                ? "border-red-600 bg-red-600 text-white shadow-sm"
                : "border-slate-300 bg-white text-slate-800 hover:border-red-300 hover:bg-red-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-red-950/20"
            }`}
          >
            Bài {lesson.lesson}
          </button>
        ))}
      </div>
    </section>
  );
}

function KanjiGroupCard({ group }: { group: KanjiGroup }) {
  const root = parseDefinition(group.root.definition);

  return (
    <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-slate-200 bg-slate-100 px-5 py-3 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-black uppercase tracking-wide text-slate-600 dark:text-gray-300">
            Chữ gốc
          </p>
          <p className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
            {group.words.length} ví dụ
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr]">
        <section className="flex min-h-56 flex-col items-center justify-center border-b bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900 lg:border-b-0 lg:border-r">
          <span
            className="text-8xl font-normal leading-none tracking-normal text-slate-900 dark:text-gray-50 md:text-9xl"
            style={japaneseSerif}
          >
            {group.root.term}
          </span>
          <span className="mt-4 text-xl font-black text-red-700 dark:text-red-300">
            {root.meaning}
          </span>
          <div className="mt-3 grid w-full grid-cols-2 gap-2">
            <ReadingChip label="On" value={root.onyomi} />
            <ReadingChip label="Kun" value={root.kunyomi} />
          </div>
        </section>

        <section className="bg-slate-50/70 p-4 dark:bg-gray-950/40 md:p-6">
          <div className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-gray-400">
            Ví dụ ứng dụng
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.words.map((word) => (
              <WordCard key={word.term} word={word} />
            ))}
          </div>
        </section>
      </div>
    </Card>
  );
}

function WordCard({ word }: { word: KanjiCard }) {
  const parsed = parseDefinition(word.definition);

  return (
    <article className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className="rounded-lg bg-red-50 px-2 py-1 text-5xl font-normal leading-none tracking-normal text-red-800 dark:bg-red-950/30 dark:text-red-200"
          style={japaneseSerif}
        >
          {word.term}
        </span>
        <span className="shrink-0 rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          {parsed.reading}
        </span>
      </div>
      <p className="border-t border-slate-200 pt-3 text-base font-semibold leading-6 text-slate-800 dark:border-gray-700 dark:text-gray-100">
        {parsed.meaning}
      </p>
    </article>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-slate-100 px-4 py-3 dark:bg-gray-800">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

function ReadingChip({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left dark:border-gray-800 dark:bg-gray-950">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{value ?? "—"}</p>
    </div>
  );
}
