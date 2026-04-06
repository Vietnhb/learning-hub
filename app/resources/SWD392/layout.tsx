import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SWD392 - System Architecture Quiz",
  description:
    "SWD392 practice page for software architecture, UML, design strategy, PIM/PSM and system design review.",
  keywords: [
    "swd392",
    "swd 392",
    "swd-392",
    "system architecture",
    "software architecture",
    "uml",
    "pim",
    "psm",
    "quiz swd392",
    "fpt swd392",
  ],
  alternates: {
    canonical: "/resources/SWD392",
  },
  openGraph: {
    title: "SWD392 - System Architecture Quiz",
    description:
      "SWD392 practice page for software architecture, UML, design strategy, PIM/PSM and system design review.",
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
