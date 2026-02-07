"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/userService";
import { validateUserProfile } from "@/lib/validation";
import { User as UserType } from "@/types/user";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/auth/login");
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (authUser) {
        const userProfile = await getUserProfile(authUser.id);
        if (userProfile) {
          setProfile(userProfile);
          setFullName(userProfile.full_name || "");
          setDateOfBirth(userProfile.date_of_birth || "");
        }
        setLoadingProfile(false);
      }
    };

    if (authUser) {
      loadProfile();
    }
  }, [authUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setSuccessMessage("");

    // Validate
    const validation = validateUserProfile({
      full_name: fullName,
      date_of_birth: dateOfBirth,
    });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const result = await updateUserProfile(authUser!.id, {
        full_name: fullName,
        date_of_birth: dateOfBirth,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccessMessage("Cập nhật thông tin thành công!");

      // Reload profile
      const updatedProfile = await getUserProfile(authUser!.id);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }

      // Clear success message after 3s
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setGeneralError(err.message || "Cập nhật thông tin thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!authUser || !profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-2 border-pink-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Thông tin cá nhân
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Quản lý và cập nhật thông tin của bạn
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Read-only) */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email không thể thay đổi
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.full_name
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-pink-400"
                    }`}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                  {errors.full_name && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.full_name}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.date_of_birth
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-pink-400"
                    }`}
                    required
                  />
                  {errors.date_of_birth && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.date_of_birth}
                    </p>
                  )}
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Vai trò
                  </label>
                  <div className="px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50">
                    <span className="text-gray-700 font-medium">
                      {profile.role_id === 1 ? "👑 Admin" : "👤 User"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Vai trò do quản trị viên quản lý
                  </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-600">{successMessage}</p>
                  </div>
                )}

                {/* Error Message */}
                {generalError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{generalError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-6 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </form>

              {/* Info Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    ℹ️ Thông tin tài khoản
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Email không thể thay đổi sau khi đăng ký</li>
                    <li>• Vai trò của bạn do quản trị viên quản lý</li>
                    <li>• Thông tin cá nhân được bảo mật theo chính sách</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Thông tin tài khoản
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Ngày tạo:</span>
                  <span className="font-medium">
                    {new Date(profile.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono text-xs">{profile.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
