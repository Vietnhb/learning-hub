"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, BookOpen, ListChecks, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
import grammarData from "./gramar.json";

interface GrammarExample {
  jp: string;
  vi: string;
}

interface GrammarPoint {
  id: string;
  pattern: string;
  meaning: string;
  note: string;
  examples: GrammarExample[];
}

interface GrammarLesson {
  id: number;
  title: string;
  grammar: GrammarPoint[];
}

function renderMarkedText(text: string): ReactNode {
  const markerRegex = /""(.*?)""/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let index = 0;
  let match: RegExpExecArray | null = markerRegex.exec(text);

  while (match) {
    const start = match.index;
    const full = match[0];
    const inner = match[1] ?? "";
    const end = start + full.length;

    if (start > lastIndex) {
      nodes.push(<span key={`plain-${index}`}>{text.slice(lastIndex, start)}</span>);
    }

    nodes.push(
      <strong
        key={`mark-${index}`}
        className="font-extrabold text-orange-700 dark:text-orange-300"
      >
        {inner}
      </strong>,
    );

    lastIndex = end;
    index += 1;
    match = markerRegex.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={`tail-${index}`}>{text.slice(lastIndex)}</span>);
  }

  return nodes.length > 0 ? nodes : text;
}

export default function FsoftTrainingGrammarPage() {
  const { user, loading } = useAuth();
  const lessons = grammarData.lessons as GrammarLesson[];
  const [selectedLesson, setSelectedLesson] = useState<number>(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
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

  const currentLesson = lessons[selectedLesson];
  const totalGrammar = lessons.reduce(
    (sum, lesson) => sum + lesson.grammar.length,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link href="/resources/FsoftTraining">
            <Button
              variant="outline"
              className="gap-2 border-orange-300 bg-white/80 hover:bg-orange-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại FPT Software Training
            </Button>
          </Link>
          <span className="rounded-full border border-orange-300 bg-white/90 px-3 py-1 text-sm font-medium text-orange-700 dark:bg-gray-800 dark:text-orange-300">
            {totalGrammar} mẫu ngữ pháp
          </span>
        </div>

        <Card className="border-orange-200 bg-white/95 shadow-sm dark:bg-gray-800/95">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl font-bold text-orange-600">
              <BookOpen className="h-6 w-6" />
              Bunpo - Ngữ pháp FsoftTraining
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Mỗi mẫu gồm cấu trúc, ý nghĩa và ví dụ thực hành.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelectedLesson(index)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    selectedLesson === index
                      ? "border-orange-500 bg-orange-500 text-white shadow-sm"
                      : "border-gray-300 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  }`}
                >
                  {lesson.title}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {currentLesson && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-white/90 px-4 py-3 dark:bg-gray-800/90">
              <Sparkles className="h-4 w-4 text-orange-500" />
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
                <span className="font-semibold">{currentLesson.title}</span>
                {` · ${currentLesson.grammar.length} mẫu ngữ pháp`}
              </p>
            </div>

            {currentLesson.grammar.map((point) => (
              <Card
                key={point.id}
                className="overflow-hidden border-orange-200 bg-white/95 shadow-sm dark:bg-gray-800/95"
              >
                <CardHeader className="border-b border-orange-100 bg-orange-50/60 py-4 dark:border-gray-700 dark:bg-gray-900">
                  <CardTitle className="text-lg md:text-xl text-gray-900 dark:text-gray-100">
                    {point.pattern}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-4 md:p-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-700 dark:bg-emerald-900/20">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Ý nghĩa
                      </p>
                      <p className="text-sm md:text-base font-semibold text-emerald-900 dark:text-emerald-100">
                        {point.meaning}
                      </p>
                    </div>
                    <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/20">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                        Ghi chú
                      </p>
                      <p className="text-sm md:text-base font-semibold text-amber-900 dark:text-amber-100">
                        {point.note}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm font-semibold text-orange-700 dark:text-orange-300">
                      <ListChecks className="h-4 w-4" />
                      Ví dụ
                    </p>
                    <ol className="space-y-2">
                      {point.examples.map((example, idx) => (
                        <li
                          key={`${point.id}-${idx}`}
                          className="rounded-lg border border-orange-100 bg-orange-50/50 p-3 dark:border-gray-700 dark:bg-gray-900"
                        >
                          <p className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100">
                            {idx + 1}. {renderMarkedText(example.jp)}
                          </p>
                          <p className="mt-1 text-sm text-gray-700 italic dark:text-gray-300">
                            {renderMarkedText(example.vi)}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
