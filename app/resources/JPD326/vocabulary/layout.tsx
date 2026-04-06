import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JPD326 Vocabulary - Coming soon",
  description: "JPD326 vocabulary content is being updated.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function JPD326VocabularyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
