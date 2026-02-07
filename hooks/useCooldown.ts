"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook quản lý cooldown cho gửi email
 * Lưu timestamp vào localStorage để giữ cooldown ngay cả khi reload
 */
export function useCooldown(key: string, cooldownSeconds: number = 60) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Kiểm tra cooldown từ localStorage khi mount
  useEffect(() => {
    const savedTimestamp = localStorage.getItem(`cooldown_${key}`);
    if (savedTimestamp) {
      const endTime = parseInt(savedTimestamp);
      const now = Date.now();
      const remaining = Math.ceil((endTime - now) / 1000);

      if (remaining > 0) {
        setSecondsLeft(remaining);
        setIsActive(true);
      } else {
        // Cooldown đã hết, xóa khỏi localStorage
        localStorage.removeItem(`cooldown_${key}`);
      }
    }
  }, [key]);

  // Countdown timer
  useEffect(() => {
    if (!isActive || secondsLeft <= 0) {
      setIsActive(false);
      localStorage.removeItem(`cooldown_${key}`);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          localStorage.removeItem(`cooldown_${key}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, secondsLeft, key]);

  // Hàm bắt đầu cooldown
  const startCooldown = useCallback(() => {
    const endTime = Date.now() + cooldownSeconds * 1000;
    localStorage.setItem(`cooldown_${key}`, endTime.toString());
    setSecondsLeft(cooldownSeconds);
    setIsActive(true);
  }, [key, cooldownSeconds]);

  return {
    secondsLeft,
    isActive,
    startCooldown,
  };
}
