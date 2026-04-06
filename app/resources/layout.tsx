import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài nguyên học tập",
  description:
    "Kho tài nguyên học tập gồm giáo trình tiếng Nhật và bộ câu hỏi SWD392 về kiến trúc hệ thống.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Tài nguyên học tập",
    description:
      "Kho tài nguyên học tập gồm giáo trình tiếng Nhật và bộ câu hỏi SWD392 về kiến trúc hệ thống.",
    url: "/resources",
    type: "website",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
