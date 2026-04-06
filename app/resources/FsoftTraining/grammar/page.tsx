"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AuthRequiredModal } from "@/components/AuthRequiredModal";

export default function FsoftTrainingGrammarComingSoonPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthRequiredModal show={true} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/resources/FsoftTraining">
          <Button variant="outline" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Quay lại FPT Software Training
          </Button>
        </Link>

        <Card className="p-10 text-center border-2 border-dashed border-amber-400 bg-white/90 dark:bg-gray-800/90">
          <h1 className="text-3xl font-bold text-amber-600 mb-3">Coming soon</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Ngữ pháp đang được cập nhật. Vui lòng quay lại sau.
          </p>
        </Card>
      </div>
    </div>
  );
}
