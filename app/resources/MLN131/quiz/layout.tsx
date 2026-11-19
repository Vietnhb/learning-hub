import { quizCounts } from "@/lib/quiz-counts.server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MLN131 - Quiz ôn tập",
  description:
    `Bộ ${quizCounts.MLN131} câu hỏi ôn tập Chủ nghĩa xã hội khoa học, học theo chương và không giới hạn thời gian.`,
  keywords: [
    "mln131",
    "chủ nghĩa xã hội khoa học",
    "quiz mln131",
    "câu hỏi ôn tập",
  ],
  alternates: {
    canonical: "/resources/MLN131/quiz",
  },
  openGraph: {
    title: "MLN131 - Quiz ôn tập",
    description:
      `Ôn tập ${quizCounts.MLN131} câu hỏi MLN131 theo chương, không giới hạn thời gian.`,
    url: "/resources/MLN131/quiz",
    type: "website",
  },
};

export default function MLN131QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
