"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, Gift } from "lucide-react";
import confetti from "canvas-confetti";

interface DailyLoginRewardModalProps {
  points: number | null;
  onClose: () => void;
}

export function DailyLoginRewardModal({ points, onClose }: DailyLoginRewardModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (points !== null && points > 0) {
      setOpen(true);
      // Trigger confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [points]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md text-center flex flex-col items-center p-8 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-amber-200/40 dark:border-amber-900/40 shadow-[0_0_50px_-12px_rgba(251,191,36,0.25)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4 ring-8 ring-amber-50 dark:ring-amber-900/10">
          <Gift className="h-10 w-10 text-amber-500 animate-bounce" />
        </div>
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-br from-amber-400 to-orange-600 bg-clip-text text-transparent">
            Điểm Danh Hàng Ngày
          </DialogTitle>
          <DialogDescription className="text-base mt-2 flex flex-col items-center">
            <span className="text-slate-600 dark:text-slate-300">Chào mừng bạn quay lại! Bạn nhận được</span>
            <span className="text-4xl font-black text-amber-500 my-4 flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              +{points}
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="text-slate-600 dark:text-slate-300 font-medium">điểm Learning Hub</span>
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={() => handleOpenChange(false)}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-8 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95"
        >
          Nhận điểm ngay
        </button>
      </DialogContent>
    </Dialog>
  );
}
