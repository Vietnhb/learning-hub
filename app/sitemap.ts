import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/forum", changeFrequency: "weekly", priority: 0.7 },
  { path: "/resources", changeFrequency: "weekly", priority: 0.95 },
  { path: "/resources/FsoftTraining", changeFrequency: "weekly", priority: 0.9 },
  { path: "/resources/FsoftTraining/kanji", changeFrequency: "weekly", priority: 0.8 },
  { path: "/resources/JPD316", changeFrequency: "weekly", priority: 0.9 },
  { path: "/resources/JPD316/vocabulary", changeFrequency: "weekly", priority: 0.85 },
  { path: "/resources/JPD316/grammar", changeFrequency: "weekly", priority: 0.85 },
  { path: "/resources/JPD316/kanji", changeFrequency: "weekly", priority: 0.85 },
  { path: "/resources/JPD326", changeFrequency: "weekly", priority: 0.85 },
  { path: "/resources/SWD392", changeFrequency: "weekly", priority: 0.95 },
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
