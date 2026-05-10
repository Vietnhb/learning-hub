"use client";

import { useState, useEffect, useRef } from "react";
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
  Key,
  Camera,
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
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import Link from "next/link";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/auth/login");
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (authUser) {
        setAvatarUrl(authUser.user_metadata?.avatar_url || "");
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;

    try {
      setUploadingAvatar(true);
      setGeneralError("");

      const fileExt = file.name.split(".").pop();
      const fileName = `${authUser.id}-${Math.random()}.${fileExt}`;
      const storageRef = ref(storage, `avatars/${fileName}`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: url },
      });

      if (error) throw error;

      setAvatarUrl(url);
      setSuccessMessage("Cập nhật ảnh đại diện thành công!");
      window.dispatchEvent(new Event("learning-hub:user-profile-updated"));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setGeneralError(err.message || "Lỗi khi tải ảnh lên");
    } finally {
      setUploadingAvatar(false);
    }
  };

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

      window.dispatchEvent(new Event("learning-hub:user-profile-updated"));

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (!authUser || !profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
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
          <Card className="border shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="text-center">
              <div
                className="relative mx-auto w-24 h-24 mb-4 group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploadingAvatar ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-white text-[10px] font-medium">
                        Thay ảnh
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  aria-label="Upload profile avatar image"
                  title="Choose an image file to upload as your profile avatar"
                />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    readOnly
                    placeholder="your.email@example.com"
                    title="Email address (read-only)"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email không thể thay đổi
                  </p>
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.full_name
                        ? "border-red-300 dark:border-red-700 focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    }`}
                    placeholder="Nguyễn Văn A"
                    title="Enter your full name"
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
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.date_of_birth
                        ? "border-red-300 dark:border-red-700 focus:border-red-400"
                        : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                    }`}
                    placeholder="dd/mm/yyyy"
                    title="Select your date of birth"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Vai trò
                  </label>
                  <div className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {profile.role_id === 1 ? "👑 Admin" : "👤 User"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold shadow-md transition-all"
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
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    ℹ️ Thông tin tài khoản
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
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
          <Card className="border dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Thông tin tài khoản
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
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

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="border dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Bảo mật
              </CardTitle>
              <CardDescription>
                Quản lý mật khẩu và cài đặt bảo mật tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Mật khẩu
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Thay đổi mật khẩu đăng nhập của bạn
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowPasswordModal(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Đổi mật khẩu
                  </Button>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                    🔒 Bảo mật mật khẩu
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                    <li>✓ Mật khẩu được mã hóa tự động bởi Supabase Auth</li>
                    <li>
                      ✓ Không bao giờ lưu mật khẩu dưới dạng văn bản thường
                    </li>
                    <li>✓ Sử dụng mật khẩu mạnh ít nhất 6 ký tự</li>
                    <li>✓ Không chia sẻ mật khẩu với bất kỳ ai</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
