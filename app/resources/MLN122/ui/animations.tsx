/**
 * Animation Components
 * Game feel animations for economic storytelling and visual feedback
 */

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { CoinIcon } from "./pixel-art";
import { Z_LAYERS } from "../core/rendering";

// ===== TRANSITION ANIMATIONS =====

/**
 * Screen transition wrapper
 */
export function ScreenTransition({ children, screenKey }: { children: ReactNode; screenKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Slide in from side
 */
export function SlideIn({
  children,
  direction = "left",
  delay = 0,
}: {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}) {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -30 : direction === "right" ? 30 : 0,
      y: direction === "up" ? -30 : direction === "down" ? 30 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger children animations
 */
export function StaggerContainer({ children, staggerDelay = 0.1 }: { children: ReactNode; staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger child item
 */
export function StaggerItem({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
}

// ===== ECONOMIC STORYTELLING ANIMATIONS =====

/**
 * Coin transfer animation from capitalist to landlord
 */
export function CoinTransferAnimation({
  amount,
  fromLabel = "Nhà tư bản",
  toLabel = "Địa chủ",
  onComplete,
}: {
  amount: number;
  fromLabel?: string;
  toLabel?: string;
  onComplete?: () => void;
}) {
  return (
    <div className="coin-transfer-container relative mx-auto h-32 w-full max-w-2xl">
      {/* From (Capitalist) */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#f5cf72] bg-[#2d4c28]">
            <span className="text-2xl">💼</span>
          </div>
          <span className="text-xs font-bold text-white">{fromLabel}</span>
        </div>
      </motion.div>

      {/* To (Landlord) */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#d94b35] bg-[#20361d]">
            <span className="text-2xl">🏛️</span>
          </div>
          <span className="text-xs font-bold text-white">{toLabel}</span>
        </div>
      </motion.div>

      {/* Animated coins */}
      <AnimatePresence>
        {[...Array(Math.min(5, Math.ceil(amount / 50)))].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-8 top-1/2"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: ["0%", "50%", "100%"].map((x) => `calc(${x} + ${i * 10}px)`),
              y: [0, -50, 0],
              opacity: [1, 1, 0.3],
              scale: [1, 1.3, 0.7],
            }}
            transition={{
              duration: 1.5,
              delay: 0.5 + i * 0.15,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => {
              if (i === Math.min(4, Math.ceil(amount / 50) - 1) && onComplete) {
                onComplete();
              }
            }}
            style={{ zIndex: Z_LAYERS.EFFECTS }}
          >
            <CoinIcon scale={2} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Amount label */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div className="border-2 border-[#f5cf72] bg-black/80 px-4 py-2 backdrop-blur-sm">
          <p className="text-xs font-bold uppercase text-[#f5cf72]">Tô điền</p>
          <p className="font-mono text-2xl font-black text-white">{amount}c</p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Harvest effect animation
 */
export function HarvestEffect({ x, y, value }: { x: number; y: number; value: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: x, top: y, zIndex: Z_LAYERS.EFFECTS }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -50, scale: 1.3 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="flex items-center gap-1 rounded-none border-2 border-[#f5cf72] bg-black/90 px-2 py-1">
        <span className="text-lg">🌾</span>
        <span className="font-mono text-sm font-black text-[#f5cf72]">+{value}</span>
      </div>
    </motion.div>
  );
}

/**
 * Productivity boost effect
 */
export function ProductivityBoostEffect({ label, x, y }: { label: string; x: number; y: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: x, top: y, zIndex: Z_LAYERS.EFFECTS }}
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1.2, 1.5], y: -40 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2 rounded-none border-2 border-[#7fc66a] bg-black/90 px-3 py-1.5 shadow-lg">
        <span className="text-lg">⚡</span>
        <span className="text-xs font-black text-[#7fc66a]">{label}</span>
      </div>
    </motion.div>
  );
}

/**
 * Value creation pulse from workers
 */
export function ValueCreationPulse({ workerIndex }: { workerIndex: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 h-full w-full"
      style={{ zIndex: Z_LAYERS.EFFECTS }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0.8, 1.5, 2],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay: workerIndex * 0.3,
        ease: "easeOut",
      }}
    >
      <div className="h-full w-full rounded-full bg-[#7fc66a]/20" />
    </motion.div>
  );
}

// ===== BUTTON & UI ANIMATIONS =====

/**
 * Animated button with hover and press states
 */
export function AnimatedButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const colors = {
    primary: "bg-[#7fc66a] text-[#0b1209]",
    secondary: "bg-[#f5cf72] text-[#2d2114]",
    danger: "bg-[#d94b35] text-white",
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`pixel-button ${colors[variant]} ${className}`}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 1 } : {}}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.button>
  );
}

/**
 * Pulse animation for emphasis
 */
export function PulseHighlight({ children, active = true }: { children: ReactNode; active?: boolean }) {
  return (
    <motion.div
      animate={
        active
          ? {
              boxShadow: [
                "0 0 0 0 rgba(245, 207, 114, 0)",
                "0 0 0 8px rgba(245, 207, 114, 0.4)",
                "0 0 0 16px rgba(245, 207, 114, 0)",
              ],
            }
          : {}
      }
      transition={active ? { duration: 2, repeat: Infinity } : {}}
    >
      {children}
    </motion.div>
  );
}

/**
 * Number counter animation
 */
export function CountUp({
  from = 0,
  to,
  duration = 1,
  suffix = "",
}: {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const startTime = performance.now();
    const durationMs = duration * 1000;
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [duration, from, to]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Math.round(value)}
      {suffix}
    </motion.span>
  );
}

