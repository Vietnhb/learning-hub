"use client";

import { motion } from "framer-motion";
import { Clock, Users, BookOpen, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Lập trình Web với React & Next.js",
      description:
        "Học xây dựng ứng dụng web hiện đại với React và Next.js từ cơ bản đến nâng cao",
      instructor: "Nguyễn Văn Trung",
      duration: "40 giờ",
      students: 1250,
      level: "Trung cấp",
      image: "🚀",
    },
    {
      id: 2,
      title: "Python cho Data Science",
      description:
        "Khóa học Python dành cho phân tích dữ liệu và machine learning",
      instructor: "Phùng Gia Đức",
      duration: "35 giờ",
      students: 890,
      level: "Cơ bản",
      image: "📊",
    },
    {
      id: 3,
      title: "Tiếng Nhật N5-N3",
      description:
        "Lộ trình học tiếng Nhật từ N5 đến N3 với phương pháp hiện đại",
      instructor: "みかみさん",
      duration: "60 giờ",
      students: 2100,
      level: "Cơ bản",
      image: "🇯🇵",
    },
    {
      id: 4,
      title: "UI/UX Design Fundamentals",
      description: "Thiết kế giao diện người dùng chuyên nghiệp với Figma",
      instructor: "Nguyễn Lê Hoài Phúc",
      duration: "25 giờ",
      students: 650,
      level: "Cơ bản",
      image: "🎨",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Khóa Học
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Khám phá các khóa học chất lượng cao được thiết kế cho mọi trình độ
          </p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{course.image}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">
                          {course.title}
                        </CardTitle>
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs font-medium">
                          {course.level}
                        </span>
                      </div>
                      <CardDescription>{course.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.students} học viên
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        <BookOpen className="w-4 h-4 inline mr-1" />
                        {course.instructor}
                      </span>
                      <Button size="sm" className="gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Học ngay
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
