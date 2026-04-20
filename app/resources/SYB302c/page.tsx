"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  HandCoins,
  Lightbulb,
  RefreshCw,
  Rocket,
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
  choices?: string[];
  answer?: string | string[];
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
    .replace(/<[^>]*>/g, " ")
    .replace(/[`"'.,:;!?()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAnswerIds(
  answer: string | string[] | undefined,
  choices: ParsedChoice[],
): string[] {
  if (choices.length === 0) {
    return [];
  }

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

    if (picked.length === 0 && answer.trim()) {
      const normAnswer = normalizeText(answer);
      const exact = choices.find(
        (choice) => normalizeText(choice.text) === normAnswer,
      );
      if (exact) {
        pushIfValid(exact.id);
      }
    }
  }

  if (picked.length === 0) {
    return [choices[0].id];
  }

  return choices.map((choice) => choice.id).filter((id) => picked.includes(id));
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
  }

  return {
    question,
    choices,
    correctChoiceIds: parseAnswerIds(item.definition, choices),
    topic: detectTopic(question),
  };
}

function detectTopic(question: string): string {
  const q = question.toLowerCase();

  if (
    q.includes("entrepreneur") ||
    q.includes("mindset") ||
    q.includes("motivation") ||
    q.includes("risk")
  ) {
    return "Entrepreneurial Mindset";
  }
  if (
    q.includes("opportunity") ||
    q.includes("innovation") ||
    q.includes("market pull") ||
    q.includes("technology")
  ) {
    return "Opportunity and Innovation";
  }
  if (
    q.includes("customer") ||
    q.includes("value proposition") ||
    q.includes("prototype") ||
    q.includes("marketing")
  ) {
    return "Customer and Marketing";
  }
  if (
    q.includes("finance") ||
    q.includes("valuation") ||
    q.includes("note") ||
    q.includes("balance sheet") ||
    q.includes("investor") ||
    q.includes("term sheet")
  ) {
    return "Finance and Fundraising";
  }
  if (
    q.includes("strategy") ||
    q.includes("partnership") ||
    q.includes("industry") ||
    q.includes("competitive")
  ) {
    return "Strategy and Execution";
  }

  return "Core Concepts";
}

export default function SYB302cPage() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"review" | "quiz">("review");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string[]>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const quizData = rawQuiz as Array<QuizQuestion | TermDefinitionQuestion>;

  const parsedQuestions: ParsedQuestion[] = useMemo(() => {
    return quizData.map((item) => {
      if ("term" in item && "definition" in item) {
        return parseFromTermDefinition(item);
      }

      const questionText = item.question?.trim() ?? "";
      const choices: ParsedChoice[] = (item.choices ?? []).map(
        (choice, index) => {
          const matched = String(choice).match(/^([A-Z])\.\s*(.*)$/i);
          if (matched) {
            return {
              id: matched[1].toUpperCase(),
              text: matched[2],
            };
          }
          return {
            id: String.fromCharCode(65 + index),
            text: String(choice),
          };
        },
      );

      return {
        question: questionText,
        choices,
        correctChoiceIds: parseAnswerIds(item.answer, choices),
        topic: detectTopic(questionText),
      };
    });
  }, [quizData]);

  const questions = useMemo(() => {
    return parsedQuestions.filter(
      (question) => question.question && question.choices.length > 0,
    );
  }, [parsedQuestions]);

  const openEndedCount = parsedQuestions.length - questions.length;
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
      return areSameAnswerSet(selected, question.correctChoiceIds)
        ? acc + 1
        : acc;
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
        : [...current, choiceId];

      return {
        ...prev,
        [currentIndex]: next.sort(),
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Dang tai...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  if (totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 py-10 px-4">
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
                Quay lai Tai nguyen
              </Button>
            </Link>
          </motion.div>

          <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
            <CardHeader>
              <CardTitle className="text-2xl font-black bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                SYB302c - Entrepreneurship Quiz
              </CardTitle>
              <CardDescription className="text-slate-300">
                Chua co cau hoi trac nghiem hop le trong file
                `app/resources/SYB302c/quiz.json`.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 py-10 px-4">
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
              Quay lai Tai nguyen
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
              <CardTitle className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                SYB302c - Entrepreneurship and Venture Strategy
              </CardTitle>
              <CardDescription className="text-slate-300 text-base">
                Luyen tap mindset khoi nghiep, phat hien co hoi, customer value
                proposition va fundraising fundamentals.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-amber-700/60 bg-amber-950/30 p-4">
                <div className="flex items-center gap-2 text-amber-300 font-semibold mb-2">
                  <Lightbulb className="w-4 h-4" />
                  Opportunity Thinking
                </div>
                <p className="text-sm text-slate-300">
                  Learn how to identify market gaps and evaluate innovation
                  viability.
                </p>
              </div>
              <div className="rounded-xl border border-orange-700/60 bg-orange-950/30 p-4">
                <div className="flex items-center gap-2 text-orange-300 font-semibold mb-2">
                  <Rocket className="w-4 h-4" />
                  Venture Execution
                </div>
                <p className="text-sm text-slate-300">
                  Practice strategic decisions across industry, customer and
                  partnerships.
                </p>
              </div>
              <div className="rounded-xl border border-rose-700/60 bg-rose-950/30 p-4">
                <div className="flex items-center gap-2 text-rose-300 font-semibold mb-2">
                  <HandCoins className="w-4 h-4" />
                  Finance Basics
                </div>
                <p className="text-sm text-slate-300">
                  Build confidence with valuation, term sheet and startup
                  financing terms.
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
                        ? "border-amber-400 bg-amber-900/40 text-amber-100 hover:bg-amber-900/60"
                        : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    On tap truoc
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMode("quiz")}
                    className={
                      mode === "quiz"
                        ? "border-amber-400 bg-amber-900/40 text-amber-100 hover:bg-amber-900/60"
                        : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }
                  >
                    <ClipboardCheck className="w-4 h-4 mr-2" />
                    Lam quiz
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
              <CardHeader>
                <CardTitle className="text-xl">
                  {mode === "review"
                    ? `On tap cau ${currentIndex + 1}/${totalQuestions}`
                    : `Cau ${currentIndex + 1}/${totalQuestions}`}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Chu de: {currentQuestion.topic}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-slate-100 leading-relaxed">
                  {currentQuestion.question}
                </p>

                <div className="space-y-3">
                  {currentQuestion.choices.map((choice) => {
                    const isSelected = selectedForCurrent.includes(choice.id);
                    const isCorrect = currentQuestion.correctChoiceIds.includes(
                      choice.id,
                    );
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
                            ? "border-amber-400 bg-amber-900/30 text-amber-100"
                            : "border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-600";

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
                      Dap an dung:{" "}
                      <span className="font-bold">
                        {currentQuestion.correctChoiceIds.join(", ")}
                      </span>
                    </p>
                    <p className="text-xs text-emerald-300/90 mt-1">
                      Goi y: doc ky keyword trong cau hoi, sau do loai tru cac
                      lua chon gan nghia.
                    </p>
                  </div>
                )}

                {mode === "quiz" && submitted && (
                  <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
                    <p className="text-sm text-slate-300">
                      Dap an dung:{" "}
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
                    Cau truoc
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
                    Cau tiep
                  </Button>

                  {mode === "review" ? (
                    <Button
                      type="button"
                      onClick={handleStartQuiz}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    >
                      Bat dau lam quiz
                    </Button>
                  ) : !submitted ? (
                    <Button
                      type="button"
                      onClick={() => setSubmitted(true)}
                      disabled={answeredCount === 0}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    >
                      Nop bai
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleReset}
                      variant="outline"
                      className="border-amber-400 bg-slate-900 text-amber-100 hover:bg-amber-900/40 hover:text-amber-50 dark:border-amber-300 dark:bg-slate-900 dark:text-amber-100 dark:hover:bg-amber-900/50 dark:hover:text-amber-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Lam lai
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
              <CardHeader>
                <CardTitle>Tien do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-300">
                  {mode === "review"
                    ? `Dang on cau ${currentIndex + 1}/${totalQuestions}`
                    : `Da lam ${answeredCount}/${totalQuestions} cau (${progress}%)`}
                </p>
                {mode === "quiz" && submitted && (
                  <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-3">
                    <p className="font-semibold text-slate-100">
                      Ket qua: {score}/{totalQuestions}
                    </p>
                    <p className="text-sm text-slate-300">
                      {Math.round((score / totalQuestions) * 100)}% do chinh xac
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-900/70 text-slate-100">
              <CardHeader>
                <CardTitle>Phan bo chu de</CardTitle>
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
                          <span className="text-slate-400">{total} cau</span>
                        </div>
                        {mode === "quiz" && submitted && wrong > 0 && (
                          <p className="text-xs text-rose-300 mt-1">
                            Sai {wrong} cau, can on them
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
                <CardTitle>Danh gia nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {mode === "review" && (
                  <p className="text-slate-300">
                    Day la che do on tap. Moi cau se hien dap an dung de ban xac
                    thuc lai kien thuc truoc khi lam bai.
                  </p>
                )}
                {mode === "quiz" && !submitted && (
                  <p className="text-slate-300">
                    Hoan thanh quiz de nhan goi y on tap theo tung nhom kien
                    thuc khoi nghiep.
                  </p>
                )}
                {mode === "quiz" &&
                  submitted &&
                  score / totalQuestions >= 0.8 && (
                    <p className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" />
                      Ban dang nam kha chac nen tang SYB302c.
                    </p>
                  )}
                {mode === "quiz" &&
                  submitted &&
                  score / totalQuestions < 0.8 && (
                    <p className="flex items-center gap-2 text-amber-300">
                      <XCircle className="w-4 h-4" />
                      Nen on lai nhom innovation, customer value va fundraising.
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
