import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPD326 - Japanese Learning Materials",
  description:
    "JPD326 learning hub with Japanese study resources and progressive updates.",
  keywords: [
    "jpd326",
    "jpd 326",
    "jpd-326",
    "japanese jpd326",
    "jpd326 vocabulary",
    "jpd326 grammar",
    "jpd326 kanji",
  ],
  alternates: {
    canonical: "/resources/JPD326",
  },
  openGraph: {
    title: "JPD326 - Japanese Learning Materials",
    description:
      "JPD326 learning hub with Japanese study resources and progressive updates.",
    url: "/resources/JPD326",
    type: "website",
  },
};

export default function JPD326Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
