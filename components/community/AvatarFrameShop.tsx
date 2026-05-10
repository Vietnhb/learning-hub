"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarFrame } from "@/components/community/AvatarFrame";
import {
  AVATAR_FRAMES,
  getAllFrames,
  type AvatarFrameId,
} from "@/lib/designSystem";
import { Check, Search, Sparkles } from "lucide-react";

interface AvatarFrameShopProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentFrameId?: AvatarFrameId | null;
  onFrameSelected?: (frameId: AvatarFrameId) => void;
}

export const AvatarFrameShop: React.FC<AvatarFrameShopProps> = ({
  open,
  onOpenChange,
  userId,
  currentFrameId,
  onFrameSelected,
}) => {
  const [selectedFrame, setSelectedFrame] = useState<AvatarFrameId | null>(
    currentFrameId || null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRarity, setFilterRarity] = useState("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSelectedFrame(currentFrameId || null);
  }, [currentFrameId, open]);

  const filteredFrames = getAllFrames().filter((frame) => {
    const matchesSearch = frame.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRarity =
      filterRarity === "all" || frame.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  const handleSelectFrame = async () => {
    if (!selectedFrame || !userId) return;

    try {
      setLoading(true);
      setMessage("");

      const { error } = await supabase
        .from("users")
        .update({ avatar_frame_id: selectedFrame })
        .eq("id", userId);

      if (error) throw error;

      setMessage("✅ Avatar frame updated!");
      onFrameSelected?.(selectedFrame);
      window.dispatchEvent(new Event("learning-hub:user-profile-updated"));

      setTimeout(() => {
        onOpenChange(false);
        setMessage("");
      }, 1500);
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl text-white">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Avatar Frame Shop
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Chọn khung avatar yêu thích để hiển thị trạng thái của bạn trong
            cộng đồng
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 pb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm frame..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
            />
          </div>
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            aria-label="Lọc frame theo độ hiếm"
            title="Lọc frame theo độ hiếm"
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tất cả độ hiếm</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              message.includes("✅")
                ? "bg-emerald-600/20 border border-emerald-600/50 text-emerald-300"
                : "bg-red-600/20 border border-red-600/50 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Preview Selected Frame */}
        {selectedFrame && (
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-300 mb-3">Preview:</p>
            <div className="flex items-center gap-6">
              <div className="flex justify-center">
                <AvatarFrame frameId={selectedFrame} size="lg" animated>
                  <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                    {AVATAR_FRAMES[selectedFrame].icon}
                  </div>
                </AvatarFrame>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {AVATAR_FRAMES[selectedFrame].name}
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  {AVATAR_FRAMES[selectedFrame].description}
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-600 text-gray-200 capitalize">
                    {AVATAR_FRAMES[selectedFrame].rarity}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-600 text-gray-200 capitalize">
                    {AVATAR_FRAMES[selectedFrame].theme}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Frame Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {filteredFrames.map((frame) => (
            <button
              key={frame.id}
              onClick={() => setSelectedFrame(frame.id as AvatarFrameId)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedFrame === frame.id
                  ? "border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500"
                  : "border-gray-600 bg-gray-700 hover:border-cyan-500/50 hover:bg-gray-600"
              }`}
            >
              <div className="flex justify-center mb-3">
                <AvatarFrame
                  frameId={frame.id as AvatarFrameId}
                  size="md"
                  animated
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-lg font-bold text-white">
                    {frame.icon}
                  </div>
                </AvatarFrame>
              </div>
              <h4 className="text-sm font-semibold text-white text-center mb-2">
                {frame.name}
              </h4>
              <div className="flex gap-1 justify-center mb-2">
                <span className="px-1.5 py-0.5 text-xs rounded bg-gray-600 text-gray-200 capitalize">
                  {frame.rarity}
                </span>
              </div>
              {selectedFrame === frame.id && (
                <div className="flex justify-center">
                  <Check className="w-5 h-5 text-cyan-400" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-600">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSelectFrame}
            disabled={!selectedFrame || loading}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700"
          >
            {loading ? "Đang lưu..." : "Chọn Frame"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
