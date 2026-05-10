"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  AVATAR_FRAMES,
  ROLE_BADGES,
  getAllFrames,
  type AvatarFrameId,
} from "@/lib/designSystem";
import { AvatarFrame } from "@/components/community/AvatarFrame";
import { RoleBadge, RoleBadges } from "@/components/community/RoleBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Search } from "lucide-react";

export default function AvatarFramesAdmin() {
  const [selectedFrameId, setSelectedFrameId] = useState<AvatarFrameId | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRarity, setFilterRarity] = useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userFrameId, setUserFrameId] = useState<AvatarFrameId | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        // Fetch user's selected frame
        const { data } = await supabase
          .from("users")
          .select("avatar_frame_id")
          .eq("id", user.id)
          .single();

        if (data?.avatar_frame_id) {
          setUserFrameId(data.avatar_frame_id as AvatarFrameId);
          setSelectedFrameId(data.avatar_frame_id as AvatarFrameId);
        }
      }
    };
    fetchCurrentUser();
  }, []);

  const filteredFrames = getAllFrames().filter((frame) => {
    const matchesSearch = frame.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRarity =
      filterRarity === "all" || frame.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  const handleSelectFrame = async (frameId: AvatarFrameId) => {
    if (!currentUser) return;

    try {
      setSaving(true);
      setMessage("");

      const { error } = await supabase
        .from("users")
        .update({ avatar_frame_id: frameId })
        .eq("id", currentUser.id);

      if (error) throw error;

      setSelectedFrameId(frameId);
      setUserFrameId(frameId);
      setMessage("✅ Avatar frame updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            Avatar Frame Gallery
          </h1>
          <p className="text-gray-400">
            Chọn khung avatar yêu thích của bạn để hiển thị trạng thái cộng đồng
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-gray-800 border border-cyan-500/30 text-cyan-300">
            {message}
          </div>
        )}

        {/* Preview Section */}
        {selectedFrameId && (
          <Card className="mb-8 p-8 bg-gray-800 border-cyan-500/30">
            <h2 className="text-xl font-semibold text-white mb-6">Xem trước</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center gap-4">
                <AvatarFrame frameId={selectedFrameId} size="xl" animated>
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-bold text-white">
                    {currentUser?.email?.charAt(0).toUpperCase()}
                  </div>
                </AvatarFrame>
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    {AVATAR_FRAMES[selectedFrameId].name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {AVATAR_FRAMES[selectedFrameId].description}
                  </p>
                </div>
              </div>

              {/* Frame Info */}
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Loại</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {AVATAR_FRAMES[selectedFrameId].icon}
                    </span>
                    <span className="text-white font-semibold">
                      {AVATAR_FRAMES[selectedFrameId].name}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Độ hiếm</p>
                  <div className="capitalize px-3 py-1 rounded-full bg-gradient-to-r from-purple-600/50 to-indigo-600/50 text-purple-200 text-sm font-medium w-fit">
                    {AVATAR_FRAMES[selectedFrameId].rarity}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">Phong cách</p>
                  <div className="capitalize px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/50 to-blue-600/50 text-cyan-200 text-sm font-medium w-fit">
                    {AVATAR_FRAMES[selectedFrameId].theme}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm frame..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Rarity Filter */}
          <select
            aria-label="Filter frame rarity"
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tất cả độ hiếm</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        {/* Frame Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFrames.map((frame) => (
            <Card
              key={frame.id}
              className={`p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedFrameId === frame.id
                  ? "bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-cyan-500 ring-2 ring-cyan-500"
                  : "bg-gray-800 border-gray-700 hover:border-cyan-500/50"
              }`}
              onClick={() => handleSelectFrame(frame.id as AvatarFrameId)}
            >
              {/* Frame Preview */}
              <div className="flex justify-center mb-4">
                <AvatarFrame
                  frameId={frame.id as AvatarFrameId}
                  size="lg"
                  animated
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-2xl font-bold text-white">
                    {frame.icon}
                  </div>
                </AvatarFrame>
              </div>

              {/* Frame Info */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {frame.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {frame.description}
                </p>
              </div>

              {/* Badges */}
              <div className="flex justify-center gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 capitalize">
                  {frame.rarity}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 capitalize">
                  {frame.theme}
                </span>
              </div>

              {/* Select Button */}
              <Button
                className={`w-full ${
                  selectedFrameId === frame.id
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => handleSelectFrame(frame.id as AvatarFrameId)}
                disabled={saving}
              >
                {selectedFrameId === frame.id ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Selected
                  </>
                ) : (
                  "Select"
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Role Badges Showcase */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Role Badges</h2>
          <Card className="p-8 bg-gray-800 border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(ROLE_BADGES).map(([key, badge]) => (
                <div key={key} className="flex flex-col items-center gap-3">
                  <RoleBadge roleId={key as any} size="lg" animated />
                  <p className="text-xs text-gray-400 text-center">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
