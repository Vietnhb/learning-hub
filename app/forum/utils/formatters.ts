export const formatTimeAgo = (value?: string | null) => {
  if (!value) return "vừa xong";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes} phút trước`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ trước`;
  return `${Math.floor(minutes / 1440)} ngày trước`;
};

export const getDisplayName = (email?: string | null) => {
  if (!email) return "Learning Hub member";
  return email.split("@")[0] ?? "Learning Hub member";
};

export const getInitials = (name?: string | null) =>
  (name || "LH")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
