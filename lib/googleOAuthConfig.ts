/**
 * App-level Google OAuth Client ID management
 * This is public-safe (client ID is meant to be public)
 */

// Get from environment variable or use hardcoded value
// This is safe to expose - Client ID is meant to be public
export const GOOGLE_OAUTH_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

// This should be in server-only environment variables
export const GOOGLE_OAUTH_CLIENT_SECRET =
  process.env.GOOGLE_OAUTH_CLIENT_SECRET || "";

/**
 * Validate Google OAuth environment is properly configured
 */
export function validateGoogleOAuthConfig(): {
  isValid: boolean;
  error?: string;
} {
  if (!GOOGLE_OAUTH_CLIENT_ID) {
    return { isValid: false, error: "Google Client ID not configured" };
  }

  if (!GOOGLE_OAUTH_CLIENT_SECRET && process.env.NODE_ENV === "production") {
    return { isValid: false, error: "Google Client Secret not configured" };
  }

  return { isValid: true };
}
