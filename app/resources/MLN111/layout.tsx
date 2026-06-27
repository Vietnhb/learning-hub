import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "MLN111 - Triết học Mác - Lênin. Nội dung của phép biện chứng duy vật.",
  keywords: ["mln111", "triết học", "mác lênin", "fpt"],
  alternates: {
    canonical: "/resources/MLN111",
  },
  openGraph: {
    title: "Learning Hub",
    description: "MLN111 - Triết học Mác - Lênin. Nội dung của phép biện chứng duy vật.",
    url: "/resources/MLN111",
    type: "website",
  },
};

export default function MLN111Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}