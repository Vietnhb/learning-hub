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
import AnimatedContent from "@/components/AnimatedContent";
import Aurora from "@/components/Aurora";
import CountUp from "@/components/CountUp";
import Lightfall from "@/components/Lightfall";
import ElectricBorder from "@/components/ElectricBorder";
import GlareHover from "@/components/GlareHover";
import { MascotScene } from "@/components/MascotScene";
import ShinyText from "@/components/ShinyText";
import SpotlightCard from "@/components/SpotlightCard";
import StarBorder from "@/components/StarBorder";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useResourceFavorites } from "@/hooks/useResourceFavorites";
import { cn } from "@/lib/utils";

type FeaturedResource = {
  title: string;
  description: string;
  href: string;
  category: string;
  status: string;
  icon: LucideIcon;
  accent: string;
  glow: `rgba(${number}, ${number}, ${number}, ${number})`;
  gradient: string;
};

type StudyStep = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

const featuredResources: FeaturedResource[] = [
  {
    title: "JPD316",
    description: "Từ vựng, ngữ pháp và Kanji cho lộ trình tiếng Nhật trung cấp.",
    href: "/resources/JPD316",
    category: "Tiếng Nhật",
    status: "Sẵn sàng",
    icon: Languages,
    accent: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-100",
    glow: "rgba(251, 113, 133, 0.25)",
    gradient: "from-rose-500 via-amber-400 to-slate-950",
  },
  {
    title: "JPD326",
    description: "Tài liệu N4-N3, phù hợp để ôn theo chủ đề và luyện ghi nhớ.",
    href: "/resources/JPD326",
    category: "Tiếng Nhật",
    status: "Đang cập nhật",
    icon: BookOpen,
    accent:
      "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-400/15 dark:text-fuchsia-100",
    glow: "rgba(217, 70, 239, 0.22)",
    gradient: "from-fuchsia-500 via-sky-400 to-slate-950",
  },
  {
    title: "FPT Software Training",
    description: "Bộ học liệu tiếng Nhật cho chương trình đào tạo FPT Software.",
    href: "/resources/FsoftTraining",
    category: "Đào tạo",
    status: "Đang cập nhật",
    icon: GraduationCap,
    accent:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-100",
    glow: "rgba(16, 185, 129, 0.22)",
    gradient: "from-emerald-500 via-cyan-400 to-slate-950",
  },
  {
    title: "SWD392",
    description: "Quiz kiến trúc hệ thống, UML, design strategy, PIM và PSM.",
    href: "/resources/SWD392",
    category: "Kỹ thuật phần mềm",
    status: "Sẵn sàng",
    icon: ClipboardCheck,
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-100",
    glow: "rgba(14, 165, 233, 0.22)",
    gradient: "from-sky-500 via-indigo-400 to-slate-950",
  },
  {
    title: "PMG201c",
    description: "Ôn tập scope, schedule, risk, stakeholder và quality.",
    href: "/resources/PMG201c",
    category: "Quản lý dự án",
    status: "Sẵn sàng",
    icon: Target,
    accent:
      "bg-amber-100 text-amber-700 dark:bg-amber-300/15 dark:text-amber-100",
    glow: "rgba(251, 191, 36, 0.24)",
    gradient: "from-amber-500 via-orange-400 to-slate-950",
  },
  {
    title: "SYB302c",
    description: "Quiz khởi nghiệp: opportunity, innovation, customer value và fundraising.",
    href: "/resources/SYB302c",
    category: "Kinh doanh",
    status: "Sẵn sàng",
    icon: Briefcase,
    accent: "bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-100",
    glow: "rgba(20, 184, 166, 0.22)",
    gradient: "from-teal-500 via-violet-400 to-slate-950",
  },
];

const heroStats = [
  { label: "Bộ tài liệu", value: 6, detail: "đang có", icon: Library },
  { label: "Bộ quiz", value: 3, detail: "ôn tập nhanh", icon: ClipboardCheck },
  { label: "Lĩnh vực", value: 4, detail: "dễ chọn", icon: Sparkles },
];

