"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Library,
  FolderOpen,
  GraduationCap,
} from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            <GraduationCap className="w-7 h-7" />
            Learning Hub
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all hover:scale-110"
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </Link>
            <Link
              href="/resources"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all hover:scale-110"
            >
              <Library className="w-4 h-4" />
              Tài nguyên
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all hover:scale-110"
            >
              <BookOpen className="w-4 h-4" />
              Khóa học
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all hover:scale-110"
            >
              <FolderOpen className="w-4 h-4" />
              Giới thiệu
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
