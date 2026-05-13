import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kanji JPD326 | Learning Hub",
  description: "Kanji practice cards for JPD326 Japanese course.",
  keywords: ["jpd326 kanji", "jpd 326 han tu", "jpd326 chu han"],
  alternates: {
    canonical: "/resources/JPD326/kanji",
  },
};

export default function JPD326KanjiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
