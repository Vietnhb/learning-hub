import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ITE302c - Quiz ôn tập",
  description:
    "Bộ 518 câu hỏi ôn tập Ethics in AI, học theo chủ đề và không giới hạn thời gian.",
  keywords: [
    "ite302c",
    "ethics in ai",
    "quiz ite302c",
    "câu hỏi ôn tập",
    "ethical ai",
    "src ite302c"
  ],
  alternates: {
    canonical: "/resources/ITE302c/quiz",
  },
  openGraph: {
    title: "ITE302c - Quiz ôn tập",
    description:
      "Ôn tập 518 câu hỏi ITE302c theo chủ đề, không giới hạn thời gian.",
    url: "/resources/ITE302c/quiz",
    type: "website",
  },
};

export default function ITE302cQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
