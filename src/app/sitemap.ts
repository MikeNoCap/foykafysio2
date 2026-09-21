import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["", 1],
    ["/osteopati", 0.9],
    ["/ultralyd", 0.8],
    ["/bestill-time", 0.8],
    ["/allmenn-fysioterapi", 0.7],
    ["/psykomotorisk-fysioterapi", 0.7],
    ["/kvinnehelse", 0.7],
    ["/personvern", 0.2],
  ];
  return pages.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority,
  }));
}
