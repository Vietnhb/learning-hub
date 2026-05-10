import { getInitials } from "../../utils/formatters";

export function Avatar({
  name,
  src,
  size = "md",
  online = false,
}: {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md";
  online?: boolean;
}) {
  const sizeClass =
    size === "xs"
      ? "h-6 w-6 text-[10px]"
      : size === "sm"
        ? "h-9 w-9 text-xs"
        : "h-12 w-12 text-sm";

  return (
    <div className="relative shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-white/80 dark:ring-white/10`}
        />
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 font-bold text-white shadow-lg shadow-cyan-500/20`}
        >
          {getInitials(name)}
        </div>
      )}
      {online ? (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
      ) : null}
    </div>
  );
}
