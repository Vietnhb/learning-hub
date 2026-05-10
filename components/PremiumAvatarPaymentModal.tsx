"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, Loader2, CreditCard } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PremiumAvatarPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSuccess?: () => void;
}

export function PremiumAvatarPaymentModal({
  open,
  onOpenChange,
  userId,
  onSuccess,
}: PremiumAvatarPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUnlock = async () => {
    setLoading(true);
    setError("");

    try {
      // In production, integrate with Stripe/PayPal here
      // For now, we'll just update the database directly (demo)
      const { error: updateError } = await supabase
        .from("users")
        .update({ premium_avatar_border: true })
        .eq("id", userId);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Lỗi khi nâp tiền");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>💎 Nâng cấp Premium</DialogTitle>
          <DialogDescription>
            Mở khóa viền avatar lấp lánh với hiệu ứng shimmer độc quyền
          </DialogDescription>
        </DialogHeader>

        {!success ? (
          <div className="space-y-4">
            {/* Pricing */}
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Gói Premium Avatar
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  $9.99
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                    /tháng
                  </span>
                </span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Viền avatar lấp lánh
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Hiệu ứng shimmer độc quyền
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Badge Premium trên hồ sơ
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Hủy bất kỳ lúc nào
                </li>
              </ul>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 dark:text-red-300">
                  Đang Update
                </p>
              </div>
            )}

            {/* Payment Methods */}
            <div className="space-y-3">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  🚧 Chức năng VIP đang được bảo trì và sẽ sớm quay trở lại!
                </p>
              </div>
              <Button
                disabled={true}
                className="w-full gap-2 bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed h-10"
              >
                <CreditCard className="w-4 h-4" />
                Thanh toán tạm đóng
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Quay lại
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              💳 Thanh toán an toàn qua Stripe
            </p>
          </div>
        ) : (
          <div className="py-8 text-center space-y-3">
            <div className="flex justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                ✨ Thành công!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Avatar Premium của bạn đã được kích hoạt
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
