"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import grammarData from "./gramar.json";

interface Example {
  index: number;
  jp: string;
  vi: string;
}

interface GrammarPattern {
  id: string;
  pattern: string;
  usage: string;
  meaning: string;
  description: string;
  examples: Example[];
}

interface Lesson {
  lesson: string;
  grammar: GrammarPattern[];
}

interface GrammarData {
  series: string;
  lessons: Lesson[];
}

export default function GrammarPage() {
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);

  const data: GrammarData = grammarData;
  const lessons = data.lessons;
  const currentLesson = lessons[selectedLesson];

  const togglePattern = (id: string) => {
    setExpandedPattern(expandedPattern === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/resources/JPD316">
            <Button variant="outline" className="gap-2 mb-6 font-japanese">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>

          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-japanese-serif">
              文法 Ngữ Pháp JPD316
            </h1>
            <p className="text-gray-600 font-japanese">{data.series}</p>
          </div>

          {/* Lesson Selector */}
          <div className="flex gap-2 flex-wrap justify-center">
            {lessons.map((lesson, index) => (
              <Button
                key={index}
                onClick={() => {
                  setSelectedLesson(index);
                  setExpandedPattern(null);
                }}
                variant={selectedLesson === index ? "default" : "outline"}
                className={`font-bold font-japanese ${
                  selectedLesson === index
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }`}
              >
                Bài {lesson.lesson}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Lesson Info */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 font-japanese">
              Bài {currentLesson.lesson}
            </h2>
            <span className="text-gray-600 font-japanese">
              {currentLesson.grammar.length} mẫu ngữ pháp
            </span>
          </div>
        </div>

        {/* Grammar Patterns List */}
        <div className="space-y-6">
          {currentLesson.grammar.map((pattern, index) => (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-white shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Pattern Header - Always Visible */}
                <div className="p-6 border-b border-gray-100">
                  {/* Pattern Number */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      {/* Pattern */}
                      <h3 className="text-3xl font-bold text-red-600 mb-3 font-japanese-serif leading-tight">
                        {pattern.pattern}
                      </h3>

                      {/* Usage */}
                      <div className="mb-3">
                        <span className="text-sm text-gray-500 font-medium font-japanese">
                          Cấu trúc:{" "}
                        </span>
                        <span className="text-lg font-bold text-gray-900 font-japanese">
                          {pattern.usage}
                        </span>
                      </div>

                      {/* Meaning */}
                      <div className="mb-2">
                        <span className="text-sm text-gray-500 font-medium font-japanese">
                          Nghĩa:{" "}
                        </span>
                        <span className="text-xl font-bold text-green-700 font-japanese">
                          {pattern.meaning}
                        </span>
                      </div>

                      {/* Description */}
                      {pattern.description && (
                        <p className="text-base text-gray-700 font-japanese mt-2 bg-blue-50 p-3 rounded">
                          {pattern.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => togglePattern(pattern.id)}
                    className="w-full mt-4 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2 transition-colors font-japanese text-gray-700"
                  >
                    {expandedPattern === pattern.id ? (
                      <>
                        <ChevronUp className="w-5 h-5" />
                        Ẩn ví dụ
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5" />
                        Xem {pattern.examples.length} ví dụ
                      </>
                    )}
                  </button>
                </div>

                {/* Examples - Expandable */}
                {expandedPattern === pattern.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-50"
                  >
                    <div className="p-6 space-y-4">
                      {pattern.examples.map((example) => (
                        <div
                          key={example.index}
                          className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {example.index}
                            </span>
                            <div className="flex-1 space-y-3">
                              {/* Japanese */}
                              <div>
                                <p className="text-sm text-gray-500 font-medium mb-1 font-japanese">
                                  🇯🇵 Tiếng Nhật:
                                </p>
                                <p className="text-xl font-bold text-gray-900 leading-relaxed font-japanese-serif">
                                  {example.jp}
                                </p>
                              </div>

                              {/* Vietnamese */}
                              <div>
                                <p className="text-sm text-gray-500 font-medium mb-1 font-japanese">
                                  🇻🇳 Tiếng Việt:
                                </p>
                                <p className="text-lg text-gray-700 font-japanese leading-relaxed">
                                  {example.vi}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-green-600 mb-1 font-japanese-serif">
              {lessons.length}
            </p>
            <p className="text-sm text-gray-600 font-japanese">Bài học</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-red-600 mb-1 font-japanese-serif">
              {currentLesson.grammar.length}
            </p>
            <p className="text-sm text-gray-600 font-japanese">Mẫu ngữ pháp</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1 font-japanese-serif">
              {currentLesson.grammar.reduce(
                (sum, p) => sum + p.examples.length,
                0,
              )}
            </p>
            <p className="text-sm text-gray-600 font-japanese">Ví dụ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
