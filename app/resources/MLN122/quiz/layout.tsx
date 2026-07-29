import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MLN122 - Quiz ôn tập",
  description:
    "Bộ 526 câu hỏi ôn tập Kinh tế chính trị Mác - Lênin, học theo chủ đề và không giới hạn thời gian.",
  keywords: [
    "mln122",
    "kinh tế chính trị Mác - Lênin",
    "quiz mln122",
    "câu hỏi ôn tập",
  ],
  alternates: {
    canonical: "/resources/MLN122/quiz",
  },
  openGraph: {
    title: "MLN122 - Quiz ôn tập",
    description:
      "Ôn tập 526 câu hỏi MLN122 theo chủ đề, không giới hạn thời gian.",
    url: "/resources/MLN122/quiz",
    type: "website",
  },
};

export default function MLN122QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
