"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Video,
  FileText,
  Code,
  Languages,
  Brain,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl font-bold mb-6"
          >
            Quản Lý <span className="text-yellow-300">Tài Nguyên Học Tập</span>
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl mb-8 opacity-90"
          >
            Tổ chức, quản lý và truy cập tài liệu học tập của bạn một cách hiệu
            quả
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="flex gap-4 justify-center"
          >
            <Button size="lg" variant="secondary" className="group">
              Khám phá ngay
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 border-white text-white"
            >
              <Star className="mr-2 w-4 h-4" />
              Tài liệu yêu thích
            </Button>
          </motion.div>
        </motion.div>

        {/* Animated background circles */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        />
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center text-gray-900 mb-4"
          >
            Danh Mục Tài Nguyên
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-gray-600 mb-12 text-lg"
          ></motion.p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105 opacity-50">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block"
                  >
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-500">
                    Sách & Giáo trình
                  </CardTitle>
                  <CardDescription>Sẽ cập nhật trong tương lai</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-gray-400">Sắp có</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105 opacity-50">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block"
                  >
                    <Video className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-500">
                    Video Bài Giảng
                  </CardTitle>
                  <CardDescription>Sẽ cập nhật trong tương lai</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-gray-400">Sắp có</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105 opacity-50">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block"
                  >
                    <FileText className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-500">
                    Tài Liệu & Notes
                  </CardTitle>
                  <CardDescription>Sẽ cập nhật trong tương lai</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-gray-400">Sắp có</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105 border-2 border-orange-300 bg-orange-50">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block"
                  >
                    <Languages className="w-12 h-12 text-orange-500" />
                  </motion.div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    Ngoại Ngữ - JPD316
                  </CardTitle>
                  <CardDescription>
                    Giáo trình Tiếng Nhật JPD316 - Hiện đã có sẵn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-semibold text-orange-600">
                    ✓ Đang có sẵn
                  </span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105 opacity-50">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block"
                  >
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-500">
                    Sách & Giáo trình
                  </CardTitle>
                  <CardDescription>Sẽ cập nhật trong tương lai</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-gray-400">Sắp có</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105 opacity-50">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block"
                  >
                    <Video className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-500">
                    Video Bài Giảng
                  </CardTitle>
                  <CardDescription>Sẽ cập nhật trong tương lai</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-gray-400">Sắp có</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105 opacity-50">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block"
                  >
                    <FileText className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-500">
                    Tài Liệu & Notes
                  </CardTitle>
                  <CardDescription>Sẽ cập nhật trong tương lai</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-gray-400">Sắp có</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105 opacity-50">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block"
                  >
                    <Code className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-500">
                    Code & Projects
                  </CardTitle>
                  <CardDescription>Sẽ cập nhật trong tương lai</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-gray-400">Sắp có</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group hover:scale-105 opacity-50">
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4 inline-block"
                  >
                    <Brain className="w-12 h-12 text-gray-400" />
                  </motion.div>
                  <CardTitle className="group-hover:text-blue-600 transition-colors text-gray-500">
                    Kỹ Năng Mềm
                  </CardTitle>
                  <CardDescription>Sẽ cập nhật trong tương lai</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm text-gray-400">Sắp có</span>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
