"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Languages,
  Library,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFavorites } from "@/hooks/useResourceFavorites";

type FeaturedResource = {
  title: string;
  description: string;
  href: string;
  category: string;
  status: string;
  icon: LucideIcon;
  accent: string;
  badge: string;
};

type Benefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const featuredResources: FeaturedResource[] = [
  {
    title: "JPD316",
    description:
      "Từ vựng, ngữ pháp và Kanji cho lộ trình tiếng Nhật trung cấp.",
    href: "/resources/JPD316",
    category: "Tiếng Nhật",
    status: "Sẵn sàng",
    icon: Languages,
    accent:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-200",
    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-100",
  },
  {
    title: "JPD326",
    description: "Tài liệu N4-N3, phù hợp để ôn theo chủ đề và luyện ghi nhớ.",
    href: "/resources/JPD326",
    category: "Tiếng Nhật",
    status: "Đang cập nhật",
    icon: BookOpen,
    accent:
      "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900/70 dark:bg-pink-950/30 dark:text-pink-200",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-100",
  },
  {
    title: "FPT Software Training",
    description:
      "Bộ học liệu tiếng Nhật cho chương trình đào tạo FPT Software.",
    href: "/resources/FsoftTraining",
    category: "Đào tạo",
    status: "Đang cập nhật",
    icon: GraduationCap,
    accent:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-200",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-100",
  },
  {
    title: "SWD392",
    description: "Quiz kiến trúc hệ thống, UML, design strategy, PIM và PSM.",
    href: "/resources/SWD392",
    category: "Kỹ thuật phần mềm",
    status: "Sẵn sàng",
    icon: ClipboardCheck,
    accent:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-200",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-100",
  },
  {
    title: "PMG201c",
    description: "Ôn tập scope, schedule, risk, stakeholder và quality.",
    href: "/resources/PMG201c",
    category: "Quản lý dự án",
    status: "Sẵn sàng",
    icon: Target,
    accent:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-200",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-100",
  },
  {
    title: "SYB302c",
    description:
      "Quiz khởi nghiệp: opportunity, innovation, customer value và fundraising.",
    href: "/resources/SYB302c",
    category: "Kinh doanh",
    status: "Sẵn sàng",
    icon: Briefcase,
    accent:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/70 dark:bg-teal-950/30 dark:text-teal-200",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-100",
  },
];

const heroStats = [
  {
    label: "Bộ tài liệu",
    value: "6",
    detail: "đang có trong thư viện",
    icon: Library,
  },
  {
    label: "Bộ quiz",
    value: "3",
    detail: "hỗ trợ ôn tập nhanh",
    icon: ClipboardCheck,
  },
  {
    label: "Lĩnh vực",
    value: "4",
    detail: "phù hợp nhiều nhu cầu",
    icon: Sparkles,
  },
];

const benefits: Benefit[] = [
  {
    title: "Dễ tìm",
    description:
      "Tài liệu được gom theo môn học và chủ đề để bạn mở đúng thứ mình cần.",
    icon: Search,
  },
  {
    title: "Dễ ôn",
    description:
      "Các bộ quiz giúp kiểm tra nhanh kiến thức trước khi học tiếp.",
    icon: CheckCircle2,
  },
  {
    title: "Dễ lưu",
    description:
      "Đánh dấu tài liệu yêu thích để quay lại nhanh trong những lần sau.",
    icon: Star,
  },
  {
    title: "Dễ góp ý",
    description: "Gửi phản hồi khi thấy nội dung cần bổ sung hoặc chỉnh sửa.",
    icon: MessageSquare,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45 },
  },
};

