import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PRM393 - Mobile Programming Quiz | Learning Hub",
  description:
    "PRM393 practice quiz for Flutter, Dart, state management, API, authentication, testing and mobile app deployment.",
  keywords: [
    "prm393",
    "prm 393",
    "flutter quiz",
    "dart quiz",
    "mobile programming",
    "fpt prm393",
    "prm393 quiz",
    "src prm393",
  ],
  alternates: {
    canonical: "/resources/PRM393",
  },
  openGraph: {
    title: "PRM393 - Mobile Programming Quiz",
    description:
      "Practice Flutter, Dart, BLoC, API, authentication and testing with the PRM393 quiz.",
    url: "/resources/PRM393",
    type: "website",
  },
};

export default function PRM393Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
