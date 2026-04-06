import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SWD392 - Kiến trúc hệ thống",
  description:
    "Ôn tập và làm quiz SWD392 về software architecture, UML, design strategy, PIM/PSM.",
  keywords: [
    "SWD392",
    "kiến trúc hệ thống",
    "software architecture",
    "UML",
    "PIM",
    "PSM",
    "quiz SWD392",
  ],
  alternates: {
    canonical: "/resources/SWD392",
  },
  openGraph: {
    title: "SWD392 - Kiến trúc hệ thống",
    description:
      "Ôn tập và làm quiz SWD392 về software architecture, UML, design strategy, PIM/PSM.",
    url: "/resources/SWD392",
    type: "website",
  },
};

export default function SWD392Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
