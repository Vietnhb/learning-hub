"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  RefreshCw,
  ShieldCheck,
  Shuffle,
  Smartphone,
  XCircle,
} from "lucide-react";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import rawQuiz from "./quiz.json";

interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
  source?: string;
}

interface ParsedChoice {
  id: string;
  text: string;
}

interface ParsedQuestion extends Omit<QuizQuestion, "choices" | "answer"> {
  choices: ParsedChoice[];
  correctChoiceId: string;
  topic: string;
}

function detectTopic(question: string): string {
  const value = question.toLowerCase();

  if (
    value.includes("bloc") ||
    value.includes("state") ||
    value.includes("cubit") ||
    value.includes("rebuild")
  ) {
    return "State management & BLoC";
  }
  if (
    value.includes("authentication") ||
    value.includes("token") ||
    value.includes("http") ||
    value.includes("api") ||
    value.includes("json") ||
    value.includes("database") ||
    value.includes("storage")
  ) {
    return "Data, API & Authentication";
  }
  if (
    value.includes("test") ||
    value.includes("deploy") ||
    value.includes("version control") ||
    value.includes("release apk")
  ) {
    return "Testing & Deployment";
  }
  if (
    value.includes("dart") ||
    value.includes("class") ||
    value.includes("map") ||
    value.includes("generics") ||
    value.includes("package")
  ) {
    return "Dart";
  }
  if (
    value.includes("performance") ||
    value.includes("architecture") ||
    value.includes("refactor") ||
    value.includes("technical debt")
  ) {
    return "Architecture & Performance";
  }
  return "Flutter UI & Widgets";
}

function parseQuestions(items: QuizQuestion[]): ParsedQuestion[] {
  return items.map((item) => {
    const choices = item.choices.map((choice, index) => {
      const match = choice.match(/^([A-D])\.\s*(.*)$/i);
      return {
        id: match?.[1].toUpperCase() ?? String.fromCharCode(65 + index),
        text: match?.[2] ?? choice,
      };
    });
    const answer = item.answer.trim().toUpperCase();

    return {
      question: item.question,
      choices,
      correctChoiceId: choices.some((choice) => choice.id === answer)
        ? answer
        : (choices[0]?.id ?? "A"),
      source: item.source,
      topic: detectTopic(item.question),
    };
  });
}

function createQuestionOrder(totalQuestions: number): number[] {
  return Array.from({ length: totalQuestions }, (_, index) => index);
}

