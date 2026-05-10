import { AvatarFrameId } from "./designSystem";
import { supabase } from "./supabase";

export interface CachedUserData {
  frameId: AvatarFrameId | null;
  avatarUrl: string | null;
  isPremium?: boolean;
  lastFetched: number;
}

const userCache: Record<string, CachedUserData> = {};
const pendingPromises: Record<string, Promise<CachedUserData | null>> = {};
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
    delete pendingPromises[userId];
  } else {
    Object.keys(userCache).forEach(key => delete userCache[key]);
    Object.keys(pendingPromises).forEach(key => delete pendingPromises[key]);
  }
};

export const fetchUserCacheAsync = async (userId: string, force = false): Promise<CachedUserData | null> => {
  if (!force) {
    const cached = getCachedUser(userId);
    if (cached) return cached;
    if (userId in pendingPromises) return pendingPromises[userId];
  }

  const promise = (async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("avatar_frame_id, avatar_url, premium_avatar_border")
        .eq("id", userId)
        .single();
      
      if (error) {
        // If column premium_avatar_border does not exist on some envs, fallback
        if (error.code === '42703') {
           const { data: fallbackData } = await supabase
             .from("users")
             .select("avatar_frame_id, avatar_url")
             .eq("id", userId)
             .single();
             
           const userData = {
             frameId: (fallbackData?.avatar_frame_id || null) as AvatarFrameId | null,
             avatarUrl: fallbackData?.avatar_url || null,
             isPremium: false,
           };
           setCachedUser(userId, userData);
           return getCachedUser(userId);
        }
        throw error;
      }
      
      const userData = {
        frameId: (data?.avatar_frame_id || null) as AvatarFrameId | null,
        avatarUrl: data?.avatar_url || null,
        isPremium: Boolean(data?.premium_avatar_border),
      };
      
      setCachedUser(userId, userData);
      return getCachedUser(userId);
    } catch (error) {
      console.error("Error fetching user cache for", userId, error);
      return null;
    } finally {
      delete pendingPromises[userId];
    }
  })();

  pendingPromises[userId] = promise;
  return promise;
};
