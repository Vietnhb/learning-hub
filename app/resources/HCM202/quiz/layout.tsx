import { quizCounts } from "@/lib/quiz-counts.server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HCM202 - Quiz ôn tập",
  description:
    "Bộ câu hỏi ôn tập Tư tưởng Hồ Chí Minh, học theo chủ đề và không giới hạn thời gian.",
  keywords: [
    "hcm202",
    "tư tưởng hồ chí minh",
    "quiz hcm202",
    "câu hỏi ôn tập",
    "hồ chí minh",
    "src hcm202",
  ],
  alternates: {
    canonical: "/resources/HCM202/quiz",
  },
  openGraph: {
    title: "HCM202 - Quiz ôn tập",
    description:
      `Ôn tập ${quizCounts.HCM202} câu hỏi HCM202 theo chủ đề, không giới hạn thời gian.`,
    url: "/resources/HCM202/quiz",
    type: "website",
  },
};

export default function HCM202QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
