import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nông trang tô điền: Một mùa thu hoạch",
  description:
    "Trò chơi mô phỏng nông trại phong cách pixel về tô điền trong kinh tế chính trị Mác - Lênin.",
  keywords: ["mln122", "tô điền", "kinh tế chính trị Mác - Lênin", "game pixel", "fpt"],
  alternates: {
    canonical: "/resources/MLN122",
  },
  openGraph: {
    title: "Nông trang tô điền: Một mùa thu hoạch",
    description:
      "Mini game lớp học về tô điền vi phân, tô điền tuyệt đối, lao động, tư bản và năng suất AI.",
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
