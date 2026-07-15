import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { getSiteUrl } from "@/lib/config/site-url";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AppChrome from "@/components/layout/AppChrome";
import "./globals.css";

const siteUrl = getSiteUrl();

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-noto-serif-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Learning Hub",
  description:
    "Learning Hub is a friendly study space for learning resources, quizzes, favorites, and feedback.",
  keywords: [
    "fpt source",
    "fpt src",
    "fpt",
    "fpt software training",
    "learning hub",
    "jpd316",
    "jpd 316",
    "jpd-316",
    "jpd326",
    "jpd 326",
    "jpd-326",
    "swd392",
    "swd 392",
    "swd-392",
    "software architecture quiz",
  ],
  applicationName: "Learning Hub",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "Learning Hub",
    title: "Learning Hub",
    description:
      "A friendly study space for resources, quizzes, favorites, and feedback.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Hub",
    description:
      "A friendly study space for resources, quizzes, favorites, and feedback.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${notoSansJp.variable} ${notoSerifJp.variable} flex min-h-screen flex-col bg-background font-japanese text-foreground transition-colors`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "catppuccin"]}
        >
          <AuthProvider>
            <AppChrome>{children}</AppChrome>
            <SpeedInsights />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
