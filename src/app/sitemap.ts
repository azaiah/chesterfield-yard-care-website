import type { MetadataRoute } from "next";
import { POSTS } from "@/content/blog";
import { SERVICE_CONTENT } from "@/content/services";
import { TOWNS_CONTENT } from "@/content/towns";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  const now = new Date();
  return [
    { url: u("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...["/services", "/areas", "/yard-club", "/quote"].map((p) => ({ url: u(p), lastModified: now, priority: 0.9 })),
    ...SERVICE_CONTENT.map((s) => ({ url: u(`/services/${s.slug}`), lastModified: now, priority: 0.9 })),
    ...TOWNS_CONTENT.map((t) => ({ url: u(`/areas/${t.slug}`), lastModified: now, priority: 0.8 })),
    ...["/gallery", "/reviews", "/about", "/faq", "/blog"].map((p) => ({ url: u(p), lastModified: now, priority: 0.6 })),
    ...POSTS.map((p) => ({ url: u(`/blog/${p.slug}`), lastModified: new Date(p.date), priority: 0.5 })),
    ...["/privacy", "/terms", "/credits"].map((p) => ({ url: u(p), lastModified: now, priority: 0.2 })),
  ];
}
