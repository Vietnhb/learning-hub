"use client";

import { useState } from "react";
import { Chrome, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrls, getSafeRedirectPath } from "@/lib/auth-config";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface GoogleAuthButtonProps {
  className?: string;
  disabled?: boolean;
  redirectPath?: string | null;
  onError?: (message: string) => void;
}

export function GoogleAuthButton({
  className,
  disabled,
  redirectPath,
  onError,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading) return;

    setLoading(true);
    onError?.("");

    try {
      const { oauthCallback } = getAuthRedirectUrls(
        getSafeRedirectPath(redirectPath),
      );

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: oauthCallback,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setLoading(false);
      onError?.(
        err.message || "Không thể đăng nhập với Google. Vui lòng thử lại.",
      );
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={disabled || loading}
      className={cn(
        "w-full border-gray-300 bg-white py-6 text-base font-semibold text-gray-800 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <Chrome className="mr-2 h-5 w-5 text-blue-600" />
      )}
      Continue with Google
    </Button>
  );
}
