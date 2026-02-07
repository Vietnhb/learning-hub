import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) throw error;

      if (data.user) {
        // Kiểm tra user trong bảng users
        const { data: userProfile } = await supabase
          .from("users")
          .select("id, full_name, date_of_birth")
          .eq("id", data.user.id)
          .single();

        // Kiểm tra xem profile đã hoàn thiện chưa
        const isProfileComplete =
          userProfile &&
          userProfile.full_name &&
          userProfile.full_name.trim() !== "" &&
          userProfile.date_of_birth;

        if (!isProfileComplete) {
          // Chưa hoàn thiện profile -> redirect đến complete profile
          return NextResponse.redirect(
            new URL("/profile/complete", requestUrl.origin),
          );
        }

        // Profile đã hoàn thiện -> redirect về home hoặc next
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
    } catch (error) {
      console.error("Error in auth callback:", error);
      return NextResponse.redirect(
        new URL("/auth/login?error=callback_error", requestUrl.origin),
      );
    }
  }

  // Nếu không có code, redirect về login
  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin));
}
