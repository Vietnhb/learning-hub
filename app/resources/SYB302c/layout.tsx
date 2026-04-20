import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "SYB302c practice page cho tư duy khởi nghiệp, phân tích cơ hội, giá trị khách hàng và quiz gọi vốn startup.",
  keywords: [
    "syb302c",
    "syb 302c",
    "entrepreneurship",
    "startup strategy",
    "fundraising",
    "quiz syb302c",
    "fpt syb302c",
  ],
  alternates: {
    canonical: "/resources/SYB302c",
  },
  openGraph: {
    title: "Learning Hub",
    description:
      "SYB302c practice page cho tư duy khởi nghiệp, phân tích cơ hội, giá trị khách hàng và quiz gọi vốn startup.",
    url: "/resources/SYB302c",
    type: "website",
  },
};

export default function SYB302cLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
