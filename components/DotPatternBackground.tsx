"use client";
import PixelBlast from "@/components/PixelBlast";
import { cn } from "@/lib/utils";

export function DotPatternBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-white dark:bg-[#f8fafc]",
        className,
      )}
    >
      {/* PixelBlast chiếm full diện tích, transparent để nền trắng hiện ra */}
      <PixelBlast
        color="#8b5cf6"
        pixelSize={4}
        liquid={false}
        enableRipples={true}
        transparent={true}
        patternScale={2}
        patternDensity={1.65}
        edgeFade={0.35}
        speed={0.4}
      />
    </div>
  );
}
