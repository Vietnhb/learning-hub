"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthRequiredModalProps {
  show: boolean;
}

export function AuthRequiredModal({ show }: AuthRequiredModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (show && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (show && countdown === 0) {
      router.push("/auth/login");
    }
  }, [show, countdown, router]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => router.push("/resources")}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-3"
                >
                  <Lock className="w-8 h-8" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold">Yêu cầu đăng nhập</h2>
                  <p className="text-white/90 text-sm mt-1">
                    Tài nguyên được bảo vệ
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">
                    Bạn cần đăng nhập để truy cập tài nguyên này
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Chỉ tài khoản đã đăng nhập mới có thể truy cập các thư mục{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs"></code>
                  </p>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Sau khi đăng nhập, bạn có thể:
                </p>
                <ul className="space-y-1.5 ml-4">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                    Truy cập toàn bộ tài liệu học tập
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                    Lưu tiến độ học tập của bạn
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                    Sử dụng flashcard và các công cụ học tập
                  </li>
                </ul>
              </div>

              {/* Countdown timer */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Đang chuyển hướng đến trang đăng nhập trong
                </p>
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold text-pink-600 dark:text-pink-400 mt-2"
                >
                  {countdown}s
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/resources")}
              >
                Quay lại
              </Button>
              <Button
                className="flex-1 gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                onClick={() => router.push("/auth/login")}
              >
                Đăng nhập ngay
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
