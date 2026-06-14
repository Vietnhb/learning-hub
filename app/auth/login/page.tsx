"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, Loader2, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCooldown } from "@/hooks/useCooldown";
import { getAuthRedirectUrls, getSafeRedirectPath } from "@/lib/auth-config";
import { getUserSafeError } from "@/lib/errorHandler";
import { validateEmail, validatePassword } from "@/lib/validation";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { DotPatternBackground } from "@/components/DotPatternBackground";
import { Button } from "@/components/ui/button";

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
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        if (signInError.message.includes("Email not confirmed")) {
          setNeedsVerification(true);
          setError(
            "Email chưa được xác nhận. Vui lòng kiểm tra email của bạn.",
          );
        } else if (signInError.message.includes("Invalid login credentials")) {
          setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
        } else if (signInError.message.includes("Email not found")) {
          setError(
            "Email này chưa được đăng ký. Vui lòng đăng ký tài khoản mới.",
          );
        } else {
          setError(getUserSafeError(signInError));
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
        setError(
          "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
        );
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(getUserSafeError(err));
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
      setError(getUserSafeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#09090b]">
      {/* Cột trái: Pattern Background — ~55% width như Notra */}
      <div className="hidden lg:block lg:w-[55%] h-full flex-shrink-0">
        <DotPatternBackground />
      </div>

      {/* Cột phải: Form — ~45% width */}
      <div className="flex w-full flex-col justify-center overflow-y-auto px-4 py-12 sm:px-6 lg:w-[45%] lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto w-full max-w-[360px]"
        >
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Chào mừng trở lại
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-1 gap-3">
              <GoogleAuthButton
                disabled={loading}
                redirectPath={redirectPath}
                onError={setError}
              />
            </div>

            <div className="relative mt-6 flex items-center py-5">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              <span className="mx-4 flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 uppercase">HOẶC</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400"
                  placeholder="Email"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400"
                  placeholder="Mật khẩu"
                  required
                />
              </div>

              {error && (
                <div className="rounded-md border border-red-200/50 bg-red-50/50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p>{error}</p>
                    {needsVerification && (
                      <Button
                        onClick={handleResendVerification}
                        disabled={loading || isActive}
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-red-600 dark:text-red-400 underline mt-1"
                      >
                        {loading ? "Đang gửi..." : isActive ? `Đợi ${secondsLeft}s` : "Gửi lại email xác nhận"}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-9 w-full rounded-md bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#7c3aed] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#8b5cf6]/50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tiếp tục"}
              </Button>
            </form>

            <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/auth/forgot-password"
                className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline underline-offset-4"
              >
                Quên mật khẩu? Lấy lại mật khẩu
              </Link>
              <Link
                href="/auth/signup"
                className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline underline-offset-4"
              >
                Chưa có tài khoản? Đăng ký
              </Link>
            </div>
            
            <div className="mt-12 text-center text-xs text-gray-400 dark:text-gray-500">
              Bằng việc tiếp tục, bạn đồng ý với <Link href="#" className="underline hover:text-gray-900 dark:hover:text-gray-300">Điều khoản dịch vụ</Link> và <Link href="#" className="underline hover:text-gray-900 dark:hover:text-gray-300">Chính sách bảo mật</Link> của chúng tôi.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-slate-50 dark:bg-gray-900" />}
    >
      <LoginPageContent />
    </Suspense>
  );
}
