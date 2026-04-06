"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Layers,
  Network,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
import rawQuiz from "./quiz.json";

interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
}

interface ParsedChoice {
  id: string;
  text: string;
}

interface ParsedQuestion {
  question: string;
  choices: ParsedChoice[];
  correctChoiceId: string;
  topic: string;
}

function detectTopic(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("architecture") || q.includes("component")) {
    return "Kiến trúc tổng thể";
  }
  if (q.includes("client/server") || q.includes("layer")) {
    return "Phong cách kiến trúc";
  }
  if (q.includes("uml") || q.includes("use case") || q.includes("actor")) {
    return "Mô hình hóa UML";
  }
  if (q.includes("platform-independent") || q.includes("platform-specific")) {
    return "MDA - PIM/PSM";
  }
  if (q.includes("design") || q.includes("method") || q.includes("strategy")) {
    return "Thiết kế hệ thống";
  }
  return "Nền tảng hệ thống";
}

export default function SWD392Page() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"review" | "quiz">("review");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  const quizData = rawQuiz as QuizQuestion[];

  const questions: ParsedQuestion[] = useMemo(() => {
    return quizData.map((item) => {
      const choices: ParsedChoice[] = item.choices.map((choice, index) => {
        const matched = choice.match(/^([A-D])\.\s*(.*)$/i);
        if (matched) {
          return {
            id: matched[1].toUpperCase(),
            text: matched[2],
          };
        }
        return {
          id: String.fromCharCode(65 + index),
          text: choice,
        };
      });

      const correctId = item.answer.trim().toUpperCase();
      const hasCorrectId = choices.some((choice) => choice.id === correctId);

      return {
        question: item.question,
        choices,
        correctChoiceId: hasCorrectId ? correctId : choices[0]?.id ?? "A",
        topic: detectTopic(item.question),
      };
    });
  }, [quizData]);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentQuestion = questions[currentIndex];
  const selectedForCurrent = selectedAnswers[currentIndex];
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const score = useMemo(() => {
    return questions.reduce((acc, question, index) => {
      return selectedAnswers[index] === question.correctChoiceId ? acc + 1 : acc;
    }, 0);
  }, [questions, selectedAnswers]);

  const topicStats = useMemo(() => {
    const totalByTopic: Record<string, number> = {};
    const wrongByTopic: Record<string, number> = {};

    questions.forEach((question, index) => {
      totalByTopic[question.topic] = (totalByTopic[question.topic] ?? 0) + 1;
      if (
        submitted &&
        selectedAnswers[index] &&
        selectedAnswers[index] !== question.correctChoiceId
      ) {
        wrongByTopic[question.topic] = (wrongByTopic[question.topic] ?? 0) + 1;
      }
    });

    return { totalByTopic, wrongByTopic };
  }, [questions, selectedAnswers, submitted]);

  const handleSelectAnswer = (choiceId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: choiceId,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  const handleStartQuiz = () => {
    setMode("quiz");
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <Link href="/resources">
            <Button
              variant="outline"
              className="gap-2 bg-slate-900/80 border-slate-700 text-slate-100 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Tài nguyên
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Card className="border-slate-700 bg-slate-900/70 text-slate-100 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                SWD392 - Kiến trúc hệ thống
              </CardTitle>
              <CardDescription className="text-slate-300 text-base">
                Học theo hướng kiến trúc hệ thống: nền tảng mô hình hóa, thiết kế
                thành phần, và tư duy triển khai.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-cyan-700/60 bg-cyan-950/30 p-4">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-2">
                  <Building2 className="w-4 h-4" />
                  Nhận diện kiến trúc
                </div>
                <p className="text-sm text-slate-300">
                  Hiểu cấu trúc tổng thể, thành phần và mối liên kết.
                </p>
              </div>
              <div className="rounded-xl border border-blue-700/60 bg-blue-950/30 p-4">
                <div className="flex items-center gap-2 text-blue-300 font-semibold mb-2">
                  <Layers className="w-4 h-4" />
                  Tư duy thiết kế
                </div>
                <p className="text-sm text-slate-300">
                  Áp dụng design concept, strategy, method để phân rã module.
                </p>
              </div>
              <div className="rounded-xl border border-indigo-700/60 bg-indigo-950/30 p-4">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-2">
                  <Network className="w-4 h-4" />
                  Mô hình hóa UML
                </div>
                <p className="text-sm text-slate-300">
                  Luyện use case, actor, và model PIM/PSM gắn với hệ thống web.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setMode("review")}
                    className={
                      mode === "review"
                        ? "border-cyan-400 bg-cyan-900/40 text-cyan-100 hover:bg-cyan-900/60"
                        : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ôn tập trước
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMode("quiz")}
                    className={
                      mode === "quiz"
                        ? "border-cyan-400 bg-cyan-900/40 text-cyan-100 hover:bg-cyan-900/60"
                        : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }
                  >
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    Làm quiz
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
              <CardHeader>
                <CardTitle className="text-xl">
                  {mode === "review"
                    ? `Ôn tập câu ${currentIndex + 1}/${totalQuestions}`
                    : `Câu ${currentIndex + 1}/${totalQuestions}`}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Chủ đề: {currentQuestion.topic}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-slate-100 leading-relaxed">
                  {currentQuestion.question}
                </p>

                <div className="space-y-3">
                  {currentQuestion.choices.map((choice) => {
                    const isSelected = selectedForCurrent === choice.id;
                    const isCorrect = currentQuestion.correctChoiceId === choice.id;
                    const isWrongSelected =
                      submitted && isSelected && !isCorrect;

                    const choiceClass =
                      mode === "review"
                        ? isCorrect
                          ? "border-emerald-500 bg-emerald-900/40 text-emerald-100"
                          : "border-slate-700 bg-slate-900 text-slate-300"
                        : submitted
                          ? isCorrect
                            ? "border-emerald-500 bg-emerald-900/40 text-emerald-100"
                            : isWrongSelected
                              ? "border-rose-500 bg-rose-900/40 text-rose-100"
                              : "border-slate-700 bg-slate-900 text-slate-300"
                          : isSelected
                            ? "border-cyan-400 bg-cyan-900/30 text-cyan-100"
                            : "border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-600";

                    return (
                      <button
                        type="button"
                        key={choice.id}
                        onClick={() => {
                          if (mode === "quiz") {
                            handleSelectAnswer(choice.id);
                          }
                        }}
                        className={`w-full text-left rounded-xl border p-4 transition ${choiceClass}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-bold">{choice.id}.</span>
                          <span>{choice.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {mode === "review" && (
                  <div className="rounded-lg border border-emerald-700/60 bg-emerald-950/30 p-4">
                    <p className="text-sm text-emerald-200">
                      Đáp án đúng:{" "}
                      <span className="font-bold">
                        {currentQuestion.correctChoiceId}
                      </span>
                    </p>
                    <p className="text-xs text-emerald-300/90 mt-1">
                      Gợi ý: đọc kỹ khái niệm chính trong câu rồi đối chiếu các lựa
                      chọn gần nghĩa.
                    </p>
                  </div>
                )}

                {mode === "quiz" && submitted && (
                  <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                    <p className="text-sm text-slate-300">
                      Đáp án đúng:{" "}
                      <span className="font-bold text-emerald-300">
                        {currentQuestion.correctChoiceId}
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentIndex === 0}
                    className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  >
                    Câu trước
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        Math.min(prev + 1, totalQuestions - 1),
                      )
                    }
                    disabled={currentIndex === totalQuestions - 1}
                    className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  >
                    Câu tiếp
                  </Button>
                  {mode === "review" ? (
                    <Button
                      onClick={handleStartQuiz}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                    >
                      Bắt đầu làm quiz
                    </Button>
                  ) : !submitted ? (
                    <Button
                      onClick={() => setSubmitted(true)}
                      disabled={answeredCount === 0}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                    >
                      Nộp bài
                    </Button>
                  ) : (
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-cyan-400 bg-slate-900 text-cyan-100 hover:bg-cyan-900/40 hover:text-cyan-50 dark:border-cyan-300 dark:bg-slate-900 dark:text-cyan-100 dark:hover:bg-cyan-900/50 dark:hover:text-cyan-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Làm lại
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
              <CardHeader>
                <CardTitle>Tiến độ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-300">
                  {mode === "review"
                    ? `Đang ôn câu ${currentIndex + 1}/${totalQuestions}`
                    : `Đã làm ${answeredCount}/${totalQuestions} câu (${progress}%)`}
                </p>
                {mode === "quiz" && submitted && (
                  <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
                    <p className="font-semibold text-slate-100">
                      Kết quả: {score}/{totalQuestions}
                    </p>
                    <p className="text-sm text-slate-300">
                      {Math.round((score / totalQuestions) * 100)}% độ chính xác
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
              <CardHeader>
                <CardTitle>Phân bố chủ đề</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(topicStats.totalByTopic).map(([topic, total]) => {
                  const wrong = topicStats.wrongByTopic[topic] ?? 0;
                  return (
                    <div
                      key={topic}
                      className="rounded-lg border border-slate-700 px-3 py-2 bg-slate-950/40"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span>{topic}</span>
                        <span className="text-slate-400">{total} câu</span>
                      </div>
                      {submitted && wrong > 0 && (
                        <p className="text-xs text-rose-300 mt-1">
                          Sai {wrong} câu, cần ôn tập thêm
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
              <CardHeader>
                <CardTitle>Đánh giá nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {mode === "review" && (
                  <p className="text-slate-300">
                    Đây là chế độ ôn tập. Mỗi câu sẽ hiển thị đáp án đúng để bạn
                    nắm chắc lý thuyết trước khi làm bài.
                  </p>
                )}
                {mode === "quiz" && !submitted && (
                  <p className="text-slate-300">
                    Hoàn thành quiz để nhận được gợi ý ôn tập theo từng nhóm kiến
                    thức kiến trúc hệ thống.
                  </p>
                )}
                {mode === "quiz" && submitted && score / totalQuestions >= 0.8 && (
                  <p className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    Nhanh và chắc. Bạn đã nắm khá vững nền tảng kiến trúc.
                  </p>
                )}
                {mode === "quiz" && submitted && score / totalQuestions < 0.8 && (
                  <p className="flex items-center gap-2 text-amber-300">
                    <XCircle className="w-4 h-4" />
                    Nên ôn lại nhóm UML, design strategy và PIM/PSM để tối ưu tư
                    duy hệ thống.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
