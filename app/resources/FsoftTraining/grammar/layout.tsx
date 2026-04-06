import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FsoftTraining Grammar - Coming soon",
  description: "Nội dung ngữ pháp FsoftTraining đang được cập nhật.",
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