export default function Home() {
  const { user } = useAuth();
  const { favoriteSet } = useResourceFavorites(user?.id);
  const favoriteCount = favoriteSet.size;
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "nha";

  return (
    <div className="min-h-screen bg-[#f7faff] text-slate-950 dark:bg-[#050b18] dark:text-white">
      <section className="relative isolate overflow-hidden border-b border-blue-100 bg-[#071b49] text-white dark:border-blue-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(255,176,0,0.22),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(63,139,255,0.28),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:52px_52px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061333] to-transparent" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl lg:pr-4"
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-blue-50 shadow-xl shadow-blue-950/20 backdrop-blur">
              <img
                src="/android-chrome-192x192.png"
                alt=""
                aria-hidden="true"
                className="h-9 w-9 rounded-md bg-white object-contain p-1 shadow-sm"
              />
              {displayName && <span>Chúc bạn học tốt {displayName}</span>}
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-[4.5rem]">
              Learning Hub
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-amber-200 sm:text-[1.7rem]">
              Học gọn hơn. Nhớ lâu hơn. Tiến bộ mỗi ngày.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
              Nơi tập trung tài liệu, bài ôn luyện và phản hồi học tập trong một
              giao diện rõ ràng, đẹp mắt và dễ dùng cho mọi người.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 justify-center rounded-lg bg-amber-400 px-6 text-base font-bold text-blue-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300"
              >
                <Link href="/resources">
                  Khám phá tài liệu
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 justify-center rounded-lg border-white/25 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur hover:bg-white/15 hover:text-white"
              >
                <Link href="/resources?favorites=1">
                  <Star className="h-5 w-5 fill-amber-300 text-amber-300" />
                  Tài liệu yêu thích ({favoriteCount})
                </Link>
              </Button>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {heroStats.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    variants={itemVariants}
                    className="rounded-lg border border-white/15 bg-white/[0.09] p-4 shadow-lg shadow-blue-950/15 backdrop-blur-md"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-blue-100">
                        {item.label}
                      </p>
                      <div className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-amber-300">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-4xl font-black text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-blue-100">
                      {item.detail}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-2xl rounded-[1.75rem] border border-white/20 bg-white/10 p-3 shadow-2xl shadow-blue-950/30 backdrop-blur-md lg:max-w-none">
              <div className="absolute -left-4 top-8 hidden rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-lg md:block">
                Lưu mục quan trọng
              </div>
              <div className="absolute -right-4 bottom-10 hidden rounded-lg border border-amber-200/50 bg-amber-300 px-4 py-3 text-sm font-bold text-blue-950 shadow-xl md:block">
                Ôn tập nhanh
              </div>
              <div className="rounded-[1.35rem] bg-white/95 p-3 shadow-inner shadow-blue-950/10">
                <img
                  src="/learninghub-home-hero.svg"
                  alt="Minh họa Learning Hub với tài liệu, quiz và tiến độ học tập"
                  className="mx-auto w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,44,120,0.05)_1px,transparent_1px),linear-gradient(rgba(9,44,120,0.05)_1px,transparent_1px)] bg-[size:44px_44px] dark:bg-[linear-gradient(90deg,rgba(110,168,255,0.07)_1px,transparent_1px),linear-gradient(rgba(110,168,255,0.07)_1px,transparent_1px)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1 text-sm font-bold uppercase tracking-normal text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                <Library className="h-4 w-4" />
                Tài nguyên nổi bật
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-normal text-slate-950 dark:text-white sm:text-4xl">
                Chọn nhanh nội dung bạn muốn học hôm nay
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Các bộ tài liệu được trình bày rõ trạng thái, lĩnh vực và lối
                vào để bạn bắt đầu mà không mất thời gian tìm kiếm.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-blue-200 bg-white/80 font-semibold text-blue-900 hover:bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100 dark:hover:bg-blue-950"
            >
              <Link href="/resources">
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {featuredResources.map((resource) => {
              const Icon = resource.icon;

              return (
                <motion.div key={resource.title} variants={itemVariants}>
                  <Link href={resource.href} className="block h-full">
                    <Card className="group h-full rounded-lg border-blue-100 bg-white/90 shadow-sm shadow-blue-950/5 backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/10 dark:border-blue-950/70 dark:bg-slate-950/80 dark:hover:border-blue-800">
                      <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={`grid h-12 w-12 place-items-center rounded-lg border ${resource.accent}`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <span
                            className={`rounded-md px-2.5 py-1 text-xs font-bold ${resource.badge}`}
                          >
                            {resource.status}
                          </span>
                        </div>
                        <div>
                          <CardDescription className="mb-2 text-xs font-bold uppercase tracking-normal text-blue-700 dark:text-blue-300">
                            {resource.category}
                          </CardDescription>
                          <CardTitle className="text-2xl text-slate-950 dark:text-white">
                            {resource.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="min-h-[4.5rem] text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {resource.description}
                        </p>
                        <div className="mt-5 inline-flex items-center text-sm font-bold text-blue-800 dark:text-blue-200">
                          Vào học ngay
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="border-y border-blue-100 bg-white px-4 py-16 dark:border-blue-950 dark:bg-[#071126] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-3 py-1 text-sm font-bold uppercase tracking-normal text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              <Sparkles className="h-4 w-4" />
              Trải nghiệm học tập
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-normal text-slate-950 dark:text-white sm:text-4xl">
              Gọn gàng cho người mới, đủ nhanh cho người học thường xuyên
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Learning Hub giúp bạn bớt phân tán: tài liệu, bài ôn và phản hồi
              đều nằm trong một nơi, có cấu trúc dễ theo dõi.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ y: 18, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.42, delay: index * 0.06 }}
                  className="rounded-lg border border-blue-100 bg-[#f7faff] p-5 shadow-sm shadow-blue-950/5 dark:border-blue-950 dark:bg-slate-950"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-900 text-white dark:bg-blue-800">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-300">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-blue-200 bg-[#071b49] text-white shadow-2xl shadow-blue-950/20 dark:border-blue-900">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.75fr] lg:p-10">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-blue-100">
                <BookOpen className="h-4 w-4 text-amber-300" />
                Bắt đầu ngay
              </div>
              <h2 className="max-w-2xl text-3xl font-black tracking-normal sm:text-4xl">
                Mở thư viện hoặc tiếp tục với tài liệu yêu thích
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">
                Bạn có thể khám phá toàn bộ tài nguyên, quay lại những mục đã
                lưu hoặc gửi góp ý để nội dung ngày càng tốt hơn.
              </p>
            </div>
            <div className="grid content-center gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                href="/resources"
                className="flex items-center justify-between rounded-lg border border-white/15 bg-white p-4 font-bold text-blue-950 transition-colors hover:bg-amber-100"
              >
                <span className="flex items-center gap-3">
                  <Library className="h-5 w-5" />
                  Mở thư viện
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/resources?favorites=1"
                className="flex items-center justify-between rounded-lg border border-amber-300/50 bg-amber-400 p-4 font-bold text-blue-950 transition-colors hover:bg-amber-300"
              >
                <span className="flex items-center gap-3">
                  <Star className="h-5 w-5 fill-blue-950" />
                  Yêu thích ({favoriteCount})
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={user ? "/feedback" : "/auth/login?redirect=/feedback"}
                className="flex items-center justify-between rounded-lg border border-white/15 bg-white/10 p-4 font-bold text-white transition-colors hover:bg-white/15"
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-amber-300" />
                  Gửi góp ý
                </span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
