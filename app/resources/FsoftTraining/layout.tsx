import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "FPT Source (FPT SRC) learning materials: vocabulary, grammar and kanji for FPT Software Training.",
  keywords: [
    "fpt source",
    "fpt src",
    "fpt",
    "fpt software training",
    "fsofttraining",
    "fpt japanese",
  ],
  alternates: {
    canonical: "/resources/FsoftTraining",
  },
  openGraph: {
    title: "FPT Source - FPT Software Training",
    description:
      "FPT Source (FPT SRC) learning materials: vocabulary, grammar and kanji for FPT Software Training.",
    url: "/resources/FsoftTraining",
    type: "website",
  },
};

export default function FsoftTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
