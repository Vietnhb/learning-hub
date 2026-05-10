import { ReactNode } from "react";

export function ActionButton({
  active,
  icon,
  label,
  text,
  onClick,
}: {
  active?: boolean;
  icon: ReactNode;
  label?: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 ${
        active
          ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200"
          : "bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-200"
      }`}
    >
      {icon}
      <span>{text}</span>
      {label ? <span className="text-xs opacity-70">{label}</span> : null}
    </button>
  );
}
