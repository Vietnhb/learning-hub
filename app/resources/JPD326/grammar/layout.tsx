import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "JPD326 grammar content is being updated.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JPD326GrammarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
