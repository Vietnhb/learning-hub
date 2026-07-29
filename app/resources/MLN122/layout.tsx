import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MLN122 - Kinh tế chính trị Mác - Lênin",
  description: "Chọn game mô phỏng hoặc quiz ôn tập MLN122.",
  alternates: {
    canonical: "/resources/MLN122",
  },
  openGraph: {
    title: "MLN122 - Kinh tế chính trị Mác - Lênin",
    description: "Game mô phỏng và bộ 526 câu hỏi ôn tập MLN122.",
    url: "/resources/MLN122",
    type: "website",
  },
};

export default function MLN122Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
