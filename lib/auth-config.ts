/**
 * Get the appropriate callback URL based on the current environment
 */
export function getCallbackUrl(path: string = "/auth/callback"): string {
  // Check if running on client side
  if (typeof window !== "undefined") {
    const { protocol, host } = window.location;
    return `${protocol}//${host}${path}`;
  }

  // Server-side fallback
  const isDevelopment = process.env.NODE_ENV === "development";
  const baseUrl = isDevelopment
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_SITE_URL || "https://baovietweb.site";

  return `${baseUrl}${path}`;
}

/**
 * Get auth redirect URLs for Supabase
 */
export const getAuthRedirectUrls = () => ({
  signupCallback: getCallbackUrl("/auth/callback"),
  resetPasswordCallback: getCallbackUrl("/auth/reset-password"),
});
