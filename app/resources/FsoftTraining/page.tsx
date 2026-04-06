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
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";
import kotobaData from "./vocabulary/kotoba.json";
import kanjiData from "./kanji/kanji.json";
import grammarData from "./grammar/gramar.json";

export default function FsoftTrainingPage() {
  const { user, loading } = useAuth();

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
  const vocabularyCount = kotobaData.length;
  const kanjiCount = kanjiData.lessons.reduce(
    (sum: number, lesson: any) => sum + lesson.kanji.length,
    0,
  );
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
      icon: "📚",
      color: "fsoft",
      bgColor: "bg-gradient-to-br from-orange-100 to-orange-50",
      borderColor: "border-orange-400",
      textColor: "text-orange-600",
      iconBg: "bg-gradient-to-br from-orange-400 to-orange-500",
      items: `${vocabularyCount} từ vựng`,
      link: "/resources/FsoftTraining/vocabulary",
    },
    {
      id: 2,
      title: "文法",
      subtitle: "Ngữ Pháp",
      description: "Các mẫu câu và cấu trúc ngữ pháp tiếng Nhật",
      icon: "📖",
      color: "fsoft",
      bgColor: "bg-gradient-to-br from-amber-100 to-orange-50",
      borderColor: "border-amber-400",
      textColor: "text-amber-600",
      iconBg: "bg-gradient-to-br from-amber-400 to-amber-500",
      items: `${grammarCount} mẫu ngữ pháp`,
      link: "/resources/FsoftTraining/grammar",
    },
    {
      id: 3,
      title: "漢字",
      subtitle: "Chữ Hán",
      description: "Học và luyện tập các chữ Kanji cơ bản",
      icon: "✍️",
      color: "fsoft",
      bgColor: "bg-gradient-to-br from-yellow-100 to-orange-50",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-600",
      iconBg: "bg-gradient-to-br from-yellow-500 to-orange-500",
      items: `${kanjiCount} chữ Kanji`,
      link: "/resources/FsoftTraining/kanji",
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <Link href="/resources">
            <Button
              variant="outline"
              className="gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur border-orange-300 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700 shadow-md font-japanese"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Tài nguyên
            </Button>
          </Link>
        </motion.div>

        {/* Header - FPT Style */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-center"
        >
          <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur border-4 border-orange-400 dark:border-orange-700 rounded-3xl px-12 py-8 shadow-2xl">
            {/* FPT Logo Style Badge */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
              <span className="text-4xl font-bold text-white">FPT</span>
            </div>

            {/* Title */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-4xl">📚</span>
                <h1 className="text-6xl font-black bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-0 font-japanese-serif tracking-wider">
                  FPT Software Training
                </h1>
                <span className="text-4xl">📚</span>
              </div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-orange-400 to-transparent"></div>
                <div className="px-4 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full">
                  <span className="text-sm font-bold font-japanese">
                    🌟 Giáo trình tiếng Nhật 🌟
                  </span>
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium font-japanese">
                Language Training Institute - FPT Software
              </p>
            </div>

            {/* Subtitle */}
            <div className="mt-6 inline-block bg-orange-50 dark:bg-gray-700 px-6 py-2 rounded-full border-2 border-orange-300 dark:border-orange-700">
              <p className="text-base text-gray-700 dark:text-gray-300 font-japanese font-semibold">
                📖 Chọn danh mục để bắt đầu học tập 📖
              </p>
            </div>
          </div>
        </motion.div>

        {/* Categories Grid - FPT Style */}
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
                  className={`h-full border-4 ${category.borderColor} bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-visible rounded-3xl`}
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

        {/* Info Section - FPT Style */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 border-4 border-orange-300 relative overflow-hidden"
        >
          <div className="relative">
            {/* Header with FPT style */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-5xl">📚</span>
              <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent font-japanese-serif">
                教材について
              </h2>
              <span className="text-5xl">📚</span>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 mb-4 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-gray-800 mb-3 font-japanese text-center">
                📖 Về giáo trình FPT Software Training 📖
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div className="bg-gradient-to-r from-green-100 to-transparent p-5 rounded-xl border-l-4 border-green-400">
                <p className="font-japanese leading-relaxed">
                  <span className="font-bold text-green-600">📚 Cấp độ:</span>{" "}
                  Trung cấp N3
                </p>
              </div>
              <div className="bg-gradient-to-r from-emerald-100 to-transparent p-5 rounded-xl border-l-4 border-emerald-400">
                <p className="font-japanese leading-relaxed">
                  <span className="font-bold text-emerald-600">
                    📖 Nội dung:
                  </span>{" "}
                  Từ vựng, Ngữ pháp, Kanji
                </p>
              </div>
              <div className="bg-gradient-to-r from-teal-100 to-transparent p-5 rounded-xl border-l-4 border-teal-400">
                <p className="font-japanese leading-relaxed">
                  <span className="font-bold text-teal-600">
                    ✍️ Phương pháp:
                  </span>{" "}
                  Học theo chủ đề thực tế
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-transparent p-5 rounded-xl border-l-4 border-green-400">
                <p className="font-japanese leading-relaxed">
                  <span className="font-bold text-green-600">🌟 Mục tiêu:</span>{" "}
                  Giao tiếp và đọc hiểu cơ bản
                </p>
              </div>
            </div>

            {/* FPT-style bottom seal */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 to-amber-100 px-6 py-3 rounded-full border-2 border-orange-300 shadow-md">
                <span className="text-3xl">📚</span>
                <span className="font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent font-japanese text-lg">
                  がんばってください！
                </span>
                <span className="text-3xl">📚</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
