import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/config/site-url";

const siteUrl = getSiteUrl();

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Learning Hub Resources",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "FPT Source - FPT Software Training",
      url: `${siteUrl}/resources/FsoftTraining`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "JPD316 - Japanese Course",
      url: `${siteUrl}/resources/JPD316`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "JPD326 - Japanese Course",
      url: `${siteUrl}/resources/JPD326`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "SWD392 - System Architecture Quiz",
      url: `${siteUrl}/resources/SWD392`,
    },
    {
      "@type": "ListItem",
      position: 5,
      name: "PMG201c - Project Management Quiz",
      url: `${siteUrl}/resources/PMG201c`,
    },
    {
      "@type": "ListItem",
      position: 6,
      name: "PRM393 - Mobile Programming Quiz",
      url: `${siteUrl}/resources/PRM393`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "Resource hub for FPT Source, JPD316, JPD326, SWD392, PMG201c and PRM393 practice content.",
  keywords: [
    "fpt source",
    "fpt src",
    "fpt",
    "jpd316",
    "jpd326",
    "swd392",
    "pmg201c",
    "prm393",
    "tai nguyen hoc tap",
  ],
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Learning Hub",
    description:
      "Resource hub for FPT Source, JPD316, JPD326, SWD392, PMG201c and PRM393 practice content.",
    url: "/resources",
    type: "website",
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {children}
    </>
  );
}
