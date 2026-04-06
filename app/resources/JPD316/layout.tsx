import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "JPD316 learning hub with vocabulary, grammar and kanji resources for Japanese practice.",
  keywords: [
    "jpd316",
    "jpd 316",
    "jpd-316",
    "japanese jpd316",
    "jpd316 vocabulary",
    "jpd316 grammar",
    "jpd316 kanji",
  ],
  alternates: {
    canonical: "/resources/JPD316",
  },
  openGraph: {
    title: "JPD316 - Japanese Learning Materials",
    description:
      "JPD316 learning hub with vocabulary, grammar and kanji resources for Japanese practice.",
    url: "/resources/JPD316",
    type: "website",
  },
};

export default function JPD316Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
