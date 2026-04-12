import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "PMG201c practice page for project management review and quiz with progress tracking.",
  keywords: [
    "pmg201c",
    "pmg 201c",
    "project management",
    "quiz pmg201c",
    "fpt pmg201c",
  ],
  alternates: {
    canonical: "/resources/PMG201c",
  },
  openGraph: {
    title: "Learning Hub",
    description:
      "PMG201c practice page for project management review and quiz with progress tracking.",
    url: "/resources/PMG201c",
    type: "website",
  },
};

export default function PMG201cLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

