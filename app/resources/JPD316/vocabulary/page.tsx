"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import vocabularyData from "./kotoba.json";

export default function VocabularyPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [cards, setCards] = useState(vocabularyData);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

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
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShuffled(true);
  };

  return (
    <div className="min-h-screen bg-japan-cream bg-seigaiha py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/resources/JPD316">
            <Button
              variant="outline"
              className="gap-2 shadow-md hover:shadow-lg transition-shadow bg-white border-japan-indigo hover:border-japan-indigo hover:bg-japan-cream font-japanese"
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
              className="shadow-md hover:shadow-lg transition-all bg-white border-japan-indigo hover:bg-japan-cream"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleShuffle}
              title="Xáo trộn"
              className="shadow-md hover:shadow-lg transition-all bg-white border-japan-indigo hover:bg-japan-cream"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
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
            <div className="absolute inset-0 bg-japan-indigo opacity-10 rounded-full blur-2xl"></div>
            <div className="relative bg-white border-4 border-japan-indigo rounded-2xl px-8 py-6 shadow-2xl">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-12 h-12 bg-japan-indigo rounded-full flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-5xl font-black font-japanese-serif text-japan-charcoal tracking-wider">
                  語彙 JPD316
                </h1>
                <div className="w-12 h-12 bg-japan-indigo rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">語</span>
                </div>
              </div>
              <p className="text-base text-japan-charcoal font-medium font-japanese">
                Từ số {currentIndex + 1} / {cards.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar - Traditional Japanese style */}
        <div className="w-full bg-white rounded-full h-4 mb-8 shadow-inner border-2 border-japan-indigo/20">
          <motion.div
            className="bg-gradient-to-r from-japan-indigo to-japan-green h-full rounded-full shadow-md relative overflow-hidden"
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
                <Card className="w-full h-full flex flex-col items-center justify-center p-12 bg-white shadow-2xl hover:shadow-3xl transition-shadow border-4 border-japan-indigo relative overflow-hidden">
                  {/* Washi paper texture overlay */}
                  <div className="absolute inset-0 bg-seigaiha opacity-5"></div>
                  <div className="absolute top-4 right-4 w-16 h-16 bg-japan-indigo rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold font-japanese-serif text-2xl">
                      語
                    </span>
                  </div>

                  {!isFlipped ? (
                    // Front - Japanese term with traditional styling
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
                        <div className="absolute inset-0 bg-japan-indigo/5 blur-3xl"></div>
                        <h2 className="text-7xl font-black font-japanese-serif text-japan-charcoal leading-tight relative">
                          {currentCard.term}
                        </h2>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-japan-indigo mt-8">
                        <div className="w-2 h-2 bg-japan-indigo rounded-full animate-pulse"></div>
                        <p className="text-lg font-medium font-japanese">
                          Nhấn để xem nghĩa tiếng Việt
                        </p>
                        <div className="w-2 h-2 bg-japan-indigo rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  ) : (
                    // Back - Vietnamese definition with traditional style
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
                      <div className="bg-japan-cream border-4 border-japan-green rounded-2xl p-8 shadow-inner">
                        <h2 className="text-5xl font-bold text-japan-green leading-relaxed font-japanese mb-6">
                          {currentCard.definition}
                        </h2>
                        <div className="pt-6 border-t-2 border-japan-gold/50">
                          <p className="text-4xl text-japan-charcoal font-bold font-japanese-serif">
                            {currentCard.term}
                          </p>
                        </div>
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
            className="gap-2 px-6 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 bg-white border-japan-indigo hover:bg-japan-cream font-japanese"
          >
            <ChevronLeft className="w-6 h-6" />
            Trước
          </Button>

          <div className="text-center bg-white px-6 py-3 rounded-lg shadow-md border-2 border-japan-gold/30">
            <p className="text-base font-semibold text-japan-charcoal font-japanese">
              {isFlipped ? "🇻🇳 Nghĩa tiếng Việt" : "🇯🇵 Từ tiếng Nhật"}
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            size="lg"
            variant="outline"
            className="gap-2 px-6 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 bg-white border-japan-indigo hover:bg-japan-cream font-japanese"
          >
            Sau
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Keyboard Hints */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md border-2 border-japan-gold/30">
            <span className="text-2xl">💡</span>
            <p className="text-base font-medium text-japan-charcoal font-japanese">
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
          <Card className="p-6 text-center bg-gradient-to-br from-japan-indigo/10 to-japan-indigo/20 border-2 border-japan-indigo shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-4xl font-bold text-japan-indigo mb-2 font-japanese-serif">
              {cards.length}
            </p>
            <p className="text-base font-semibold text-japan-charcoal font-japanese">
              Tổng từ
            </p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-2 border-japan-green shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-4xl font-bold text-japan-green mb-2 font-japanese-serif">
              {currentIndex + 1}
            </p>
            <p className="text-base font-semibold text-japan-charcoal font-japanese">
              Đang học
            </p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-japan-gold shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-4xl font-bold text-japan-gold mb-2 font-japanese-serif">
              {cards.length - currentIndex - 1}
            </p>
            <p className="text-base font-semibold text-japan-charcoal font-japanese">
              Còn lại
            </p>
          </Card>
        </motion.div>

        {/* Divider */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-japan-gold/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-japan-cream px-6 py-2 text-xl font-bold text-japan-charcoal rounded-full shadow-md border-2 border-japan-gold/30 font-japanese">
              📖 Danh sách đầy đủ
            </span>
          </div>
        </div>

        {/* Vocabulary List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-japan-charcoal font-japanese-serif">
              📚 Danh sách từ vựng
            </h2>
            <span className="text-lg font-semibold text-japan-charcoal bg-white px-4 py-2 rounded-lg shadow-md border-2 border-japan-gold/30 font-japanese">
              {cards.length} từ
            </span>
          </div>

          <div className="space-y-4">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.005 }}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsFlipped(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <Card
                  className={`p-6 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 bg-white ${
                    index === currentIndex
                      ? "border-3 border-japan-indigo bg-gradient-to-r from-japan-indigo/10 to-japan-green/10 shadow-lg"
                      : "border border-gray-200 hover:border-japan-indigo/50"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Number Badge */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md ${
                        index === currentIndex
                          ? "bg-japan-indigo text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Image */}
                    {card.image && (
                      <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border-2 border-japan-gold/30">
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
                      <h3 className="text-2xl font-bold text-japan-charcoal mb-2 leading-tight font-japanese-serif">
                        {card.term}
                      </h3>
                      <p className="text-xl text-japan-charcoal/80 font-medium font-japanese">
                        {card.definition}
                      </p>
                    </div>

                    {/* Arrow Indicator */}
                    {index === currentIndex && (
                      <div className="flex-shrink-0">
                        <div className="bg-japan-indigo text-white p-2 rounded-full">
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
    </div>
  );
}
