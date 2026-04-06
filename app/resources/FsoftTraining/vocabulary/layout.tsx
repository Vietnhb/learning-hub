import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FsoftTraining Vocabulary - Coming soon",
  description: "Nội dung từ vựng FsoftTraining đang được cập nhật.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FsoftTrainingVocabularyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
