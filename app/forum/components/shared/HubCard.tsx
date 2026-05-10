import { forwardRef, ReactNode } from "react";

export const HubCard = forwardRef<
  HTMLElement,
  {
    children: ReactNode;
    className?: string;
  }
>(function HubCard({ children, className = "" }, ref) {
  return (
    <section
      ref={ref}
      className={`rounded-[1.5rem] border border-white/70 bg-white/80 shadow-lg shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-black/30 ${className}`}
    >
      {children}
    </section>
  );
});
