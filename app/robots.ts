import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/dashboard", "/generator", "/notes", "/lesson-plans", "/assessments", "/study-time", "/whiteboard", "/calendar", "/credits", "/onboarding", "/results", "/api"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
