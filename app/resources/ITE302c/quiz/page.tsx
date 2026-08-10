"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Layers3,
  RefreshCw,
  Shuffle,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import rawQuestions from "./questions.json";

interface Choice {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  choices: Choice[];
  answers: string[];
  sourcePage: number;
}

type StudyMode = "review" | "quiz";

const ALL_TOPICS = "All Topics";
const questions = (rawQuestions as QuizQuestion[]).map((question) => ({
  ...question,
  topic: detectTopic(question),
}));

function detectTopic(question: QuizQuestion): string {
  const text = `${question.question} ${question.choices
    .map((choice) => choice.text)
    .join(" ")}`.toLowerCase();

  if (
    text.includes("data") ||
    text.includes("privacy") ||
    text.includes("personal") ||
    text.includes("collection") ||
    text.includes("pii")
  ) {
    return "Data Ethics & Privacy";
  }

  if (
    text.includes("bias") ||
    text.includes("fairness") ||
    text.includes("discrimination") ||
    text.includes("stereotype")
  ) {
    return "Bias & Fairness";
  }

  if (
    text.includes("transparency") ||
    text.includes("explainability") ||
    text.includes("interpretability") ||
    text.includes("black box") ||
    text.includes("accountability")
  ) {
    return "Transparency & Accountability";
  }

  if (
    text.includes("framework") ||
    text.includes("principle") ||
    text.includes("guideline") ||
    text.includes("declaration") ||
    text.includes("oecd") ||
    text.includes("asilomar") ||
    text.includes("montreal")
  ) {
    return "AI Ethics Frameworks";
  }

  if (
    text.includes("autonomy") ||
    text.includes("weapon") ||
    text.includes("self-driving") ||
    text.includes("autonomous") ||
    text.includes("trolley")
  ) {
    return "Autonomous Systems & Safety";
  }

  if (
    text.includes("contract") ||
    text.includes("liability") ||
    text.includes("legal") ||
    text.includes("regulation") ||
    text.includes("gdpr") ||
    text.includes("coppa")
  ) {
    return "Legal & Regulatory";
  }

  if (
    text.includes("moral") ||
    text.includes("ethics") ||
    text.includes("deontology") ||
    text.includes("utilitarian") ||
    text.includes("virtue") ||
    text.includes("categorical")
  ) {
    return "Moral Philosophy & Ethics Theory";
  }

  if (
    text.includes("deployment") ||
    text.includes("development") ||
    text.includes("implementation") ||
    text.includes("testing") ||
    text.includes("model")
  ) {
    return "AI Development & Deployment";
  }

  return "General AI Ethics";
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let state = seed || 1;

  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }

  return result;
}

function sameAnswers(selected: string[], answers: string[]): boolean {
  if (selected.length !== answers.length) return false;
  const selectedSet = new Set(selected);
  return answers.every((answer) => selectedSet.has(answer));
}

