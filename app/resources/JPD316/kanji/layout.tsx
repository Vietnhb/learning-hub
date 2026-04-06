import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Kanji practice cards for JPD316 Japanese course.",
  keywords: ["jpd316 kanji", "jpd 316 han tu", "jpd316 chu han"],
  alternates: {
    canonical: "/resources/JPD316/kanji",
  },
};

export default function JPD316KanjiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
