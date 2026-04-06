import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/courses", changeFrequency: "weekly", priority: 0.75 },
  { path: "/resources", changeFrequency: "weekly", priority: 0.9 },
  { path: "/resources/SWD392", changeFrequency: "weekly", priority: 0.9 },
  { path: "/resources/JPD316", changeFrequency: "weekly", priority: 0.8 },
  { path: "/resources/JPD326", changeFrequency: "weekly", priority: 0.8 },
  { path: "/resources/FsoftTraining", changeFrequency: "weekly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
