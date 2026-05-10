import { getSiteUrl } from "./site-url";

/**
 * Get the appropriate callback URL based on the current environment
 */
export function getCallbackUrl(path: string = "/auth/callback"): string {
  const baseUrl = getSiteUrl();
  return `${baseUrl}${path}`;
}

export function getSafeRedirectPath(path?: string | null): string {
  if (!path) return "/";

  const trimmedPath = path.trim();

  if (
    !trimmedPath.startsWith("/") ||
    trimmedPath.startsWith("//") ||
    trimmedPath.startsWith("/\\")
  ) {
    return "/";
  }

  return trimmedPath;
}

export function getOAuthCallbackUrl(next?: string | null): string {
  const callbackUrl = new URL(getCallbackUrl("/auth/oauth/callback"));
  const safeNext = getSafeRedirectPath(next);

  if (safeNext !== "/") {
    callbackUrl.searchParams.set("next", safeNext);
  }

  return callbackUrl.toString();
}

/**
 * Get auth redirect URLs for Supabase
 */
export const getAuthRedirectUrls = (next?: string | null) => ({
  signupCallback: getCallbackUrl("/auth/callback"),
  oauthCallback: getOAuthCallbackUrl(next),
  resetPasswordCallback: getCallbackUrl("/auth/reset-password"),
});
