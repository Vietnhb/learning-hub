import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HCM202 - Tư tưởng Hồ Chí Minh",
  description: "Quiz ôn tập HCM202 về Tư tưởng Hồ Chí Minh.",
  alternates: {
    canonical: "/resources/HCM202/quiz",
  },
  openGraph: {
    title: "HCM202 - Tư tưởng Hồ Chí Minh",
    description: "Bộ câu hỏi ôn tập HCM202 về Tư tưởng Hồ Chí Minh.",
    url: "/resources/HCM202/quiz",
    type: "website",
  },
};

export default function HCM202Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