/**
 * Pop-in animation for cards
 */
export function PopIn({
  children,
  delay = 0,
  scale = 0.9,
}: {
  children: ReactNode;
  delay?: number;
  scale?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, type: "spring", stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Shake animation for errors or alerts
 */
export function Shake({ children, trigger }: { children: ReactNode; trigger: boolean }) {
  return (
    <motion.div
      animate={
        trigger
          ? {
              x: [0, -10, 10, -10, 10, 0],
            }
          : {}
      }
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// ===== LOADING ANIMATIONS =====

/**
 * Pixel-style loading dots
 */
export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 bg-[#f5cf72]"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Progress bar animation
 */
export function ProgressBar({
  progress,
  color = "#7fc66a",
  height = 8,
}: {
  progress: number;
  color?: string;
  height?: number;
}) {
  return (
    <div className="w-full overflow-hidden border-2 border-[#0b1209]" style={{ height }}>
      <motion.div
        className="h-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

// ===== TOOLTIP ANIMATION =====

/**
 * Animated tooltip
 */
export function Tooltip({
  children,
  content,
  position = "top",
}: {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <div className="tooltip-container relative inline-block">
      {children}
      <motion.div
        className="tooltip-content pointer-events-none absolute z-50 hidden whitespace-nowrap border-2 border-[#0b1209] bg-black/95 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm group-hover:block"
        initial={{ opacity: 0, y: position === "top" ? 5 : -5 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          [position]: "100%",
          left: position === "top" || position === "bottom" ? "50%" : undefined,
          transform: position === "top" || position === "bottom" ? "translateX(-50%)" : undefined,
        }}
      >
        {content}
      </motion.div>
    </div>
  );
}

/**
 * Confetti burst for celebration
 */
export function ConfettiBurst({ trigger }: { trigger: boolean }) {
  if (!trigger) return null;

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: Z_LAYERS.OVERLAY }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2"
          style={{
            left: "50%",
            top: "50%",
            backgroundColor: ["#f5cf72", "#7fc66a", "#d94b35", "#9ed7ef"][i % 4],
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((i / 20) * Math.PI * 2) * 300,
            y: Math.sin((i / 20) * Math.PI * 2) * 300 - 100,
            opacity: 0,
            scale: [1, 1.5, 0.5],
            rotate: 360,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
