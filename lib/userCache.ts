/**
 * Global Cache for User Frames and Avatars
 * Tránh việc fetch đi fetch lại nhiều lần cho cùng một user trong một phiên làm việc
 */

import { AvatarFrameId } from "./designSystem";

interface CachedUserData {
  frameId: AvatarFrameId | null;
  avatarUrl: string | null;
  lastFetched: number;
}

const userCache: Record<string, CachedUserData> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export const getCachedUser = (userId: string) => {
  const cached = userCache[userId];
  if (cached && Date.now() - cached.lastFetched < CACHE_TTL) {
    return cached;
  }
  return null;
};

export const setCachedUser = (userId: string, data: Omit<CachedUserData, "lastFetched">) => {
  userCache[userId] = {
    ...data,
    lastFetched: Date.now()
  };
};

export const clearUserCache = (userId?: string) => {
  if (userId) {
    delete userCache[userId];
  } else {
    Object.keys(userCache).forEach(key => delete userCache[key]);
  }
};
