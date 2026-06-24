"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Hash,
  Languages,
  ListChecks,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
import grammarData from "./gramar.json";

interface GrammarPoint {
  id: string;
  pattern: string;
  meaning: string;
  note: string;
  examples: {
    jp: string;
    vi: string;
  }[];
}

function renderMarkedText(text: string): ReactNode {
  const parts = text.split(/""(.*?)""/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong
        key={`${part}-${index}`}
        className="rounded bg-orange-100 px-1 font-extrabold text-orange-700 dark:bg-orange-950 dark:text-orange-300"
      >
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

function getGrammarNumber(id: string): number {
  return Number.parseInt(id.slice(0, 3), 10);
}

export default function FsoftTrainingGrammarPage() {
  const { user, loading } = useAuth();
  const grammar = grammarData.grammar as GrammarPoint[];
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const totalExamples = useMemo(
    () => grammar.reduce((sum, point) => sum + point.examples.length, 0),
    [grammar],
  );

  const filteredGrammar = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("vi");
    if (!keyword) return grammar;

    return grammar.filter((point) => {
      const number = String(getGrammarNumber(point.id));
      const searchable = [
        number,
        point.pattern,
        point.meaning,
        point.note,
        ...point.examples.flatMap((example) => [example.jp, example.vi]),
      ]
        .join(" ")
        .toLocaleLowerCase("vi");

      return searchable.includes(keyword);
    });
  }, [grammar, query]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-200 border-b-orange-600" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  const jumpToGrammar = (grammarId: string) => {
    const el = document.getElementById(`grammar-${grammarId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleExamples = (grammarId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(grammarId)) {
        next.delete(grammarId);
      } else {
        next.add(grammarId);
      }
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-5 dark:bg-gray-950 md:py-7">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/resources/FsoftTraining">
            <Button
              variant="outline"
              className="h-9 gap-2 rounded-lg border-orange-200 bg-white shadow-sm hover:border-orange-400 hover:bg-orange-50 dark:border-gray-700 dark:bg-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-3 py-1.5 text-xs font-semibold text-orange-700 dark:border-gray-800 dark:bg-gray-900 dark:text-orange-300">
            <Sparkles className="h-4 w-4" />
            N3 Grammar Library
          </div>
        </div>

        <section className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-300">
                <BookOpen className="h-4 w-4" />
                FPT Software Training
              </div>
              <h1 className="font-japanese-serif text-2xl font-black tracking-tight text-gray-950 dark:text-white sm:text-3xl">
                文法 <span className="font-sans text-orange-600 dark:text-orange-300">Ngữ pháp N3</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                Tra cứu cấu trúc, ý nghĩa, ghi chú và ví dụ theo đúng số thứ tự
                của tài liệu.
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span><strong className="text-gray-900 dark:text-white">{grammar.length}</strong> mẫu ngữ pháp</span>
                <span><strong className="text-gray-900 dark:text-white">{totalExamples}</strong> câu ví dụ</span>
              </div>
            </div>

            <div>
              <label
                htmlFor="grammar-search"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                Tìm nhanh
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-600" />
                <input
                  id="grammar-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Số, cấu trúc, ý nghĩa..."
                  className="h-10 w-full rounded-lg border border-orange-200 bg-orange-50/50 pl-10 pr-10 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:ring-orange-950"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Xóa tìm kiếm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {!query && (
          <section className="sticky top-2 z-20 rounded-xl border border-orange-200 bg-white/95 p-2.5 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 lg:hidden">
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <Hash className="h-4 w-4 text-orange-500" />
                Mục lục nhanh
              </p>
              <p className="text-xs text-gray-400">Chọn số để di chuyển</p>
            </div>
            <div className="flex max-h-20 flex-wrap gap-1 overflow-y-auto pr-1">
              {grammar.map((point) => (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => jumpToGrammar(point.id)}
                  title={point.pattern}
                  className="flex h-7 min-w-7 items-center justify-center rounded-md border border-orange-100 bg-orange-50 px-1.5 text-[11px] font-bold text-orange-700 transition hover:border-orange-400 hover:bg-orange-500 hover:text-white dark:border-gray-800 dark:bg-gray-900 dark:text-orange-300 dark:hover:bg-orange-600 dark:hover:text-white"
                >
                  {getGrammarNumber(point.id)}
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="grid items-start gap-4 lg:grid-cols-[11.5rem_minmax(0,1fr)]">
          <aside className="sticky top-4 hidden max-h-[calc(100vh-2rem)] overflow-hidden rounded-xl border border-orange-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:block">
            <div className="border-b border-orange-100 px-3 py-3 dark:border-gray-800">
              <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-200">
                <Hash className="h-4 w-4 text-orange-500" />
                Mục lục nhanh
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Chọn số để di chuyển
              </p>
            </div>
            <div className="grid max-h-[calc(100vh-6.5rem)] grid-cols-4 gap-1 overflow-y-auto p-2">
              {grammar.map((point) => (
                <button
                  key={point.id}
                  type="button"
                  onClick={() => jumpToGrammar(point.id)}
                  title={point.pattern}
                  className="flex h-7 items-center justify-center rounded-md border border-orange-100 bg-orange-50 text-[11px] font-bold text-orange-700 transition hover:border-orange-400 hover:bg-orange-500 hover:text-white dark:border-gray-800 dark:bg-gray-950 dark:text-orange-300 dark:hover:bg-orange-600 dark:hover:text-white"
                >
                  {getGrammarNumber(point.id)}
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white sm:text-xl">
                  {query ? "Kết quả tìm kiếm" : "Danh sách ngữ pháp"}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Hiển thị {filteredGrammar.length} mẫu
                </p>
              </div>
            </div>

            {filteredGrammar.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-orange-200 bg-white/80 px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900/70">
                <Search className="mx-auto h-10 w-10 text-orange-300" />
                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                  Không tìm thấy mẫu phù hợp
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Thử tìm bằng số, tiếng Nhật hoặc nghĩa tiếng Việt khác.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setQuery("")}
                  className="mt-5 rounded-xl"
                >
                  Xóa tìm kiếm
                </Button>
              </div>
            ) : (
              <section className="space-y-3">
                {filteredGrammar.map((point) => {
              const number = getGrammarNumber(point.id);
              const isExpanded = expandedIds.has(point.id);

              return (
                <article
                  key={point.id}
                  id={`grammar-${point.id}`}
                  className="scroll-mt-24 overflow-hidden rounded-xl border border-orange-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="grid md:grid-cols-[4rem_1fr]">
                    <div className="flex items-center gap-2 bg-orange-500 px-4 py-3 text-white md:flex-col md:justify-center md:px-2 md:text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-100">
                        Mẫu
                      </span>
                      <span className="text-2xl font-black leading-none">
                        {number}
                      </span>
                    </div>

                    <div>
                      <div className="border-b border-orange-100 px-4 py-4 dark:border-gray-800 md:px-5">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                          Cấu trúc
                        </p>
                        <h3 className="mt-1 whitespace-pre-line font-japanese-serif text-lg font-black leading-relaxed text-gray-950 dark:text-white sm:text-xl">
                          {point.pattern}
                        </h3>
                      </div>

                      <div className="grid border-b border-orange-100 dark:border-gray-800 lg:grid-cols-2 lg:divide-x lg:divide-orange-100 dark:lg:divide-gray-800">
                        <div className="p-4 md:p-5">
                          <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-300">
                            <Languages className="h-4 w-4" />
                            Ý nghĩa
                          </div>
                          <p className="whitespace-pre-line text-sm font-semibold leading-6 text-gray-800 dark:text-gray-100">
                            {point.meaning}
                          </p>
                        </div>

                        <div className="border-t border-orange-100 p-4 dark:border-gray-800 md:p-5 lg:border-t-0">
                          <div className="mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-300">
                            <BookOpen className="h-4 w-4" />
                            Cách dùng
                          </div>
                          <p className="whitespace-pre-line text-sm leading-6 text-gray-700 dark:text-gray-300">
                            {point.note}
                          </p>
                        </div>
                      </div>

                      <div className="bg-orange-50/50 p-2 dark:bg-gray-950/40">
                        <button
                          type="button"
                          onClick={() => toggleExamples(point.id)}
                          aria-controls={`examples-${point.id}`}
                          className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition hover:bg-white dark:hover:bg-gray-900"
                        >
                          <span className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-100">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
                              <ListChecks className="h-4 w-4" />
                            </span>
                            {point.examples.length} ví dụ thực hành
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-300">
                            {isExpanded ? "Thu gọn" : "Xem ví dụ"}
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </span>
                        </button>

                        {isExpanded && (
                          <ol
                            id={`examples-${point.id}`}
                            className="mt-1.5 space-y-2 px-0.5 pb-1"
                          >
                            {point.examples.map((example, index) => (
                              <li
                                key={`${point.id}-${index}`}
                                className="overflow-hidden rounded-lg border border-orange-100 bg-white dark:border-gray-800 dark:bg-gray-900"
                              >
                                <div className="flex items-start gap-3 p-3 sm:p-4">
                                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[11px] font-black text-white">
                                    {index + 1}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="whitespace-pre-line font-japanese-serif text-sm font-bold leading-6 text-gray-950 dark:text-white sm:text-base">
                                      {renderMarkedText(example.jp)}
                                    </p>
                                    <div className="my-2 h-px bg-gradient-to-r from-orange-100 to-transparent dark:from-gray-700" />
                                    <p className="whitespace-pre-line text-sm leading-6 text-gray-600 dark:text-gray-300">
                                      {renderMarkedText(example.vi)}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
                })}
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
