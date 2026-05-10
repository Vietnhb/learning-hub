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
import { Crown, Sparkles, Palette } from "lucide-react";
import { PremiumAvatarPaymentModal } from "@/components/PremiumAvatarPaymentModal";
import { AvatarFrameShop } from "@/components/community/AvatarFrameShop";
import { ProfileAvatar } from "@/components/UserAvatar";
import { Username } from "@/components/community/Username";
import { AVATAR_FRAMES, type AvatarFrameId } from "@/lib/designSystem";

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
  const [hasAvatarBorderUnlocked, setHasAvatarBorderUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFrameShop, setShowFrameShop] = useState(false);
  const [currentAvatarFrameId, setCurrentAvatarFrameId] =
    useState<AvatarFrameId | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<number | null>(null);
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
          setUserRole(userProfile.role_id || null);
          
          // Load avatar frame and inventory
          const { data } = await supabase
            .from("users")
            .select("avatar_frame_id, role_id, avatar_frames_inventory")
            .eq("id", authUser.id)
            .single();
          
          setCurrentAvatarFrameId(data?.avatar_frame_id || null);
          setInventory(data?.avatar_frames_inventory || []);

          // Load premium flag separately and ignore missing-column DBs
          const { data: premiumData, error: premiumError } = await supabase
            .from("users")
            .select("premium_avatar_border")
            .eq("id", authUser.id)
            .single();

          if (!premiumError) {
            setHasAvatarBorderUnlocked(
              Boolean(premiumData?.premium_avatar_border),
            );
          } else if ((premiumError as { code?: string }).code === "42703") {
            setHasAvatarBorderUnlocked(false);
          }
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

      // Upload to Firebase Storage
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, `avatars/${fileName}`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Update Supabase Auth user metadata
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: url },
      });

      if (error) throw error;

      // Also save avatar URL to users table
      const { error: dbError } = await supabase
        .from("users")
        .update({ avatar_url: url })
        .eq("id", authUser.id);

      if (dbError) throw dbError;

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
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <ArrowLeft className="w-4 h-4" />
              Quay lại Forum
            </Button>
          </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT SIDEBAR: Visual & Premium Identity */}
          <aside className="w-full lg:w-80 space-y-6 lg:sticky lg:top-8">
            {/* Avatar & Basic Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border shadow-md overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
                <CardContent className="pt-0 -mt-12 text-center pb-6">
                  <div
                    className="relative mx-auto mb-4 group cursor-pointer inline-block"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ProfileAvatar
                      userId={authUser?.id}
                      avatarUrl={avatarUrl || undefined}
                      userName={profile.full_name || "User"}
                      frameId={currentAvatarFrameId}
                      premiumBorderUnlocked={hasAvatarBorderUnlocked}
                    />
                    {hasAvatarBorderUnlocked && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-1 shadow-lg ring-2 ring-white dark:ring-gray-800">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploadingAvatar ? (
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    />
                  </div>
                  <div className="mb-1">
                    <Username 
                      userId={authUser.id} 
                      name={fullName || "User"} 
                      frameId={currentAvatarFrameId}
                      className="text-xl"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {profile.email}
                  </p>
                  <div className="flex flex-col items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                      {profile.role_id === 1 ? "👑 Admin" : "👤 Thành viên"}
                    </div>
                    {profile.points !== undefined && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm border border-amber-200/50 dark:border-amber-800/50">
                        <Sparkles className="w-3.5 h-3.5" />
                        {profile.points} Điểm
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Section Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {!hasAvatarBorderUnlocked ? (
                <Card className="border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 dark:border-yellow-900/30 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      🎁 Mở khóa Premium
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-yellow-700 dark:text-yellow-500/80 mb-4 leading-relaxed italic font-medium">
                      🚧 Chức năng VIP đang được phát triển và sẽ sớm ra mắt!
                    </p>
                    <Button
                      disabled
                      size="sm"
                      className="w-full bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed font-bold"
                    >
                      Sắp ra mắt
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-blue-900/30">
                  <CardContent className="py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Premium Active</h4>
                      <p className="text-[11px] text-blue-700 dark:text-blue-400">Viền avatar của bạn đã lấp lánh!</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Avatar Frame Shop Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 dark:border-cyan-900/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-cyan-800 dark:text-cyan-400 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    🎨 Kho Avatar Frames
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[10px] text-cyan-700/70 dark:text-cyan-500/60 mb-3 leading-tight">
                    Khám phá bộ sưu tập khung hình độc quyền và làm mới hồ sơ của bạn.
                  </p>
                  <div className="flex items-center gap-2 mb-4 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-cyan-100 dark:border-cyan-800">
                    <div className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400">Hiện tại</div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {currentAvatarFrameId ? AVATAR_FRAMES[currentAvatarFrameId]?.name : "Mặc định"}
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowFrameShop(true)}
                    size="sm"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold transition-all active:scale-95"
                  >
                    Mở Kho Frames
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </aside>

          {/* RIGHT CONTENT: Forms & Settings */}
          <main className="flex-1 w-full space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border shadow-md dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-500" />
                    Thông tin cá nhân
                  </CardTitle>
                  <CardDescription>Cập nhật hồ sơ công khai của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div className="grid gap-2">
                      <label htmlFor="fullName" className="text-sm font-semibold flex items-center gap-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.full_name ? "border-red-300 focus:ring-red-100" : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                        }`}
                        placeholder="Nguyễn Văn A"
                      />
                      {errors.full_name && <p className="text-xs text-red-500">{errors.full_name}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div className="grid gap-2">
                      <label htmlFor="dateOfBirth" className="text-sm font-semibold flex items-center gap-2">
                        Ngày sinh <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.date_of_birth ? "border-red-300 focus:ring-red-100" : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                        }`}
                      />
                      {errors.date_of_birth && <p className="text-xs text-red-500">{errors.date_of_birth}</p>}
                    </div>

                    {/* Success/Error Alerts */}
                    {successMessage && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">{successMessage}</p>
                      </div>
                    )}
                    {generalError && (
                      <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">{generalError}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lưu Thay Đổi"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security & Account Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border shadow-md dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    Bảo mật & Tài khoản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700/50 rounded-2xl border border-slate-100 dark:border-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Mật khẩu</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Bảo vệ tài khoản của bạn</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowPasswordModal(true)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl font-bold"
                    >
                      Thay đổi
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">Ngày gia nhập</div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {new Date(profile.created_at).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-gray-700/50 rounded-xl overflow-hidden">
                      <div className="text-gray-500 dark:text-gray-400 mb-1">ID Người dùng</div>
                      <div className="font-mono text-[10px] text-gray-900 dark:text-white truncate">
                        {profile.id}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Premium Avatar Payment Modal */}
      <PremiumAvatarPaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        userId={authUser?.id || ""}
        onSuccess={() => {
          setHasAvatarBorderUnlocked(true);
          setSuccessMessage("🎉 Avatar Premium đã được kích hoạt!");
          setTimeout(() => setSuccessMessage(""), 3000);
        }}
      />

      {/* Avatar Frame Shop Modal */}
      {authUser && profile && (
        <AvatarFrameShop
          open={showFrameShop}
          onOpenChange={setShowFrameShop}
          userId={authUser.id}
          userRole={profile.role_id}
          inventory={inventory}
          currentFrameId={currentAvatarFrameId}
          onFrameSelected={(frameId) => {
            setCurrentAvatarFrameId(frameId);
            setSuccessMessage("✨ Avatar frame đã được thay đổi!");
            setTimeout(() => setSuccessMessage(""), 3000);
          }}
        />
      )}
    </div>
  );
}
