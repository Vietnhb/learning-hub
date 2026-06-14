"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCooldown } from "@/hooks/useCooldown";
import { getUserSafeError } from "@/lib/errorHandler";
import { getAuthRedirectUrls } from "@/lib/auth-config";
import {
  validateEmail,
  validatePassword,
  validateFullName,
} from "@/lib/validation";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { GithubAuthButton } from "@/components/GithubAuthButton";
import { DotPatternBackground } from "@/components/DotPatternBackground";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { secondsLeft, isActive, startCooldown } = useCooldown(
    "signup_email",
    60,
  );

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation chi tiết
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    const fullNameError = validateFullName(fullName);
    if (fullNameError) {
      setError(fullNameError);
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    try {
      // Check email tồn tại bằng cách query bảng auth.users (thông qua RPC hoặc admin API)
      // Vì RLS không cho phép query trực tiếp auth.users, ta sử dụng signInWithPassword để check
      // Nếu email đã tồn tại và chưa verify, Supabase sẽ cho phép đăng ký lại

      const { signupCallback } = getAuthRedirectUrls();

      // Đăng ký user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: signupCallback,
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        // Kiểm tra nếu user đã tồn tại nhưng chưa verify
        if (data.user.identities && data.user.identities.length === 0) {
          throw new Error("Email này đã được đăng ký nhưng chưa xác thực.");
        }

        // Bắt đầu cooldown
        startCooldown();
        setSuccess(true);
      }
    } catch (err: any) {
      setError(getUserSafeError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (isActive) return;

    setError("");
    setLoading(true);

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
      setError("");
    } catch (err: any) {
      setError(getUserSafeError(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border border-green-300 dark:border-green-700 shadow-lg dark:bg-gray-800">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Đăng ký thành công!
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Vui lòng kiểm tra email{" "}
                <span className="font-bold text-green-600">{email}</span> để xác
                nhận tài khoản.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  📧 Email xác nhận đã được gửi. Vui lòng kiểm tra cả thư mục
                  spam nếu không thấy email.
                </p>
              </div>

              <Button
                onClick={handleResendEmail}
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
                  "Gửi lại email xác nhận"
                )}
              </Button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="text-center pt-4">
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Quay lại trang đăng nhập →
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              Create an account
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Please enter your details to sign up.
            </p>
          </div>

          <div className="mt-8">
            <div className="grid grid-cols-2 gap-3">
              <GoogleAuthButton disabled={loading} onError={setError} />
              <GithubAuthButton disabled={loading} onError={setError} />
            </div>

            <div className="relative mt-6 flex items-center py-5">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
              <span className="mx-4 flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 uppercase">OR</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400"
                  placeholder="Full Name"
                  required
                />
              </div>

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
                  placeholder="Password (min 6 characters)"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400"
                  placeholder="Confirm Password"
                  required
                />
              </div>

              {error && (
                <div className="rounded-md border border-red-200/50 bg-red-50/50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-9 w-full rounded-md bg-[#8b5cf6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#7c3aed] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#8b5cf6]/50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
              </Button>
            </form>

            <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/auth/login"
                className="hover:text-gray-900 dark:hover:text-gray-100 hover:underline underline-offset-4"
              >
                Already have an account? Log in
              </Link>
            </div>
            
            <div className="mt-12 text-center text-xs text-gray-400 dark:text-gray-500">
              By continuing, you agree to our <Link href="#" className="underline hover:text-gray-900 dark:hover:text-gray-300">Terms of Service</Link> and <Link href="#" className="underline hover:text-gray-900 dark:hover:text-gray-300">Privacy Policy</Link>.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
