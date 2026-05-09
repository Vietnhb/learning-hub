"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getSafeRedirectPath } from "@/lib/auth-config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getHashAuthError() {
  if (typeof window === "undefined") return null;

  const hash = window.location.hash.replace(/^#/, "");
  const hashParams = new URLSearchParams(hash);

  return hashParams.get("error_description") || hashParams.get("error");
}

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const finishGoogleSignIn = async () => {
      try {
        const redirectError =
          searchParams.get("error_description") ||
          searchParams.get("error") ||
          getHashAuthError();

        if (redirectError) {
          throw new Error(redirectError);
        }

        const code = searchParams.get("code");
        let {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session && code) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) throw exchangeError;
          session = data.session;
        }

        if (!session?.user) {
          throw new Error(
            "Không thể tạo phiên đăng nhập Google. Vui lòng thử lại.",
          );
        }

        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("id, full_name, date_of_birth, is_banned")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (userProfile?.is_banned) {
          await supabase.auth.signOut();
          router.replace("/auth/login?error=banned");
          return;
        }

        const isProfileComplete =
          userProfile?.full_name &&
          userProfile.full_name.trim() !== "" &&
          userProfile.date_of_birth;

        if (!isProfileComplete) {
          router.replace("/profile/complete");
          router.refresh();
          return;
        }

        const nextPath = getSafeRedirectPath(searchParams.get("next"));
        router.replace(nextPath);
        router.refresh();
      } catch (err: any) {
        if (!mounted) return;
        setError(
          err.message || "Không thể hoàn tất đăng nhập với Google.",
        );
      }
    };

    void finishGoogleSignIn();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-100 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="w-full max-w-md border-red-200 shadow-lg dark:border-red-800 dark:bg-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">
              Đăng nhập thất bại
            </CardTitle>
            <CardDescription className="text-base">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.replace("/auth/login")}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-6 text-lg font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700"
            >
              Quay lại đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-100 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
        <p className="text-gray-600 dark:text-gray-400">
          Đang hoàn tất đăng nhập...
        </p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900" />
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
