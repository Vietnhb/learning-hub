import { quizCounts } from "@/lib/quiz-counts.server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VNR202 - Quiz ôn tập",
  description:
    `Bộ ${quizCounts.VNR202} câu hỏi ôn tập Lịch sử Đảng Cộng sản Việt Nam, học theo giai đoạn và không giới hạn thời gian.`,
  keywords: [
    "vnr202",
    "lịch sử đảng cộng sản việt nam",
    "quiz vnr202",
    "câu hỏi ôn tập",
  ],
  alternates: {
    canonical: "/resources/VNR202/quiz",
  },
  openGraph: {
    title: "VNR202 - Quiz ôn tập",
    description:
      `Ôn tập ${quizCounts.VNR202} câu hỏi VNR202 theo giai đoạn, không giới hạn thời gian.`,
    url: "/resources/VNR202/quiz",
    type: "website",
  },
};

export default function VNR202QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
