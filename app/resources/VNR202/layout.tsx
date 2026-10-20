import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";

const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-vnr-serif",
});

export const metadata: Metadata = {
  title: "VNR202 - Mạng lưới sự kiện lịch sử Đảng",
  description:
    "Bảo tàng số VNR202: mạng lưới sự kiện, nhân vật, văn kiện và địa danh lịch sử Đảng Cộng sản Việt Nam 1920 – 2021, kèm ảnh tư liệu gốc có nguồn.",
  keywords: [
    "vnr202",
    "lịch sử đảng cộng sản việt nam",
    "historical knowledge graph",
    "mạng lưới sự kiện lịch sử",
    "bảo tàng lịch sử số",
  ],
  alternates: {
    canonical: "/resources/VNR202",
  },
  openGraph: {
    title: "VNR202 - Mạng lưới sự kiện lịch sử Đảng",
    description:
      "Khám phá các sự kiện lịch sử Đảng Cộng sản Việt Nam qua mạng lưới tri thức trực quan và ảnh tư liệu gốc.",
    url: "/resources/VNR202",
    type: "website",
  },
};

export default function VNR202Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={notoSerif.variable}>{children}</div>;
}
