const IN_APP_BROWSER_PATTERNS = [
  /FBAN/i,
  /FBAV/i,
  /FBIOS/i,
  /FB_IAB/i,
  /MessengerForiOS/i,
  /Instagram/i,
  /Line/i,
  /LinkedInApp/i,
  /TikTok/i,
  /Twitter/i,
  /Zalo/i,
];

export function isLikelyInAppBrowser(userAgent: string): boolean {
  return IN_APP_BROWSER_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function blocksGoogleOAuthInCurrentBrowser(): boolean {
  if (typeof navigator === "undefined") return false;

  const userAgent = navigator.userAgent || "";
  const isIos = /iPad|iPhone|iPod/i.test(userAgent);

  return isIos && isLikelyInAppBrowser(userAgent);
}
