import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Google OAuth Callback Handler
 * Exchanges Google authorization code for session without exposing Supabase domain
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") || "/";

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      new URL(
        `/auth/oauth/callback?error=${error}&error_description=${errorDescription || ""}`,
        request.url,
      ),
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/oauth/callback?error=no_code", request.url),
    );
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Exchange authorization code for session
    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("OAuth code exchange error:", exchangeError);
      return NextResponse.redirect(
        new URL("/auth/oauth/callback?error=exchange_failed", request.url),
      );
    }

    if (!data.session) {
      return NextResponse.redirect(
        new URL("/auth/oauth/callback?error=no_session", request.url),
      );
    }

    // Create response with auth cookie
    const response = NextResponse.redirect(
      new URL(
        `/auth/oauth/callback?next=${encodeURIComponent(next)}`,
        request.url,
      ),
    );

    // Set auth cookies (Supabase handles this automatically)
    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(
      new URL("/auth/oauth/callback?error=server_error", request.url),
    );
  }
}
