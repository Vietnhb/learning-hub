import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Gamepad2,
} from "lucide-react";

const sections = [
  {
    href: "/resources/MLN122/game",
    eyebrow: "Folder 1",
    title: "Game mô phỏng",
    description:
      "Source MLN122 cũ được giữ nguyên: nông trại pixel, lý thuyết và bảng xếp hạng.",
    detail: "Nông trang tô điền",
    icon: Gamepad2,
    accent: "bg-emerald-400",
  },
  {
    href: "/resources/MLN122/quiz",
    eyebrow: "Folder 2",
    title: "Quiz ôn tập",
    description:
      "526 câu hỏi theo chủ đề, kiểm tra từng câu và không giới hạn thời gian.",
    detail: "526 câu hỏi",
    icon: BookOpenCheck,
    accent: "bg-amber-400",
  },
];

export default function MLN122Page() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-amber-700 dark:text-slate-300 dark:hover:text-amber-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Tài nguyên
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
            MLN122
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            Kinh tế chính trị Mác - Lênin
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Chọn nội dung bạn muốn mở.
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-900/10 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900 sm:p-9"
              >
                <div
                  className={`absolute right-0 top-0 h-32 w-32 -translate-y-10 translate-x-10 rounded-full ${section.accent} opacity-15 blur-2xl transition group-hover:opacity-30`}
                />

                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${section.accent} text-slate-950 shadow-sm`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <p className="mt-8 text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {section.eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-black">{section.title}</h2>
                <p className="mt-3 min-h-14 leading-relaxed text-slate-600 dark:text-slate-300">
                  {section.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5 dark:border-slate-700">
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    {section.detail}
                  </span>
                  <span className="inline-flex items-center gap-2 font-black text-slate-950 dark:text-white">
                    Mở
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
