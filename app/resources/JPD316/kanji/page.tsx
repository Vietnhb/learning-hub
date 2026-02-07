"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  ArrowLeft,
  BookOpen,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import kanjiData from "./kanji.json";

interface KanjiCard {
  term: string;
  definition: string;
  image: string | null;
}

interface Lesson {
  lesson: number;
  kanji: KanjiCard[];
}

interface KanjiData {
  series: string;
  lessons: Lesson[];
}

export default function KanjiPage() {
  const [selectedLesson, setSelectedLesson] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const data: KanjiData = kanjiData;
  const lessons = data.lessons;
  const cards = lessons[selectedLesson].kanji;
  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCurrentCard = () => {
    const cardElement = cardRefs.current[currentIndex];
    if (cardElement) {
      const offset = 100;
      const elementPosition = cardElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    // Note: Shuffle functionality removed as it conflicts with lesson-based organization
    // Cards are now organized by lessons
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleLessonChange = (lessonIndex: number) => {
    setSelectedLesson(lessonIndex);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="min-h-screen bg-japan-cream bg-seigaiha py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/resources/JPD316">
            <Button
              variant="outline"
              className="gap-2 shadow-md hover:shadow-lg transition-shadow bg-white border-japan-red hover:border-japan-red hover:bg-japan-cream font-japanese"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              title="Bắt đầu lại"
              className="shadow-md hover:shadow-lg transition-all bg-white border-japan-red hover:bg-japan-cream"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Lesson Selector */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-md border-2 border-japan-red/20">
          <div className="flex gap-2 flex-wrap justify-center">
            {lessons.map((lesson, index) => (
              <Button
                key={index}
                onClick={() => handleLessonChange(index)}
                variant={selectedLesson === index ? "default" : "outline"}
                className={`font-bold font-japanese ${
                  selectedLesson === index
                    ? "bg-japan-red hover:bg-japan-red text-white"
                    : "border-japan-red text-japan-red hover:bg-japan-cream"
                }`}
              >
                Bài {lesson.lesson}
              </Button>
            ))}
          </div>
        </div>

        {/* Title with Japanese aesthetic */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6 relative"
        >
          <div className="inline-block relative">
            {/* Japanese stamp/seal style background */}
            <div className="absolute inset-0 bg-japan-red opacity-10 rounded-full blur-2xl"></div>
            <div className="relative bg-white border-4 border-japan-red rounded-2xl px-8 py-6 shadow-2xl">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-12 h-12 bg-japan-red rounded-full flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-5xl font-black font-japanese-serif text-japan-charcoal tracking-wider">
                  漢字 JPD316
                </h1>
                <div className="w-12 h-12 bg-japan-red rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">日</span>
                </div>
              </div>
              <p className="text-lg text-japan-red font-bold font-japanese mb-1">
                Bài {lessons[selectedLesson].lesson}
              </p>
              <p className="text-base text-japan-charcoal font-medium font-japanese">
                Chữ số {currentIndex + 1} / {cards.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar - Traditional Japanese style */}
        <div className="w-full bg-white rounded-full h-4 mb-8 shadow-inner border-2 border-japan-red/20">
          <motion.div
            className="bg-gradient-to-r from-japan-red to-japan-gold h-full rounded-full shadow-md relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-seigaiha opacity-20"></div>
          </motion.div>
        </div>

        {/* Flashcard - Washi paper style */}
        <div className="mb-10 perspective-1000">
          <motion.div
            className="relative w-full h-[500px] cursor-pointer"
            onClick={handleFlip}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex + (isFlipped ? "-back" : "-front")}
                initial={{ rotateY: isFlipped ? -180 : 0, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: isFlipped ? 180 : -180, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="w-full h-full flex flex-col items-center justify-center p-12 bg-white shadow-2xl hover:shadow-3xl transition-shadow border-4 border-japan-red relative overflow-hidden">
                  {/* Washi paper texture overlay */}
                  <div className="absolute inset-0 bg-seigaiha opacity-5"></div>
                  <div className="absolute top-4 right-4 w-16 h-16 bg-japan-red rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold font-japanese-serif text-2xl">
                      日
                    </span>
                  </div>

                  {!isFlipped ? (
                    // Front - Kanji character with traditional styling
                    <div className="text-center space-y-8 relative z-10">
                      {currentCard.image && (
                        <div className="relative w-56 h-56 mx-auto mb-6 rounded-lg overflow-hidden shadow-xl border-4 border-japan-gold/30">
                          <Image
                            src={currentCard.image}
                            alt={currentCard.term}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="relative">
                        <div className="absolute inset-0 bg-japan-red/5 blur-3xl"></div>
                        <h2 className="text-9xl font-black font-japanese-serif text-japan-charcoal leading-none relative">
                          {currentCard.term}
                        </h2>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-japan-red mt-8">
                        <div className="w-2 h-2 bg-japan-red rounded-full animate-pulse"></div>
                        <p className="text-lg font-medium font-japanese">
                          Nhấn để xem nghĩa và cách đọc
                        </p>
                        <div className="w-2 h-2 bg-japan-red rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ) : (
                    // Back - Reading and meaning with traditional style
                    <div className="text-center space-y-8 relative z-10">
                      {currentCard.image && (
                        <div className="relative w-56 h-56 mx-auto mb-6 rounded-lg overflow-hidden shadow-xl border-4 border-japan-gold/30">
                          <Image
                            src={currentCard.image}
                            alt={currentCard.term}
                            fill
                            className="object-cover opacity-30"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="bg-japan-cream border-4 border-japan-gold rounded-2xl p-8 shadow-inner">
                        <h2 className="text-4xl font-bold text-japan-red leading-relaxed font-japanese mb-6">
                          {currentCard.definition}
                        </h2>
                        <div className="pt-6 border-t-2 border-japan-gold/50">
                          <p className="text-7xl text-japan-charcoal font-black font-japanese-serif">
                            {currentCard.term}
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t-2 border-gray-200">
                        <p className="text-6xl text-gray-700 font-bold">
                          {currentCard.term}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-10">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            size="lg"
            variant="outline"
            className="gap-2 px-6 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
            Trước
          </Button>

          <div className="text-center bg-white px-6 py-3 rounded-lg shadow-md">
            <p className="text-base font-semibold text-gray-700">
              {isFlipped ? "📖 Nghĩa và Cách đọc" : "🇯🇵 Chữ Kanji"}
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            size="lg"
            variant="outline"
            className="gap-2 px-6 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            Sau
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Keyboard Hints */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md">
            <span className="text-2xl">💡</span>
            <p className="text-base font-medium text-gray-700">
              Nhấn vào thẻ để lật • Dùng nút mũi tên để chuyển thẻ
            </p>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-6 mb-16"
        >
          <Card className="p-6 text-center bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-4xl font-bold text-red-600 mb-2">
              {cards.length}
            </p>
            <p className="text-base font-semibold text-gray-700">Tổng chữ</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-4xl font-bold text-green-600 mb-2">
              {currentIndex + 1}
            </p>
            <p className="text-base font-semibold text-gray-700">Đang học</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-4xl font-bold text-orange-600 mb-2">
              {cards.length - currentIndex - 1}
            </p>
            <p className="text-base font-semibold text-gray-700">Còn lại</p>
          </Card>
        </motion.div>

        {/* Divider */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 px-6 py-2 text-xl font-bold text-gray-700 rounded-full shadow-md">
              📖 Danh sách đầy đủ
            </span>
          </div>
        </div>

        {/* Kanji List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              📚 Danh sách Kanji
            </h2>
            <span className="text-lg font-semibold text-gray-600 bg-white px-4 py-2 rounded-lg shadow-md">
              {cards.length} chữ
            </span>
          </div>

          <div className="space-y-4">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.005 }}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsFlipped(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Card
                  className={`p-6 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 ${
                    index === currentIndex
                      ? "border-3 border-red-500 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg"
                      : "border border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Number Badge */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${
                        index === currentIndex
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Kanji Character */}
                    <div className="flex-shrink-0 w-28 h-28 flex items-center justify-center bg-white rounded-xl shadow-lg border-2 border-gray-200">
                      <span className="text-6xl font-bold text-gray-900">
                        {card.term}
                      </span>
                    </div>

                    {/* Image (if available) */}
                    {card.image && (
                      <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                        <Image
                          src={card.image}
                          alt={card.term}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xl text-gray-700 font-medium leading-relaxed">
                        {card.definition}
                      </p>
                    </div>

                    {/* Arrow Indicator */}
                    {index === currentIndex && (
                      <div className="flex-shrink-0">
                        <div className="bg-red-500 text-white p-2 rounded-full">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating scroll to current card button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={scrollToCurrentCard}
              size="lg"
              className="rounded-full w-16 h-16 shadow-2xl bg-red-500 hover:bg-red-600 border-4 border-white group relative"
              title="Cuộn đến kanji đang học"
            >
              <ArrowDown className="w-7 h-7 text-white animate-bounce" />
              <span className="absolute -top-12 right-0 bg-japan-charcoal text-white px-3 py-1 rounded-lg text-sm font-japanese opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                Cuộn đến kanji đang học
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
