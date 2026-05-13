// lib/seo.ts — single source of truth for the public site URL.
// Set NEXT_PUBLIC_SITE_URL in Vercel to your production domain.

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