const studySteps: StudyStep[] = [
  {
    title: "Tìm nhanh",
    description: "Mở đúng môn học và loại tài liệu chỉ trong vài thao tác.",
    icon: Search,
    color: "text-sky-500",
  },
  {
    title: "Ôn gọn",
    description: "Quiz ngắn giúp kiểm tra lại phần vừa học trước khi đi tiếp.",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  {
    title: "Lưu lại",
    description: "Đánh dấu nội dung hay để quay lại nhanh trong lần sau.",
    icon: Star,
    color: "text-amber-500",
  },
  {
    title: "Góp ý",
    description: "Báo thiếu, sai hoặc cần bổ sung để nội dung ngày càng tốt hơn.",
    icon: MessageSquare,
    color: "text-rose-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

  return (
    <div className="min-h-screen bg-[#f7fbff] text-slate-950 dark:bg-[#050815] dark:text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#040914] text-white">
        <div className="pointer-events-none absolute inset-0">
          <Lightfall
            dpr={1}
            backgroundColor="#040914"
            colors={["#38bdf8", "#fbbf24", "#f472b6", "#818cf8"]}
            streakCount={10}
            glow={0.78}
            mouseInteraction={false}
            opacity={0.82}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,9,20,0.6)_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />

        <div className="relative z-10 mx-auto grid max-w-[96rem] gap-8 px-4 pb-8 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(520px,0.94fr)] lg:items-center lg:gap-12 lg:px-10 lg:pb-10 lg:pt-10 xl:px-14">
          <AnimatedContent distance={50} duration={0.65}>
            <div className="max-w-4xl pt-2 lg:pt-0">
              <h1 className="max-w-5xl pb-2 text-4xl font-black leading-[1.16] tracking-normal sm:text-5xl sm:leading-[1.14] lg:text-[4.15rem] lg:leading-[1.1] xl:text-[4.55rem]">
                <span className="bg-gradient-to-r from-white via-amber-200 to-cyan-300 bg-clip-text text-transparent">
                  Tài liệu, quiz và mục đã lưu
                </span>
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-cyan-50/82 sm:text-lg">
                Chọn môn đang học, mở tài liệu hoặc quiz. Các mục đã đánh dấu nằm
                trong phần Yêu thích.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                <StarBorder
                  as="div"
                  color="#fbbf24"
                  speed="6s"
                  thickness={1}
                  className="w-full rounded-[18px] sm:w-auto"
                >
                  <Link
                    href="/resources"
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-amber-400 px-6 font-bold text-slate-950 transition-colors hover:bg-amber-300 sm:w-auto"
                  >
                    Khám phá tài liệu
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </StarBorder>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 justify-center rounded-lg border-white/25 bg-white/10 px-6 text-base font-semibold text-white backdrop-blur hover:bg-white/15 hover:text-white"
                >
                  <Link href="/resources?favorites=1">
                    <Star className="h-5 w-5 fill-amber-300 text-amber-300" />
                    Yêu thích ({favoriteCount})
                  </Link>
                </Button>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3"
              >
                {heroStats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <motion.div key={item.label} variants={itemVariants}>
                      <ElectricBorder
                        color="#38bdf8"
                        speed={0.75}
                        chaos={0.04}
                        borderRadius={10}
                        className="h-full rounded-lg"
                      >
                        <div className="h-full rounded-lg border border-white/15 bg-white/[0.08] p-3 shadow-lg shadow-black/10 backdrop-blur sm:p-4">
                          <div className="mb-3 flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold leading-5 text-cyan-50/82 sm:text-sm">
                              {item.label}
                            </p>
                            <Icon className="h-4 w-4 text-amber-300 sm:h-5 sm:w-5" />
                          </div>
                          <p className="text-3xl font-black text-white">
                            <CountUp to={item.value} duration={1.4} />
                          </p>
                          <p className="mt-1 text-xs leading-5 text-cyan-50/68">
                            {item.detail}
                          </p>
                        </div>
                      </ElectricBorder>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={55} duration={0.7} delay={0.06}>
            <div className="relative mx-auto h-[420px] w-full max-w-[640px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] shadow-2xl shadow-cyan-950/25 backdrop-blur-[2px] sm:h-[480px] lg:h-[560px]">
              <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent shadow-[0_0_18px_rgba(244,114,182,0.9)]" />

              <MascotScene />
            </div>
          </AnimatedContent>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:48px_48px] dark:opacity-25" />
        <div className="relative mx-auto max-w-7xl">
          <AnimatedContent distance={45} duration={0.65}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-md bg-cyan-100 px-3 py-1 text-sm font-bold uppercase tracking-normal text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">
                  <Library className="h-4 w-4" />
                  Tài nguyên nổi bật
                </p>
                <h2 className="mt-4 max-w-4xl pb-2 text-3xl font-black leading-[1.22] tracking-normal text-slate-950 dark:text-white sm:text-4xl sm:leading-[1.2]">
                  <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-700 bg-clip-text text-transparent">
                    Chọn môn rồi vào thẳng phần cần ôn
                  </span>
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Mỗi thẻ là một môn hoặc bộ học liệu. Nhìn tên, trạng thái và
                  mở trang chi tiết ngay khi cần.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-lg border-cyan-200 bg-white/80 font-semibold text-cyan-900 hover:bg-cyan-50 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100"
              >
                <Link href="/resources">
                  Xem tất cả
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </AnimatedContent>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-90px" }}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {featuredResources.map((resource) => {
              const Icon = resource.icon;

              return (
                <motion.div key={resource.title} variants={itemVariants}>
                  <SpotlightCard
                    spotlightColor={resource.glow}
                    className="group h-full rounded-lg border-slate-200 bg-white p-0 shadow-sm shadow-slate-950/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10 dark:border-white/10 dark:bg-slate-950/70"
                  >
                    <Link href={resource.href} className="relative z-10 block h-full p-5">
                      <div
                        className={cn(
                          "mb-5 flex h-32 items-end justify-between overflow-hidden rounded-lg bg-gradient-to-br p-4 text-white",
                          resource.gradient
                        )}
                      >
                        <div>
                          <div className="mb-3 grid h-11 w-11 place-items-center rounded-lg bg-white/15 backdrop-blur">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-2xl font-black">{resource.title}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 opacity-70 transition-transform group-hover:translate-x-1" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-md px-2.5 py-1 text-xs font-bold", resource.accent)}>
                          {resource.category}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                          {resource.status}
                        </span>
                      </div>
                      <p className="mt-4 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {resource.description}
                      </p>
                    </Link>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-4 py-14 dark:border-white/10 dark:bg-[#07101f] sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <AnimatedContent distance={45} duration={0.65}>
            <div>
              <p className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-3 py-1 text-sm font-bold uppercase tracking-normal text-amber-800 dark:bg-amber-300/15 dark:text-amber-100">
                <Sparkles className="h-4 w-4" />
                Dùng hằng ngày
              </p>
              <h2 className="mt-4 max-w-xl pb-2 text-3xl font-black leading-[1.22] tracking-normal text-slate-950 dark:text-white sm:text-4xl sm:leading-[1.2]">
                Tìm bài, làm quiz, lưu lại
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                Những thao tác hay dùng được đặt gần nhau để bạn không mất nhịp
                khi đang ôn bài.
              </p>
            </div>
          </AnimatedContent>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-90px" }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {studySteps.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div key={item.title} variants={itemVariants}>
                  <ElectricBorder
                    color={index % 2 === 0 ? "#38bdf8" : "#f472b6"}
                    speed={0.85}
                    chaos={0.035}
                    borderRadius={10}
                    className="h-full rounded-lg"
                  >
                    <div className="h-full rounded-lg border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-slate-950/80">
                      <div className="mb-5 flex items-center justify-between">
                        <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                          <Icon className={cn("h-5 w-5", item.color)} />
                        </div>
                        <span className="text-sm font-bold text-slate-400">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-950 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </ElectricBorder>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-[#08111f] text-white shadow-2xl shadow-slate-950/20">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 opacity-45">
              <Aurora
                colorStops={["#fbbf24", "#38bdf8", "#f472b6"]}
                amplitude={0.72}
                blend={0.5}
                speed={0.5}
              />
            </div>
            <div className="relative z-10 grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.78fr] lg:p-10">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-cyan-100">
                  <BookOpen className="h-4 w-4 text-amber-300" />
                  Đi tiếp
                </div>
                <h2 className="max-w-2xl pb-2 text-3xl font-black leading-[1.22] tracking-normal sm:text-4xl sm:leading-[1.2]">
                  Cần học thì mở thư viện, thấy thiếu thì góp ý
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-50/80">
                  Ba lối vào chính được đặt ở cuối trang để quay lại nhanh sau
                  khi xem qua các môn.
                </p>
              </div>
              <div className="grid content-center gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <GlareHover
                  width="100%"
                  height="auto"
                  background="rgba(255,255,255,0.95)"
                  borderColor="rgba(255,255,255,0.16)"
                  borderRadius="8px"
                  glareColor="#fbbf24"
                  glareOpacity={0.22}
                  className="justify-stretch"
                >
                  <Link
                    href="/resources"
                    className="relative z-10 flex w-full items-center justify-between rounded-lg p-4 font-bold text-slate-950"
                  >
                    <span className="flex items-center gap-3">
                      <Library className="h-5 w-5" />
                      Mở thư viện
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </GlareHover>

                <GlareHover
                  width="100%"
                  height="auto"
                  background="rgba(251,191,36,0.95)"
                  borderColor="rgba(251,191,36,0.5)"
                  borderRadius="8px"
                  glareColor="#ffffff"
                  glareOpacity={0.28}
                  className="justify-stretch"
                >
                  <Link
                    href="/resources?favorites=1"
                    className="relative z-10 flex w-full items-center justify-between rounded-lg p-4 font-bold text-slate-950"
                  >
                    <span className="flex items-center gap-3">
                      <Star className="h-5 w-5 fill-slate-950" />
                      Yêu thích ({favoriteCount})
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </GlareHover>

                <GlareHover
                  width="100%"
                  height="auto"
                  background="rgba(255,255,255,0.1)"
                  borderColor="rgba(255,255,255,0.18)"
                  borderRadius="8px"
                  glareColor="#7dd3fc"
                  glareOpacity={0.2}
                  className="justify-stretch sm:col-span-2 lg:col-span-1"
                >
                  <Link
                    href={user ? "/feedback" : "/auth/login?redirect=/feedback"}
                    className="relative z-10 flex w-full items-center justify-between rounded-lg p-4 font-bold text-white"
                  >
                    <span className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-amber-300" />
                      Gửi góp ý
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </GlareHover>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
