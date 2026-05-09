"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, Loader2, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCooldown } from "@/hooks/useCooldown";
import { getAuthRedirectUrls, getSafeRedirectPath } from "@/lib/auth-config";
import { validateEmail, validatePassword } from "@/lib/validation";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const redirectPath = getSafeRedirectPath(
    searchParams.get("redirect") || searchParams.get("next"),
  );

  const { secondsLeft, isActive, startCooldown } = useCooldown(
    "login_resend",
    60,
  );

  useEffect(() => {
    const authError = searchParams.get("error");

    if (authError === "banned") {
      setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
    } else if (authError === "oauth_callback") {
      setError("Không thể hoàn tất đăng nhập với Google. Vui lòng thử lại.");
    } else if (authError === "callback_error") {
      setError("Không thể hoàn tất đăng nhập. Vui lòng thử lại.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setNeedsVerification(false);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Email not confirmed")) {
          setNeedsVerification(true);
          setError("Email chưa được xác nhận. Vui lòng kiểm tra email của bạn.");
        } else if (signInError.message.includes("Invalid login credentials")) {
          setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } else if (signInError.message.includes("Email not found")) {
          setError("Email này chưa được đăng ký. Vui lòng đăng ký tài khoản mới.");
        } else {
          setError(signInError.message || "Đăng nhập thất bại");
        }
        setLoading(false);
        return;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setNeedsVerification(true);
        setError("Email chưa được xác nhận. Vui lòng kiểm tra email của bạn.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      const { data: userRow } = await supabase
        .from("users")
        .select("is_banned")
        .eq("id", data.user.id)
        .single();

      if (userRow?.is_banned) {
        await supabase.auth.signOut();
        setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (isActive) return;

    setLoading(true);
    setError("");

    try {
      const { signupCallback } = getAuthRedirectUrls();

      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: signupCallback,
        },
      });

      if (resendError) throw resendError;

      startCooldown();
      setError("Email xác nhận đã được gửi lại. Vui lòng kiểm tra hộp thư.");
    } catch (err: any) {
      setError(err.message || "Gửi lại email thất bại");
    } finally {
      setLoading(false);
    }
  };

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
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Đăng nhập
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Chào mừng trở lại với Learning Hub
            </CardDescription>
          </CardHeader>

          <CardContent>
            <GoogleAuthButton
              disabled={loading}
              redirectPath={redirectPath}
              onError={setError}
            />

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
                hoặc
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="text-right">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-600">{error}</p>

                    {needsVerification && (
                      <Button
                        onClick={handleResendVerification}
                        disabled={loading || isActive}
                        variant="outline"
                        size="sm"
                        className="mt-2 w-full"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang gửi...
                          </>
                        ) : isActive ? (
                          `Đợi ${secondsLeft}s để gửi lại`
                        ) : (
                          "Gửi lại email xác nhận"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold shadow-md transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Chưa có tài khoản?{" "}
                <Link
                  href="/auth/signup"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-gray-900" />}>
      <LoginPageContent />
    </Suspense>
  );
}
