import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://gdziekibel.pl", lastModified: new Date("2026-09-14"), changeFrequency: "weekly", priority: 1 }];
}
