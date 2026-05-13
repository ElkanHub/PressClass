import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    { path: "/",         changeFrequency: "weekly" as const,  priority: 1.0 },
    { path: "/features", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/pricing",  changeFrequency: "weekly" as const,  priority: 0.9 },
    { path: "/about",    changeFrequency: "yearly" as const,  priority: 0.5 },
    { path: "/faqs",     changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/auth/login",  changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/auth/signup", changeFrequency: "yearly" as const, priority: 0.7 },
  ];
  return routes.map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
