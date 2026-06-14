"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrls, getSafeRedirectPath } from "@/lib/auth-config";
import { supabase } from "@/lib/supabase";
import { getUserSafeError } from "@/lib/errorHandler";
import { cn } from "@/lib/utils";

/**
 * Google OAuth Button Component
 *
 * ⚠️  SECURITY NOTE: Currently uses Supabase OAuth provider
 * This means Google's consent screen shows Supabase domain:
 * "to continue to qaszfchiy wlcqhkondmu.supabase.co"
 *
 * Recommended fixes (see SECURITY.md):
 * 1. Setup Supabase Custom Domain (quickest)
 * 2. Implement app-level Google OAuth (more control)
 *
 * Once fixed, the domain shown will be your app domain instead.
 */
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
      onError?.(getUserSafeError(err));
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={disabled || loading}
      className={cn(
        "flex h-9 w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/50 disabled:opacity-50 dark:border-gray-800 dark:bg-[#09090b] dark:text-gray-300 dark:hover:bg-gray-900 dark:focus-visible:ring-indigo-500/50",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
          />
        </svg>
      )}
      <span>Google</span>
    </Button>
  );
}
