import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPD326 Kanji - Coming soon",
  description: "JPD326 kanji content is being updated.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JPD326KanjiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
