"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { completeUserProfile, isProfileComplete } from "@/lib/userService";
import { validateUserProfile } from "@/lib/validation";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (!authLoading && user) {
        // Kiểm tra xem profile đã hoàn thiện chưa
        const isComplete = await isProfileComplete(user.id);
        if (isComplete) {
          // Nếu đã hoàn thiện, redirect về home
          router.push("/");
        } else {
          // Pre-fill email và full_name nếu có từ metadata
          if (user.user_metadata?.full_name) {
            setFullName(user.user_metadata.full_name);
          }
        }
      }
      setChecking(false);
    };

    if (!authLoading) {
      checkProfile();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    // Validate
    const validation = validateUserProfile({
      full_name: fullName,
      date_of_birth: dateOfBirth,
    });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const result = await completeUserProfile(user!.id, {
        full_name: fullName,
        date_of_birth: dateOfBirth,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Success - redirect to home
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setGeneralError(err.message || "Cập nhật thông tin thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="border shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Hoàn thiện thông tin
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Vui lòng cung cấp thông tin để hoàn tất đăng ký
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email (Read-only) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.full_name
                        ? "border-red-300 dark:border-red-700 focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    }`}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                {errors.full_name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.full_name}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.date_of_birth
                        ? "border-red-300 dark:border-red-700 focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    }`}
                    required
                  />
                </div>
                {errors.date_of_birth && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.date_of_birth}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Bạn phải từ 13 tuổi trở lên
                </p>
              </div>

              {/* General Error */}
              {generalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{generalError}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold shadow-md transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Hoàn thành
                  </>
                )}
              </Button>
            </form>

            {/* Info Note */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                ℹ️ Thông tin này sẽ được sử dụng để cá nhân hóa trải nghiệm học
                tập của bạn.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
