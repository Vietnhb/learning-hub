"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import kanjiData from "./kanji.json";

interface KanjiExample {
  word: string;
  reading: string;
  meaning: string;
}

interface Kanji {
  character: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  examples: KanjiExample[];
}

interface Lesson {
  id: number;
  title: string;
  kanji: Kanji[];
}

export default function FsoftTrainingKanjiPage() {
  const { user, loading } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<number>(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
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

  const lessons: Lesson[] = kanjiData.lessons;
  const currentLesson = lessons[selectedLesson];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-3 py-6 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 sm:px-4 sm:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-5 sm:mb-8">
          <Link href="/resources/FsoftTraining">
            <Button
              variant="outline"
              className="h-auto min-h-10 gap-2 whitespace-normal bg-white/90 text-left backdrop-blur border-orange-300 hover:border-orange-500 hover:bg-orange-50 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại FPT Software Training
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-7 text-center sm:mb-12">
          <div className="rounded-2xl border-2 border-orange-400 bg-white/95 px-4 py-6 shadow-xl backdrop-blur sm:rounded-3xl sm:border-4 sm:px-12 sm:py-8 sm:shadow-2xl">
            <div className="mb-4 flex items-center justify-center gap-2 sm:gap-4">
              <span className="text-3xl sm:text-5xl" aria-hidden="true">✍️</span>
              <h1 className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-3xl font-black text-transparent sm:text-5xl">
                漢字 - Chữ Hán
              </h1>
              <span className="hidden text-5xl sm:inline" aria-hidden="true">✍️</span>
            </div>
            <p className="text-sm leading-6 text-gray-700 sm:text-lg">
              FPT Software Training - Học chữ Kanji theo chủ đề
            </p>
          </div>
        </div>

        {/* Lesson Selector */}
        <div className="mb-8">
          <Card className="border-2 border-orange-300 bg-white/95">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <BookOpen className="w-5 h-5" />
                Chọn bài học
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {lessons.map((lesson, index) => (
                  <Button
                    key={lesson.id}
                    variant={selectedLesson === index ? "default" : "outline"}
                    onClick={() => setSelectedLesson(index)}
                    className={`h-auto min-h-11 whitespace-normal py-2 ${
                      selectedLesson === index
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-2 border-orange-400"
                        : "border-2 border-orange-300 hover:border-orange-400"
                    }`}
                  >
                    <span className="font-bold">Bài {lesson.id}:</span>{" "}
                    {lesson.title} ({lesson.kanji.length} chữ)
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Lesson Display */}
        <div key={selectedLesson} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="mb-2 text-2xl font-bold text-orange-600 sm:text-3xl">
                📖 Bài {currentLesson.id}: {currentLesson.title}
              </h2>
              <p className="text-gray-600">
                Có {currentLesson.kanji.length} chữ Kanji trong bài này
              </p>
            </div>

            {/* Kanji Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLesson.kanji.map((kanji, index) => (
                <div key={`${kanji.character}-${index}`}>
                  <Card className="border-2 border-orange-300 bg-white/95 transition-shadow hover:border-orange-500 hover:shadow-xl sm:border-4">
                    <CardHeader className="text-center bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200">
                      <div className="mb-4 text-6xl font-bold text-orange-600 sm:text-8xl">
                        {kanji.character}
                      </div>
                      <CardTitle className="text-2xl text-gray-800">
                        {kanji.meaning}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      {/* Readings */}
                      <div className="space-y-2">
                        <div className="bg-orange-100 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 font-semibold">
                            Âm Onyomi (音読み):
                          </p>
                          <p className="text-xl font-bold text-orange-600">
                            {kanji.onyomi || "—"}
                          </p>
                        </div>
                        <div className="bg-amber-100 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 font-semibold">
                            Âm Kunyomi (訓読み):
                          </p>
                          <p className="text-xl font-bold text-amber-600">
                            {kanji.kunyomi || "—"}
                          </p>
                        </div>
                      </div>

                      {/* Examples */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700 border-b-2 border-orange-200 pb-2">
                          📚 Ví dụ:
                        </p>
                        {kanji.examples.map((example, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-r from-orange-50 to-transparent p-3 rounded-lg border-l-4 border-orange-400"
                          >
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-gray-800">
                                {example.word}
                              </span>
                              <span className="text-sm text-gray-600">
                                ({example.reading})
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {example.meaning}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-8 rounded-2xl border-2 border-orange-300 bg-white/95 p-4 shadow-xl backdrop-blur sm:mt-12 sm:p-6">
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-2">
              💡 <span className="font-bold">Lời khuyên:</span> Hãy luyện viết
              mỗi chữ Kanji nhiều lần để nhớ lâu hơn!
            </p>
            <div className="flex items-center justify-center gap-2 text-orange-600 font-bold text-xl mt-4">
              <span>✍️</span>
              <span>がんばってください！</span>
              <span>✍️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
