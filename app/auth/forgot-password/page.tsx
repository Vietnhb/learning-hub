"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCooldown } from "@/hooks/useCooldown";
import { validateEmail } from "@/lib/validation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  AlertCircle,
  CheckCircle,
  Loader2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { secondsLeft, isActive, startCooldown } = useCooldown(
    "forgot_password",
    60,
  );

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: "https://baovietweb.site/auth/reset-password",
        },
      );

      if (resetError) {
        if (
          resetError.message.includes("User not found") ||
          resetError.message.includes("not found")
        ) {
          throw new Error("Email này chưa được đăng ký trong hệ thống.");
        }
        throw resetError;
      }

      startCooldown();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border-2 border-green-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Email đã được gửi!
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Vui lòng kiểm tra email{" "}
                <span className="font-bold text-green-600">{email}</span> để đặt
                lại mật khẩu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  📧 Email reset password đã được gửi. Vui lòng kiểm tra cả thư
                  mục spam nếu không thấy email.
                </p>
              </div>

              <Button
                onClick={handleResetRequest}
                disabled={loading || isActive}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : isActive ? (
                  `Vui lòng đợi ${secondsLeft}s để gửi lại`
                ) : (
                  "Gửi lại email"
                )}
              </Button>

              <div className="text-center pt-4">
                <Link
                  href="/auth/login"
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  ← Quay lại đăng nhập
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="border-2 border-pink-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Quên mật khẩu
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Nhập email để nhận link đặt lại mật khẩu
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleResetRequest} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none transition-colors"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || isActive}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-6 text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : isActive ? (
                  `Đợi ${secondsLeft}s để gửi lại`
                ) : (
                  "Gửi email đặt lại mật khẩu"
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                ← Quay lại đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
