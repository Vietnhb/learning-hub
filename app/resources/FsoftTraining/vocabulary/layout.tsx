import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "Kotoba FsoftTraining theo Unit 1-12, co loc theo bai va ghi chu tu dong tu/tha dong tu.",
  alternates: {
    canonical: "/resources/FsoftTraining/vocabulary",
  },
};

export default function FsoftTrainingVocabularyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