function shuffleArray<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export default function PRM393Page() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"review" | "quiz">("review");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const baseQuestions = useMemo(
    () => parseQuestions(rawQuiz as QuizQuestion[]),
    [],
  );
  const [questionOrder, setQuestionOrder] = useState(() =>
    createQuestionOrder(baseQuestions.length),
  );
  const questions = useMemo(
    () => questionOrder.map((index) => baseQuestions[index]),
    [baseQuestions, questionOrder],
  );
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const selectedForCurrent = selectedAnswers[currentIndex];
  const progress =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const score = useMemo(
    () =>
      questions.reduce(
        (total, question, index) =>
          total +
          (selectedAnswers[index] === question.correctChoiceId ? 1 : 0),
        0,
      ),
    [questions, selectedAnswers],
  );

  const topicCounts = useMemo(
    () =>
      questions.reduce<Record<string, number>>((counts, question) => {
        counts[question.topic] = (counts[question.topic] ?? 0) + 1;
        return counts;
      }, {}),
    [questions],
  );

  const resetAttempt = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const shuffleQuestions = () => {
    setQuestionOrder((currentOrder) => shuffleArray(currentOrder));
    resetAttempt();
  };

  const startQuiz = () => {
    setMode("quiz");
    resetAttempt();
  };

  const resetQuiz = () => {
    resetAttempt();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center text-slate-300">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-violet-400" />
          Đang tải quiz PRM393...
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredModal show />;
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
        <Card className="max-w-xl border-slate-700 bg-slate-900 text-slate-100">
          <CardHeader>
            <CardTitle>PRM393 chưa có câu hỏi</CardTitle>
            <CardDescription className="text-slate-300">
              Hãy kiểm tra lại file quiz.json của resource.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/40 to-slate-950 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/resources">
          <Button
            type="button"
            variant="outline"
            className="mb-6 gap-2 border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại Tài nguyên
          </Button>
        </Link>

        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card className="mb-8 border-violet-700/60 bg-slate-900/75 text-slate-100 shadow-2xl shadow-violet-950/30">
            <CardHeader>
              <CardTitle className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
                PRM393 - Mobile Programming
              </CardTitle>
              <CardDescription className="text-base text-slate-300">
                Bộ {totalQuestions} câu hỏi Flutter và Dart được tổng hợp từ
                nội dung văn bản cùng bộ đề PRM393_SP26_FE.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-violet-700/60 bg-violet-950/30 p-4">
                <Smartphone className="mb-2 h-5 w-5 text-violet-300" />
                <p className="font-semibold">Flutter UI</p>
                <p className="mt-1 text-sm text-slate-300">
                  Widget tree, layout, navigation và animation.
                </p>
              </div>
              <div className="rounded-xl border border-fuchsia-700/60 bg-fuchsia-950/30 p-4">
                <Code2 className="mb-2 h-5 w-5 text-fuchsia-300" />
                <p className="font-semibold">Dart & Architecture</p>
                <p className="mt-1 text-sm text-slate-300">
                  Ngôn ngữ Dart, BLoC, state và clean architecture.
                </p>
              </div>
              <div className="rounded-xl border border-cyan-700/60 bg-cyan-950/30 p-4">
                <ShieldCheck className="mb-2 h-5 w-5 text-cyan-300" />
                <p className="font-semibold">Data & Testing</p>
                <p className="mt-1 text-sm text-slate-300">
                  API, authentication, local storage và kiểm thử.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-900/75 text-slate-100">
              <CardContent className="flex flex-wrap gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode("review")}
                  className={
                    mode === "review"
                      ? "border-violet-400 bg-violet-900/40 text-violet-100"
                      : "border-slate-700 bg-slate-900 text-slate-200"
                  }
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Ôn tập
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={startQuiz}
                  className={
                    mode === "quiz"
                      ? "border-fuchsia-400 bg-fuchsia-900/40 text-fuchsia-100"
                      : "border-slate-700 bg-slate-900 text-slate-200"
                  }
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Làm quiz
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={shuffleQuestions}
                  className="border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-500 hover:bg-cyan-950/40 hover:text-cyan-100"
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  Xáo câu
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/75 text-slate-100">
              <CardHeader>
                <CardTitle>
                  {mode === "review" ? "Ôn tập" : "Câu"} {currentIndex + 1}/
                  {totalQuestions}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {currentQuestion.topic}
                  {currentQuestion.source
                    ? ` · Nguồn: ${currentQuestion.source}`
                    : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-lg font-semibold leading-relaxed">
                  {currentQuestion.question}
                </p>

                <div className="space-y-3">
                  {currentQuestion.choices.map((choice) => {
                    const isCorrect =
                      choice.id === currentQuestion.correctChoiceId;
                    const isSelected = choice.id === selectedForCurrent;
                    const showAnswer = mode === "review" || submitted;
                    const choiceClass = showAnswer
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-950/50 text-emerald-100"
                        : submitted && isSelected
                          ? "border-rose-500 bg-rose-950/50 text-rose-100"
                          : "border-slate-700 bg-slate-950/50 text-slate-300"
                      : isSelected
                        ? "border-violet-400 bg-violet-950/60 text-violet-100"
                        : "border-slate-700 bg-slate-950/50 text-slate-200 hover:border-violet-500";

                    return (
                      <button
                        type="button"
                        key={choice.id}
                        disabled={mode === "review" || submitted}
                        onClick={() =>
                          setSelectedAnswers((answers) => ({
                            ...answers,
                            [currentIndex]: choice.id,
                          }))
                        }
                        className={`w-full rounded-xl border p-4 text-left transition ${choiceClass}`}
                      >
                        <span className="mr-3 font-bold">{choice.id}.</span>
                        {choice.text}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((index) => index - 1)}
                    className="border-slate-700 bg-slate-900 text-slate-200"
                  >
                    Câu trước
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={currentIndex === totalQuestions - 1}
                    onClick={() => setCurrentIndex((index) => index + 1)}
                    className="border-slate-700 bg-slate-900 text-slate-200"
                  >
                    Câu tiếp
                  </Button>
                  {mode === "review" ? (
                    <Button
                      type="button"
                      onClick={startQuiz}
                      className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                    >
                      Bắt đầu làm quiz
                    </Button>
                  ) : !submitted ? (
                    <Button
                      type="button"
                      disabled={answeredCount === 0}
                      onClick={() => setSubmitted(true)}
                      className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                    >
                      Nộp bài
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetQuiz}
                      className="border-violet-400 bg-slate-900 text-violet-100"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Làm lại
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-900/75 text-slate-100">
              <CardHeader>
                <CardTitle>Tiến độ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{
                      width:
                        mode === "review"
                          ? `${((currentIndex + 1) / totalQuestions) * 100}%`
                          : `${progress}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-slate-300">
                  {mode === "review"
                    ? `Đang xem câu ${currentIndex + 1}/${totalQuestions}`
                    : `Đã trả lời ${answeredCount}/${totalQuestions} câu (${progress}%)`}
                </p>
                {mode === "quiz" && submitted && (
                  <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
                    <p className="text-xl font-bold">
                      {score}/{totalQuestions}
                    </p>
                    <p className="text-sm text-slate-300">
                      {Math.round((score / totalQuestions) * 100)}% chính xác
                    </p>
                    <p
                      className={`mt-2 flex items-center gap-2 text-sm ${
                        score / totalQuestions >= 0.8
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}
                    >
                      {score / totalQuestions >= 0.8 ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {score / totalQuestions >= 0.8
                        ? "Bạn đang nắm khá chắc PRM393."
                        : "Hãy ôn lại các nhóm kiến thức còn yếu."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/75 text-slate-100">
              <CardHeader>
                <CardTitle>Chuyển nhanh câu hỏi</CardTitle>
                <CardDescription className="text-slate-300">
                  Chọn số câu để chuyển đến nội dung tương ứng.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid max-h-72 grid-cols-8 gap-2 overflow-y-auto pr-1 sm:grid-cols-10 lg:grid-cols-6">
                {questions.map((question, index) => {
                  const isCurrent = currentIndex === index;
                  const isAnswered = Boolean(selectedAnswers[index]);
                  return (
                    <button
                      type="button"
                      key={`${question.question}-${index}`}
                      onClick={() => setCurrentIndex(index)}
                      className={`aspect-square rounded-md border text-xs font-semibold transition ${
                        isCurrent
                          ? "border-violet-300 bg-violet-600 text-white"
                          : isAnswered
                            ? "border-fuchsia-600 bg-fuchsia-950/60 text-fuchsia-200"
                            : "border-slate-700 bg-slate-950/50 text-slate-400 hover:border-violet-600"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/75 text-slate-100">
              <CardHeader>
                <CardTitle>Phân bổ chủ đề</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(topicCounts).map(([topic, count]) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/40 px-3 py-2 text-sm"
                  >
                    <span>{topic}</span>
                    <span className="text-slate-400">{count} câu</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
