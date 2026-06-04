"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ScrollToTopButtonProps = {
  className?: string;
};

export function ScrollToTopButton({ className }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 240);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      type="button"
      size="icon"
      aria-label="Cuộn lên đầu trang"
      title="Cuộn lên đầu trang"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full border-2 border-white bg-japan-indigo text-white shadow-xl transition hover:bg-japan-indigo/90 focus-visible:ring-4 focus-visible:ring-indigo-300 dark:border-gray-900 sm:bottom-8 sm:right-8",
        className,
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
