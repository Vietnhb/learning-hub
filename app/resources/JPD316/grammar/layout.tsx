import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Grammar patterns and examples for JPD316 Japanese course.",
  keywords: ["jpd316 grammar", "jpd 316 ngu phap", "jpd316 bunpo"],
  alternates: {
    canonical: "/resources/JPD316/grammar",
  },
};

export default function JPD316GrammarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
