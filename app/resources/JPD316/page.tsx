"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import kotobaData from "./vocabulary/kotoba.json";
import kanjiData from "./kanji/kanji.json";
import grammarData from "./grammar/gramar.json";

export default function JPD316Page() {
  const vocabularyCount = kotobaData.length;
  const kanjiCount = kanjiData.length;
  const grammarCount = grammarData.lessons.reduce(
    (sum: number, lesson: any) => sum + lesson.grammar.length,
    0,
  );

  const categories = [
    {
      id: 1,
      title: "語彙",
      subtitle: "Từ Vựng",
      description: "Tổng hợp từ vựng theo chủ đề và bài học",
      icon: "🌸",
      color: "sakura",
      bgColor: "bg-gradient-to-br from-pink-100 to-pink-50",
      borderColor: "border-pink-400",
      textColor: "text-pink-600",
      iconBg: "bg-gradient-to-br from-pink-400 to-pink-500",
      items: `${vocabularyCount} từ vựng`,
      link: "/resources/JPD316/vocabulary",
    },
    {
      id: 2,
      title: "文法",
      subtitle: "Ngữ Pháp",
      description: "Các mẫu câu và cấu trúc ngữ pháp tiếng Nhật",
      icon: "🌺",
      color: "sakura",
      bgColor: "bg-gradient-to-br from-pink-100 to-rose-50",
      borderColor: "border-rose-400",
      textColor: "text-rose-600",
      iconBg: "bg-gradient-to-br from-rose-400 to-rose-500",
      items: `${grammarCount} mẫu ngữ pháp`,
      link: "/resources/JPD316/grammar",
    },
    {
      id: 3,
      title: "漢字",
      subtitle: "Chữ Hán",
      description: "Học và luyện tập các chữ Kanji cơ bản",
      icon: "🌷",
      color: "sakura",
      bgColor: "bg-gradient-to-br from-red-100 to-pink-50",
      borderColor: "border-red-400",
      textColor: "text-red-600",
      iconBg: "bg-gradient-to-br from-red-400 to-red-500",
      items: `${kanjiCount} chữ Kanji`,
      link: "/resources/JPD316/kanji",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 py-12 px-4 relative overflow-hidden">
      {/* Floating cherry blossoms animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-[float_10s_ease-in-out_infinite]">
          🌸
        </div>
        <div className="absolute top-20 right-20 text-3xl animate-[float_15s_ease-in-out_infinite_2s]">
          🌸
        </div>
        <div className="absolute top-40 left-1/4 text-5xl animate-[float_12s_ease-in-out_infinite_4s]">
          🌸
        </div>
        <div className="absolute top-60 right-1/3 text-3xl animate-[float_18s_ease-in-out_infinite_6s]">
          🌸
        </div>
        <div className="absolute bottom-40 left-1/3 text-4xl animate-[float_14s_ease-in-out_infinite_8s]">
          🌸
        </div>
        <div className="absolute bottom-20 right-1/4 text-5xl animate-[float_16s_ease-in-out_infinite_3s]">
          🌸
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <Link href="/resources">
            <Button
              variant="outline"
              className="gap-2 bg-white/90 backdrop-blur border-pink-300 hover:border-pink-500 hover:bg-pink-50 shadow-md font-japanese"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Tài nguyên
            </Button>
          </Link>
        </motion.div>

        {/* Header - Cherry Blossom Style */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-center"
        >
          <div className="inline-block relative">
            {/* Cherry blossom decorative circles */}
            <div className="absolute -top-10 -left-10 text-6xl opacity-30 animate-pulse">
              🌸
            </div>
            <div className="absolute -top-10 -right-10 text-6xl opacity-30 animate-pulse delay-1000">
              🌸
            </div>
            <div className="absolute -bottom-10 left-1/4 text-5xl opacity-20 animate-pulse delay-2000">
              🌸
            </div>
            <div className="absolute -bottom-10 right-1/4 text-5xl opacity-20 animate-pulse delay-3000">
              🌸
            </div>

            {/* Main header card */}
            <div className="relative bg-white/95 backdrop-blur border-4 border-pink-400 rounded-3xl px-12 py-8 shadow-2xl">
              {/* Cherry blossom decoration top */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-3">
                <span className="text-4xl">🌸</span>
                <span className="text-5xl">🌸</span>
                <span className="text-4xl">🌸</span>
              </div>

              {/* Cherry blossom seal stamp */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white rotate-12">
                <span className="text-5xl">🌸</span>
              </div>

              {/* Title */}
              <div className="mb-4">
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-4xl">🌸</span>
                  <h1 className="text-6xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent mb-0 font-japanese-serif tracking-wider">
                    日本語 JPD316
                  </h1>
                  <span className="text-4xl">🌸</span>
                </div>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
                  <div className="px-4 py-1 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full">
                    <span className="text-sm font-bold font-japanese">
                      🌸 教材 🌸
                    </span>
                  </div>
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
                </div>
                <p className="text-lg text-gray-700 font-medium font-japanese">
                  Giáo trình Tiếng Nhật Trung Cấp
                </p>
              </div>

              {/* Subtitle */}
              <div className="mt-6 inline-block bg-pink-50 px-6 py-2 rounded-full border-2 border-pink-300">
                <p className="text-base text-gray-700 font-japanese font-semibold">
                  🌸 Chọn danh mục để bắt đầu học tập 🌸
                </p>
              </div>

              {/* Bottom cherry blossoms */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                <span className="text-3xl">🌸</span>
                <span className="text-2xl">🌸</span>
                <span className="text-3xl">🌸</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid - Cherry Blossom Style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link href={category.link}>
                <Card
                  className={`h-full border-4 ${category.borderColor} bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-visible rounded-3xl`}
                >
                  {/* Number badge in corner */}
                  <div
                    className={`absolute -top-3 -right-3 w-14 h-14 ${category.iconBg} rounded-full flex items-center justify-center shadow-xl border-4 border-white font-black text-white text-xl z-10 group-hover:scale-110 transition-transform`}
                  >
                    {index + 1}
                  </div>

                  <CardHeader className="text-center pt-10 pb-3 px-6">
                    {/* Icon with background */}
                    <motion.div
                      className="mb-5 flex justify-center"
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div
                        className={`relative p-8 ${category.iconBg} rounded-full shadow-xl border-4 border-white`}
                      >
                        <span className="text-7xl">{category.icon}</span>
                        {/* Glow effect */}
                        <div
                          className={`absolute inset-0 ${category.iconBg} rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}
                        ></div>
                      </div>
                    </motion.div>

                    {/* Japanese Title */}
                    <CardTitle
                      className={`text-5xl font-black mb-2 ${category.textColor} font-japanese-serif tracking-tight`}
                    >
                      {category.title}
                    </CardTitle>

                    {/* Vietnamese Subtitle with underline */}
                    <div className="mb-4">
                      <div className="inline-block">
                        <p className="text-xl font-bold text-gray-800 mb-1 font-japanese">
                          {category.subtitle}
                        </p>
                        <div
                          className={`h-1 w-full ${category.iconBg} rounded-full`}
                        ></div>
                      </div>
                    </div>

                    {/* Description */}
                    <CardDescription className="text-sm text-gray-600 font-japanese leading-relaxed px-2">
                      {category.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-center pb-6 px-6">
                    {/* Stats with better design */}
                    <div
                      className={`py-3 px-5 ${category.bgColor} rounded-2xl mb-4 border-2 ${category.borderColor} shadow-sm group-hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <span
                          className={`text-base font-bold ${category.textColor} font-japanese`}
                        >
                          {category.items}
                        </span>
                      </div>
                    </div>

                    {/* Button with better styling */}
                    <Button
                      className={`w-full ${category.iconBg} hover:opacity-90 text-white font-bold py-6 text-base font-japanese rounded-2xl shadow-lg group-hover:shadow-xl transition-all border-2 border-white/20`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-xl">{category.icon}</span>
                        <span>Bắt đầu học</span>
                      </span>
                    </Button>
                  </CardContent>

                  {/* Bottom accent stripe */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1.5 ${category.iconBg} rounded-b-3xl`}
                  ></div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section - Cherry Blossom Style */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 border-4 border-pink-300 relative overflow-hidden"
        >
          {/* Cherry blossom background decoration */}
          <div className="absolute top-5 right-10 text-7xl opacity-10">🌸</div>
          <div className="absolute bottom-10 left-10 text-8xl opacity-10">
            🌸
          </div>
          <div className="absolute top-1/2 right-1/4 text-6xl opacity-5">
            🌸
          </div>

          <div className="relative">
            {/* Header with Cherry Blossom style */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-5xl">🌸</span>
              <h2 className="text-3xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent font-japanese-serif">
                教材について
              </h2>
              <span className="text-5xl">🌸</span>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 mb-4 border-2 border-pink-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-japanese text-center">
                🌸 Về giáo trình JPD316 🌸
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div className="bg-gradient-to-r from-pink-100 to-transparent p-5 rounded-xl border-l-4 border-pink-400">
                <p className="font-japanese leading-relaxed">
                  <span className="font-bold text-pink-600">🌸 Cấp độ:</span>{" "}
                  Trung cấp (N4-N3)
                </p>
              </div>
              <div className="bg-gradient-to-r from-rose-100 to-transparent p-5 rounded-xl border-l-4 border-rose-400">
                <p className="font-japanese leading-relaxed">
                  <span className="font-bold text-rose-600">🌺 Nội dung:</span>{" "}
                  Từ vựng, Ngữ pháp, Kanji
                </p>
              </div>
              <div className="bg-gradient-to-r from-red-100 to-transparent p-5 rounded-xl border-l-4 border-red-400">
                <p className="font-japanese leading-relaxed">
                  <span className="font-bold text-red-600">
                    🌷 Phương pháp:
                  </span>{" "}
                  Học theo chủ đề thực tế
                </p>
              </div>
              <div className="bg-gradient-to-r from-pink-100 to-transparent p-5 rounded-xl border-l-4 border-pink-400">
                <p className="font-japanese leading-relaxed">
                  <span className="font-bold text-pink-600">🌸 Mục tiêu:</span>{" "}
                  Giao tiếp và đọc hiểu cơ bản
                </p>
              </div>
            </div>

            {/* Cherry Blossom-style bottom seal */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-100 to-rose-100 px-6 py-3 rounded-full border-2 border-pink-300 shadow-md">
                <span className="text-3xl">🌸</span>
                <span className="font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent font-japanese text-lg">
                  がんばってください！
                </span>
                <span className="text-3xl">🌸</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
