import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ITE302c - Ethics in AI",
  description: "Quiz ôn tập ITE302c về đạo đức trong trí tuệ nhân tạo.",
  alternates: {
    canonical: "/resources/ITE302c",
  },
  openGraph: {
    title: "ITE302c - Ethics in AI",
    description: "Bộ 357 câu hỏi ôn tập ITE302c về Ethics in AI.",
    url: "/resources/ITE302c",
    type: "website",
  },
};

export default function ITE302cLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
