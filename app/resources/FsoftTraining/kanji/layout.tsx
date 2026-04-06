import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Kanji content for FPT Source / FPT SRC training program.",
  keywords: [
    "fpt source kanji",
    "fpt src kanji",
    "fpt software training kanji",
  ],
  alternates: {
    canonical: "/resources/FsoftTraining/kanji",
  },
};

export default function FsoftTrainingKanjiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
