import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://gdziewc.pl", lastModified: new Date("2026-09-15"), changeFrequency: "weekly", priority: 1 }];
}
