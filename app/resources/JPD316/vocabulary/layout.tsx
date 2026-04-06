import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Vocabulary deck for JPD316 Japanese learning.",
  keywords: ["jpd316 vocabulary", "jpd 316 tu vung", "jpd316 kotoba"],
  alternates: {
    canonical: "/resources/JPD316/vocabulary",
  },
};

export default function JPD316VocabularyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
