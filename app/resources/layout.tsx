import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

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
  ],
};

export const metadata: Metadata = {
  title: "Learning Hub",
  description:
    "Resource hub for FPT Source (FPT SRC), JPD316, JPD326 and SWD392 practice content.",
  keywords: [
    "fpt source",
    "fpt src",
    "fpt",
    "jpd316",
    "jpd326",
    "swd392",
    "tai nguyen hoc tap",
  ],
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "Tai nguyen hoc tap: FPT Source, JPD316, JPD326, SWD392",
    description:
      "Resource hub for FPT Source (FPT SRC), JPD316, JPD326 and SWD392 practice content.",
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
