const PROD_FALLBACK_URL = "https://baovietweb.site";
const DEV_FALLBACK_URL = "http://localhost:3000";

function normalizeUrl(rawUrl: string): string {
  const withProtocol = /^https?:\/\//i.test(rawUrl)
    ? rawUrl
    : `https://${rawUrl}`;

  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  // Always prefer explicit environment variable if available
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  // Client-side fallback: use window.location
  if (typeof window !== "undefined") {
    return normalizeUrl(window.location.origin);
  }

  const explicitCandidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ];

  const firstDefined = explicitCandidates.find(
    (value) => typeof value === "string" && value.trim().length > 0,
  );

  if (firstDefined) {
    return normalizeUrl(firstDefined);
  }

  if (process.env.NODE_ENV === "production") {
    return PROD_FALLBACK_URL;
  }

  if (process.env.VERCEL_URL) {
    return normalizeUrl(process.env.VERCEL_URL);
  }

  return DEV_FALLBACK_URL;
}
