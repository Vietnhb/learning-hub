"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import quizQuestionsData from "./quiz-questions.json";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number[];
  note?: string;
};

type RawQuizQuestion = Omit<QuizQuestion, "answer"> & {
  answer: number | number[];
};

export type QuizAnswers = Record<string, number[]>;

export const QUIZ_QUESTIONS = (quizQuestionsData as RawQuizQuestion[]).map(
  (question) => ({
    ...question,
    answer: Array.isArray(question.answer)
      ? question.answer
      : [question.answer],
  }),
);

function hasSameAnswers(selected: number[] | undefined, answer: number[]) {
  if (!selected || selected.length !== answer.length) return false;

  const selectedSet = new Set(selected);
  return answer.every((answerIndex) => selectedSet.has(answerIndex));
}

export function getQuizScore(answers: QuizAnswers) {
  return QUIZ_QUESTIONS.filter((question) =>
    hasSameAnswers(answers[question.id], question.answer),
  ).length;
}

function formatCountdown(remainingMs: number) {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function QuizScreen({
  answers,
  submitted,
  started,
  remainingMs,
  onAnswer,
  onClear,
  onStart,
  onSubmit,
  onGoLeaderboard,
}: {
  answers: QuizAnswers;
  submitted: boolean;
  started: boolean;
  remainingMs: number;
  onAnswer: (questionId: string, selectedAnswers: number[]) => void;
  onClear: () => void;
  onStart: () => void;
  onSubmit: () => void;
  onGoLeaderboard: () => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const answeredCount = QUIZ_QUESTIONS.filter(
    (question) => (answers[question.id]?.length ?? 0) > 0,
  ).length;
  const score = getQuizScore(answers);
  const canSubmit = answeredCount === QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const selected = answers[currentQuestion.id] ?? [];
  const answered = selected.length > 0;
  const correct = hasSameAnswers(selected, currentQuestion.answer);
  const allowsMultipleAnswers = currentQuestion.answer.length > 1;

  const updateAnswer = (optionIndex: number) => {
    if (!started || submitted) return;

    if (!allowsMultipleAnswers) {
      onAnswer(currentQuestion.id, [optionIndex]);
      return;
    }

    const nextAnswers = selected.includes(optionIndex)
      ? selected.filter((selectedIndex) => selectedIndex !== optionIndex)
      : [...selected, optionIndex].sort((left, right) => left - right);

    onAnswer(currentQuestion.id, nextAnswers);
  };

  if (!started && !submitted) {
    return (
      <div className="grid min-h-[520px] place-items-center">
        <div className="pixel-card grid w-full max-w-xl justify-items-center gap-5 bg-[#10190d] p-6 text-center">
          <div>
            <p className="pixel-eyebrow">Quiz</p>
            <h2 className="pixel-heading mt-2 text-3xl md:text-5xl">MLN122</h2>
          </div>
          <div className="border-4 border-[#0b1209] bg-[#f5cf72] px-8 py-5 text-[#2d2114] shadow-[4px_4px_0_#0b1209]">
            <p className="font-mono text-5xl font-black leading-none">
              {formatCountdown(remainingMs)}
            </p>
          </div>
          <Button
            type="button"
            onClick={onStart}
            className="pixel-button bg-[#d94b35] px-8 py-6 text-base font-black text-white hover:bg-[#ef634b]"
          >
            Bắt đầu làm quiz
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="grid min-h-[520px] place-items-center">
        <div className="pixel-card grid w-full max-w-xl gap-5 bg-[#10190d] p-6 text-center">
          <div>
            <p className="pixel-eyebrow">Đã nộp</p>
            <h2 className="pixel-heading mt-2 text-3xl md:text-5xl">
              {score}/{QUIZ_QUESTIONS.length}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              onClick={() => {
                onClear();
                setCurrentQuestionIndex(0);
              }}
              className="pixel-button border-2 border-[#0b1209] bg-[#f5cf72] py-6 font-black text-[#2d2114] hover:bg-[#ffe08c]"
            >
              Làm lại
            </Button>
            <Button
              type="button"
              onClick={onGoLeaderboard}
              className="pixel-button border-2 border-[#0b1209] bg-[#d94b35] py-6 font-black text-white hover:bg-[#ef634b]"
            >
              Bảng xếp hạng
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="pixel-eyebrow">Quiz</p>
          <h2 className="pixel-heading mt-2 text-3xl md:text-5xl">MLN122</h2>
        </div>
        <div className="grid min-w-[180px] gap-1 border-4 border-[#0b1209] bg-[#f5cf72] p-3 text-[#2d2114] shadow-[4px_4px_0_#0b1209]">
          <p
            className="font-mono text-4xl font-black leading-none"
            aria-label="Thoi gian con lai"
          >
            {formatCountdown(remainingMs)}
          </p>
          <p className="text-xs font-bold">
            Câu {currentQuestionIndex + 1}/{QUIZ_QUESTIONS.length}
          </p>
          {submitted && (
            <p className="text-xs font-black">
              {score}/{QUIZ_QUESTIONS.length}
            </p>
          )}
        </div>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="pixel-card grid content-start gap-3 bg-[#10190d] p-4">
          <div>
            <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#f5cf72]">
              Câu hỏi
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2 lg:grid-cols-3">
            {QUIZ_QUESTIONS.map((question, index) => {
              const itemAnswered = (answers[question.id]?.length ?? 0) > 0;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`flex h-11 items-center justify-center border-2 border-[#0b1209] font-mono text-sm font-black ${
                    index === currentQuestionIndex
                      ? "bg-[#f5cf72] text-[#2d2114] shadow-[2px_2px_0_#0b1209]"
                      : itemAnswered
                        ? "bg-[#7fc66a] text-[#0b1209]"
                        : "bg-[#35582f] text-[#fff5cf]/55 hover:text-[#fff5cf]/85"
                  }`}
                  aria-label={`Đi tới câu ${index + 1}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-1 grid gap-2 border-t-2 border-[#fff5cf]/15 pt-3">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit || submitted}
              className="pixel-button w-full border-2 border-[#0b1209] bg-[#d94b35] font-black text-white hover:bg-[#ef634b] disabled:opacity-50"
            >
              {submitted ? "Đã nộp" : "Submit"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onClear();
                setCurrentQuestionIndex(0);
              }}
              className="pixel-button w-full border-2 border-[#0b1209] bg-[#f5cf72] font-black text-[#2d2114] hover:bg-[#ffe08c]"
            >
              Làm lại
            </Button>
          </div>
        </aside>

        <div className="pixel-card grid content-start gap-4 bg-[#10190d] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-[#f5cf72]">
                Câu {currentQuestionIndex + 1}
              </p>
              <h3 className="mt-2 text-xl font-black leading-tight text-white">
                {currentQuestion.question}
              </h3>
            </div>
            {submitted && answered && (
              <span
                className={`shrink-0 border-2 border-[#0b1209] px-3 py-1 text-[10px] font-black uppercase ${
                  correct
                    ? "bg-[#7fc66a] text-[#0b1209]"
                    : "bg-[#d94b35] text-white"
                }`}
              >
                {correct ? "Đúng" : "Xem lại"}
              </span>
            )}
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {currentQuestion.options.map((option, optionIndex) => {
              const isSelected = selected.includes(optionIndex);
              const showCorrect =
                submitted && currentQuestion.answer.includes(optionIndex);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateAnswer(optionIndex)}
                  disabled={submitted || !started}
                  className={`flex min-h-[76px] items-center gap-3 border-2 p-4 text-left transition ${
                    showCorrect
                      ? "border-[#f5cf72] bg-[#263f22] text-white"
                      : isSelected
                        ? "border-[#f5cf72] bg-[#2d2114] text-white"
                        : "border-[#0b1209] bg-[#20361d] text-[#fff5cf]/82 hover:border-[#f5cf72]"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center border-2 border-[#0b1209] font-mono text-xs font-black ${
                      showCorrect || isSelected
                        ? "bg-[#f5cf72] text-[#2d2114]"
                        : "bg-[#10190d] text-[#f5cf72]"
                    }`}
                  >
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className="text-sm font-bold leading-snug">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {submitted && answered && currentQuestion.note && (
            <div className="flex items-start gap-2 border-l-4 border-[#f5cf72] bg-[#20361d] px-3 py-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#f5cf72]" />
              <p className="text-sm leading-relaxed text-[#fff5cf]/82">
                {currentQuestion.note}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 border-t-2 border-[#fff5cf]/15 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setCurrentQuestionIndex((current) => Math.max(0, current - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="pixel-button border-2 border-[#0b1209] bg-[#f5cf72] px-5 font-black text-[#2d2114] hover:bg-[#ffe08c] disabled:opacity-50"
            >
              Back
            </Button>
            <span className="font-mono text-xs font-black text-[#fff5cf]/60">
              {currentQuestionIndex + 1}/{QUIZ_QUESTIONS.length}
            </span>
            <Button
              type="button"
              onClick={() =>
                setCurrentQuestionIndex((current) =>
                  Math.min(QUIZ_QUESTIONS.length - 1, current + 1),
                )
              }
              disabled={currentQuestionIndex === QUIZ_QUESTIONS.length - 1}
              className="pixel-button border-2 border-[#0b1209] bg-[#d94b35] px-5 font-black text-white hover:bg-[#ef634b] disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
