"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <Link href="/resources/FsoftTraining">
            <Button
              variant="outline"
              className="gap-2 bg-white/90 backdrop-blur border-orange-300 hover:border-orange-500 hover:bg-orange-50 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại FPT Software Training
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 text-center"
        >
          <div className="bg-white/95 backdrop-blur border-4 border-orange-400 rounded-3xl px-12 py-8 shadow-2xl">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-5xl">✍️</span>
              <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                漢字 - Chữ Hán
              </h1>
              <span className="text-5xl">✍️</span>
            </div>
            <p className="text-lg text-gray-700">
              FPT Software Training - Học chữ Kanji theo chủ đề
            </p>
          </div>
        </motion.div>

        {/* Lesson Selector */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
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
                    className={
                      selectedLesson === index
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-2 border-orange-400"
                        : "border-2 border-orange-300 hover:border-orange-400"
                    }
                  >
                    <span className="font-bold">Bài {lesson.id}:</span>{" "}
                    {lesson.title} ({lesson.kanji.length} chữ)
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Lesson Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedLesson}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-orange-600 mb-2">
                📖 Bài {currentLesson.id}: {currentLesson.title}
              </h2>
              <p className="text-gray-600">
                Có {currentLesson.kanji.length} chữ Kanji trong bài này
              </p>
            </div>

            {/* Kanji Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentLesson.kanji.map((kanji, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-4 border-orange-300 hover:border-orange-500 transition-all hover:shadow-2xl bg-white/95">
                    <CardHeader className="text-center bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200">
                      <div className="text-8xl font-bold text-orange-600 mb-4">
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Info */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border-2 border-orange-300"
        >
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
        </motion.div>
      </div>
    </div>
  );
}