export default function ITE302cQuizPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<StudyMode>("review");
  const [topic, setTopic] = useState(ALL_TOPICS);
  const [seed, setSeed] = useState(302);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewAnswers, setShowReviewAnswers] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >({});
  const [checkedQuestions, setCheckedQuestions] = useState<
    Record<string, boolean>
  >({});

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    questions.forEach((question) => {
      counts.set(question.topic, (counts.get(question.topic) ?? 0) + 1);
    });

    return Array.from(counts.entries()).sort((a, b) =>
      a[0].localeCompare(b[0], "en"),
    );
  }, []);

  const questionPool = useMemo(
    () =>
      topic === ALL_TOPICS
        ? questions
        : questions.filter((question) => question.topic === topic),
    [topic],
  );

  const sessionQuestions = useMemo(
    () => seededShuffle(questionPool, seed),
    [questionPool, seed],
  );

  const currentQuestion = sessionQuestions[currentIndex];
  const selected = currentQuestion
    ? (selectedAnswers[currentQuestion.id] ?? [])
    : [];
  const isChecked = currentQuestion
    ? Boolean(checkedQuestions[currentQuestion.id])
    : false;
  const currentCorrect = currentQuestion
    ? sameAnswers(selected, currentQuestion.answers)
    : false;

  const checkedCount = sessionQuestions.filter(
    (question) => checkedQuestions[question.id],
  ).length;
  const score = sessionQuestions.filter(
    (question) =>
      checkedQuestions[question.id] &&
      sameAnswers(selectedAnswers[question.id] ?? [], question.answers),
  ).length;

  const resetProgress = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setCheckedQuestions({});
  };

  const changeMode = (nextMode: StudyMode) => {
    setMode(nextMode);
    resetProgress();
  };

  const selectChoice = (choiceId: string) => {
    if (!currentQuestion || isChecked || mode === "review") return;

    setSelectedAnswers((current) => {
      const previous = current[currentQuestion.id] ?? [];
      const next =
        currentQuestion.answers.length === 1
          ? [choiceId]
          : previous.includes(choiceId)
            ? previous.filter((id) => id !== choiceId)
            : [...previous, choiceId].sort();

      return { ...current, [currentQuestion.id]: next };
    });
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(Math.min(Math.max(index, 0), sessionQuestions.length - 1));
  };

  const retryCurrent = () => {
    if (!currentQuestion) return;
    setSelectedAnswers((current) => {
      const next = { ...current };
      delete next[currentQuestion.id];
      return next;
    });
    setCheckedQuestions((current) => {
      const next = { ...current };
      delete next[currentQuestion.id];
      return next;
    });
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f1e8] dark:bg-slate-950">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading questions...
        </div>
      </main>
    );
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/resources/ITE302c"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300"
        >
          <ArrowLeft className="h-4 w-4" />
          ITE302c
        </Link>

        <section className="relative overflow-hidden rounded-[2rem] border border-slate-900/10 bg-[#1a1f3a] px-6 py-8 text-white shadow-[0_24px_80px_-42px_rgba(15,23,42,0.8)] sm:px-9 lg:px-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-300/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/25 bg-blue-200/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                <Sparkles className="h-3.5 w-3.5" />
                ITE302c
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                Ethics in AI Quiz
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
                357 questions covering AI ethics, privacy, bias, and responsible AI development.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 sm:grid-cols-1 lg:min-w-[430px]">
              <HeroStat value="357" label="Questions" />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 rounded-3xl border border-slate-900/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-5 lg:grid-cols-[auto_1fr] lg:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mode
            </p>
            <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
              <ModeButton
                active={mode === "review"}
                icon={<BookOpen className="h-4 w-4" />}
                onClick={() => changeMode("review")}
              >
                Review
              </ModeButton>
              <ModeButton
                active={mode === "quiz"}
                icon={<CheckCircle2 className="h-4 w-4" />}
                onClick={() => changeMode("quiz")}
              >
                Quiz
              </ModeButton>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Topic
            </span>
            <select
              value={topic}
              onChange={(event) => {
                setTopic(event.target.value);
                resetProgress();
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
            >
              <option value={ALL_TOPICS}>
                {ALL_TOPICS} ({questions.length})
              </option>
              {topics.map(([name, count]) => (
                <option key={name} value={name}>
                  {name} ({count})
                </option>
              ))}
            </select>
          </label>

        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-3xl border border-slate-900/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-8">
            {currentQuestion && (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-900 dark:bg-blue-400/15 dark:text-blue-200">
                      {mode === "review" ? "Review" : "Quiz"}{" "}
                      {currentIndex + 1}/{sessionQuestions.length}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {currentQuestion.topic}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {currentQuestion.answers.length > 1 && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                        Select {currentQuestion.answers.length} answers
                      </span>
                    )}
                    {mode === "review" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-pressed={showReviewAnswers}
                        onClick={() =>
                          setShowReviewAnswers((current) => !current)
                        }
                        className="gap-2"
                      >
                        {showReviewAnswers ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        {showReviewAnswers ? "Hide answers" : "Show answers"}
                      </Button>
                    )}
                  </div>
                </div>

                <h2 className="mt-6 text-xl font-black leading-relaxed sm:text-2xl">
                  {currentQuestion.question}
                </h2>

                <div className="mt-7 grid gap-3">
                  {currentQuestion.choices.map((choice) => {
                    const choiceSelected = selected.includes(choice.id);
                    const choiceCorrect = currentQuestion.answers.includes(
                      choice.id,
                    );
                    const reveal =
                      (mode === "review" && showReviewAnswers) || isChecked;
                    const wrongSelection =
                      reveal && choiceSelected && !choiceCorrect;

                    return (
                      <button
                        key={choice.id}
                        type="button"
                        disabled={mode === "review" || isChecked}
                        onClick={() => selectChoice(choice.id)}
                        className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                          reveal && choiceCorrect
                            ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-400/10 dark:text-emerald-100"
                            : wrongSelection
                              ? "border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-400/10 dark:text-rose-100"
                              : choiceSelected
                                ? "border-blue-500 bg-blue-50 text-blue-950 dark:bg-blue-400/10 dark:text-blue-100"
                                : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/60 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-blue-500/70"
                        }`}
                      >
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-sm font-black ${
                            reveal && choiceCorrect
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : wrongSelection
                                ? "border-rose-500 bg-rose-500 text-white"
                                : choiceSelected
                                  ? "border-blue-500 bg-blue-500 text-white"
                                  : "border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                          }`}
                        >
                          {reveal && choiceCorrect ? (
                            <Check className="h-4 w-4" />
                          ) : wrongSelection ? (
                            <X className="h-4 w-4" />
                          ) : (
                            choice.id
                          )}
                        </span>
                        <span className="pt-1.5 leading-relaxed">
                          {choice.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {mode === "quiz" && isChecked && (
                  <ResultNote
                    correct={currentCorrect}
                    text={
                      currentCorrect
                        ? "Correct!"
                        : `Correct answer: ${currentQuestion.answers.join(", ")}`
                    }
                  />
                )}

                <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={currentIndex === 0}
                    onClick={() => goToQuestion(currentIndex - 1)}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {mode === "quiz" && !isChecked && (
                    <Button
                      type="button"
                      disabled={selected.length === 0}
                      onClick={() =>
                        setCheckedQuestions((current) => ({
                          ...current,
                          [currentQuestion.id]: true,
                        }))
                      }
                      className="bg-[#1a1f3a] text-white hover:bg-[#252b4a] dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300"
                    >
                      Check Answer
                    </Button>
                  )}

                  {mode === "quiz" && isChecked && !currentCorrect && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={retryCurrent}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </Button>
                  )}

                  <Button
                    type="button"
                    disabled={currentIndex === sessionQuestions.length - 1}
                    onClick={() => goToQuestion(currentIndex + 1)}
                    className="ml-auto gap-2 bg-blue-400 text-slate-950 hover:bg-blue-300"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </section>

          <aside className="grid content-start gap-4">
            <section className="rounded-3xl border border-slate-900/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Session
                  </p>
                  <h3 className="mt-1 text-xl font-black">
                    {sessionQuestions.length} questions
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Shuffle questions"
                  title="Shuffle questions"
                  onClick={() => {
                    setSeed((current) => current + 1);
                    resetProgress();
                  }}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-400 transition-all"
                  style={{
                    width: `${
                      ((currentIndex + 1) / sessionQuestions.length) * 100
                    }%`,
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Question {currentIndex + 1} / {sessionQuestions.length}
              </p>

              {mode === "quiz" && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniStat
                    icon={<Layers3 className="h-4 w-4" />}
                    value={checkedCount}
                    label="Checked"
                  />
                  <MiniStat
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    value={score}
                    label="Correct"
                  />
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-900/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-black">Question List</h3>
              </div>
              <div className="grid max-h-72 grid-cols-5 gap-2 overflow-y-auto pr-1">
                {sessionQuestions.map((question, index) => {
                  const checked = checkedQuestions[question.id];
                  const correct =
                    checked &&
                    sameAnswers(
                      selectedAnswers[question.id] ?? [],
                      question.answers,
                    );

                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => goToQuestion(index)}
                      aria-label={`Go to question ${index + 1}`}
                      className={`h-10 rounded-xl border text-xs font-black transition ${
                        index === currentIndex
                          ? "border-blue-500 bg-blue-400 text-slate-950"
                          : mode === "quiz" && checked
                            ? correct
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                              : "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <p className="text-2xl font-black text-blue-300">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-300">{label}</p>
    </div>
  );
}

function ModeButton({
  active,
  icon,
  onClick,
  children,
}: {
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-bold transition ${
        active
          ? "bg-white text-slate-950 shadow-sm dark:bg-slate-700 dark:text-white"
          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ResultNote({ correct, text }: { correct: boolean; text: string }) {
  return (
    <div
      className={`mt-5 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${
        correct
          ? "border-emerald-500/50 bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-200"
          : "border-rose-500/50 bg-rose-50 text-rose-800 dark:bg-rose-400/10 dark:text-rose-200"
      }`}
    >
      {correct ? (
        <CheckCircle2 className="h-5 w-5 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0" />
      )}
      {text}
    </div>
  );
}

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300">
        {icon}
        <span className="text-lg font-black">{value}</span>
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
