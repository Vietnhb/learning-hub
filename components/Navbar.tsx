"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Library,
  FolderOpen,
  GraduationCap,
  User,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

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

            {/* Auth Section */}
            <div className="ml-4 pl-4 border-l border-gray-300">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-sm hover:text-pink-600 transition-colors"
                  >
                    <User className="w-4 h-4 text-pink-600" />
                    <span className="text-gray-700 font-medium hover:text-pink-600">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </Link>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="gap-1 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 hover:bg-pink-50 hover:border-pink-300 hover:text-pink-600"
                  >
                    <LogIn className="w-4 h-4" />
                    Đăng nhập
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
