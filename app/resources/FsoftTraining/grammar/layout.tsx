import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Nội dung ngữ pháp FsoftTraining.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FsoftTrainingGrammarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
