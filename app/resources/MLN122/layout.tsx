import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pixel Rent Farm: The Season of Ground Rent",
  description:
    "A small original pixel-style educational farming simulation about capitalist ground rent.",
  keywords: ["mln122", "ground rent", "marxist political economy", "game pixel", "fpt"],
  alternates: {
    canonical: "/resources/MLN122",
  },
  openGraph: {
    title: "Pixel Rent Farm: The Season of Ground Rent",
    description:
      "Original classroom mini game about differential rent, absolute rent, labor, capital, and AI productivity.",
    url: "/resources/MLN122",
    type: "website",
  },
};

export default function MLN122Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
