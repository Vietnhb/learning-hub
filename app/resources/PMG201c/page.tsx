"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  RefreshCw,
  Target,
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
  answer: string | string[];
}

interface TermDefinitionQuestion {
  term: string;
  definition: string;
}

interface ParsedChoice {
  id: string;
  text: string;
}

interface ParsedQuestion {
  question: string;
  choices: ParsedChoice[];
  correctChoiceIds: string[];
  topic: string;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[`"'.,:;!?()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAnswerIds(
  answer: string | string[] | undefined,
  choices: ParsedChoice[],
): string[] {
  const choiceIds = new Set(choices.map((choice) => choice.id));
  const picked: string[] = [];

  const pushIfValid = (id: string) => {
    const normalized = id.toUpperCase();
    if (choiceIds.has(normalized) && !picked.includes(normalized)) {
      picked.push(normalized);
    }
  };

  if (Array.isArray(answer)) {
    answer.forEach((item) => {
      const tokens = String(item)
        .toUpperCase()
        .split(/[^A-Z]+/)
        .filter((token) => token.length === 1);
      tokens.forEach((token) => pushIfValid(token));
    });
  } else if (typeof answer === "string") {
    const tokens = answer
      .toUpperCase()
      .split(/[^A-Z]+/)
      .filter((token) => token.length === 1);
    tokens.forEach((token) => pushIfValid(token));
  }

  return picked.length > 0 ? picked : [choices[0]?.id ?? "A"];
}

function areSameAnswerSet(selected: string[], correct: string[]): boolean {
  if (selected.length !== correct.length) return false;
  const selectedSet = new Set(selected);
  return correct.every((id) => selectedSet.has(id));
}

function parseFromTermDefinition(item: TermDefinitionQuestion): ParsedQuestion {
  const rawTerm = item.term?.trim() ?? "";
  const markerRegex = /([A-Z])\.\s*/gi;
  const markers: Array<{ id: string; index: number; length: number }> = [];
  let markerMatch: RegExpExecArray | null = markerRegex.exec(rawTerm);
  while (markerMatch) {
    markers.push({
      id: markerMatch[1].toUpperCase(),
      index: markerMatch.index,
      length: markerMatch[0].length,
    });
    markerMatch = markerRegex.exec(rawTerm);
  }

  let question = rawTerm;
  const choices: ParsedChoice[] = [];

  if (markers.length > 0) {
    const firstChoiceIndex = markers[0].index;
    question = rawTerm.slice(0, firstChoiceIndex).trim();
    if (question.endsWith(":")) {
      question = question.slice(0, -1).trim();
    }

    markers.forEach((marker, idx) => {
      const id = marker.id;
      const start = marker.index + marker.length;
      const end =
        idx + 1 < markers.length ? markers[idx + 1].index : rawTerm.length;
      const text = rawTerm.slice(start, end).trim();
      choices.push({ id, text });
    });
  } else {
    question = rawTerm;
  }

  const defNorm = normalizeText(item.definition ?? "");
  let correctChoiceId =
    choices.find((choice) => normalizeText(choice.text) === defNorm)?.id ?? "";

  if (!correctChoiceId) {
    const byPrefix = (item.definition ?? "").trim().match(/^([A-Z])\./i);
    if (byPrefix) {
      const candidate = byPrefix[1].toUpperCase();
      if (choices.some((choice) => choice.id === candidate)) {
        correctChoiceId = candidate;
      }
    }
  }

  if (!correctChoiceId) {
    correctChoiceId = choices[0]?.id ?? "A";
  }

  return {
    question,
    choices,
    correctChoiceIds: [correctChoiceId],
    topic: detectTopic(question),
  };
}

function detectTopic(question: string): string {
  const q = question.toLowerCase();

  if (
    q.includes("scope") ||
    q.includes("wbs") ||
    q.includes("requirement") ||
    q.includes("deliverable")
  ) {
    return "Phạm vi dự án";
  }
  if (
    q.includes("schedule") ||
    q.includes("gantt") ||
    q.includes("critical path") ||
    q.includes("timeline")
  ) {
    return "Tiến độ và kế hoạch";
  }
  if (
    q.includes("risk") ||
    q.includes("issue") ||
    q.includes("mitigation") ||
    q.includes("contingency")
  ) {
    return "Quản trị rủi ro";
  }
  if (
    q.includes("stakeholder") ||
    q.includes("communication") ||
    q.includes("team") ||
    q.includes("resource")
  ) {
    return "Nhân sự và giao tiếp";
  }
  if (
    q.includes("cost") ||
    q.includes("budget") ||
    q.includes("evm") ||
    q.includes("quality")
  ) {
    return "Chi phí và chất lượng";
  }
  return "Kiến thức nền tảng";
}

export default function PMG201cPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"review" | "quiz">("review");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string[]>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const quizData = rawQuiz as Array<QuizQuestion | TermDefinitionQuestion>;

  const questions: ParsedQuestion[] = useMemo(() => {
    return quizData.map((item) => {
      if ("term" in item && "definition" in item) {
        return parseFromTermDefinition(item);
      }

      const choices: ParsedChoice[] = item.choices.map((choice, index) => {
        const matched = choice.match(/^([A-Z])\.\s*(.*)$/i);
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

      return {
        question: item.question,
        choices,
        correctChoiceIds: parseAnswerIds(item.answer, choices),
        topic: detectTopic(item.question),
      };
    });
  }, [quizData]);

  const totalQuestions = questions.length;
  const answeredCount = Object.values(selectedAnswers).filter(
    (selected) => selected.length > 0,
  ).length;
  const currentQuestion = questions[currentIndex];
  const selectedForCurrent = selectedAnswers[currentIndex] ?? [];
  const progress =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const score = useMemo(() => {
    return questions.reduce((acc, question, index) => {
      const selected = selectedAnswers[index] ?? [];
      return areSameAnswerSet(selected, question.correctChoiceIds) ? acc + 1 : acc;
    }, 0);
  }, [questions, selectedAnswers]);

  const topicStats = useMemo(() => {
    const totalByTopic: Record<string, number> = {};
    const wrongByTopic: Record<string, number> = {};

    questions.forEach((question, index) => {
      totalByTopic[question.topic] = (totalByTopic[question.topic] ?? 0) + 1;
      const selected = selectedAnswers[index] ?? [];
      if (
        submitted &&
        selected.length > 0 &&
        !areSameAnswerSet(selected, question.correctChoiceIds)
      ) {
        wrongByTopic[question.topic] = (wrongByTopic[question.topic] ?? 0) + 1;
      }
    });

    return { totalByTopic, wrongByTopic };
  }, [questions, selectedAnswers, submitted]);

  const handleSelectAnswer = (choiceId: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => {
      const current = prev[currentIndex] ?? [];
      const isSelected = current.includes(choiceId);
      const next = isSelected
        ? current.filter((item) => item !== choiceId)
        : [...current, choiceId].sort();

      return {
        ...prev,
        [currentIndex]: next,
      };
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  if (totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-6"
          >
            <Link href="/resources">
              <Button
                type="button"
                variant="outline"
                className="gap-2 bg-slate-900/80 border-slate-700 text-slate-100 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại Tài nguyên
              </Button>
            </Link>
          </motion.div>

          <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
            <CardHeader>
              <CardTitle className="text-2xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                PMG201c - Project Management Quiz
              </CardTitle>
              <CardDescription className="text-slate-300">
                Chưa có câu hỏi trong file `app/resources/PMG201c/quiz.json`.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-slate-300">
              Thêm dữ liệu dạng JSON. Page hỗ trợ cả 2 kiểu:
              `question/choices/answer` và `term/definition`.
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <Link href="/resources">
            <Button
              type="button"
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
              <CardTitle className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                PMG201c - Project Management Quiz
              </CardTitle>
              <CardDescription className="text-slate-300 text-base">
                Luyện tập quản lý dự án theo hướng thực chiến: scope, schedule,
                risk, stakeholder và kiểm soát chất lượng.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-emerald-700/60 bg-emerald-950/30 p-4">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold mb-2">
                  <Target className="w-4 h-4" />
                  Scope rõ ràng
                </div>
                <p className="text-sm text-slate-300">
                  Nắm vững yêu cầu, deliverable và giới hạn dự án.
                </p>
              </div>
              <div className="rounded-xl border border-teal-700/60 bg-teal-950/30 p-4">
                <div className="flex items-center gap-2 text-teal-300 font-semibold mb-2">
                  <BriefcaseBusiness className="w-4 h-4" />
                  Vận hành dự án
                </div>
                <p className="text-sm text-slate-300">
                  Lập kế hoạch tiến độ, phân bổ nguồn lực và theo dõi thực thi.
                </p>
              </div>
              <div className="rounded-xl border border-cyan-700/60 bg-cyan-950/30 p-4">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-2">
                  <ClipboardCheck className="w-4 h-4" />
                  Kiểm soát chất lượng
                </div>
                <p className="text-sm text-slate-300">
                  Đánh giá hiệu quả, xử lý rủi ro và cải tiến liên tục.
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
                    type="button"
                    variant="outline"
                    onClick={() => setMode("review")}
                    className={
                      mode === "review"
                        ? "border-emerald-400 bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900/60"
                        : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ôn tập trước
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMode("quiz")}
                    className={
                      mode === "quiz"
                        ? "border-emerald-400 bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900/60"
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
                    const isSelected = selectedForCurrent.includes(choice.id);
                    const isCorrect =
                      currentQuestion.correctChoiceIds.includes(choice.id);
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
                            ? "border-emerald-400 bg-emerald-900/30 text-emerald-100"
                            : "border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-600";

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
                        {currentQuestion.correctChoiceIds.join(", ")}
                      </span>
                    </p>
                    <p className="text-xs text-emerald-300/90 mt-1">
                      Gợi ý: đọc kỹ từ khóa của câu hỏi trước, sau đó loại trừ
                      các đáp án gần nghĩa.
                    </p>
                  </div>
                )}

                {mode === "quiz" && submitted && (
                  <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                    <p className="text-sm text-slate-300">
                      Đáp án đúng:{" "}
                      <span className="font-bold text-emerald-300">
                        {currentQuestion.correctChoiceIds.join(", ")}
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button
                    type="button"
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
                    type="button"
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
                      type="button"
                      onClick={handleStartQuiz}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    >
                      Bắt đầu làm quiz
                    </Button>
                  ) : !submitted ? (
                    <Button
                      type="button"
                      onClick={() => setSubmitted(true)}
                      disabled={answeredCount === 0}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                    >
                      Nộp bài
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleReset}
                      variant="outline"
                      className="border-emerald-400 bg-slate-900 text-emerald-100 hover:bg-emerald-900/40 hover:text-emerald-50 dark:border-emerald-300 dark:bg-slate-900 dark:text-emerald-100 dark:hover:bg-emerald-900/50 dark:hover:text-emerald-50"
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
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
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
                {Object.entries(topicStats.totalByTopic).map(
                  ([topic, total]) => {
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
                        {mode === "quiz" && submitted && wrong > 0 && (
                          <p className="text-xs text-rose-300 mt-1">
                            Sai {wrong} câu, cần ôn tập thêm
                          </p>
                        )}
                      </div>
                    );
                  },
                )}
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
                    nắm chắc kiến thức trước khi làm bài.
                  </p>
                )}
                {mode === "quiz" && !submitted && (
                  <p className="text-slate-300">
                    Hoàn thành quiz để nhận gợi ý ôn tập theo từng nhóm kiến
                    thức quản lý dự án.
                  </p>
                )}
                {mode === "quiz" &&
                  submitted &&
                  score / totalQuestions >= 0.8 && (
                    <p className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      Bạn đang nắm khá chắc nền tảng PMG201c.
                    </p>
                  )}
                {mode === "quiz" &&
                  submitted &&
                  score / totalQuestions < 0.8 && (
                    <p className="flex items-center gap-2 text-amber-300">
                      <XCircle className="w-4 h-4" />
                      Nên ôn lại scope, risk và stakeholder để tăng độ chính
                      xác.
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
