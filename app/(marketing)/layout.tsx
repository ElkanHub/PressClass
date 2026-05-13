import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: {
    default: "PressClass — AI for African teachers",
    template: "%s · PressClass",
  },
  description:
    "Plan lessons, generate notes, and build assessments in seconds. Curriculum-aware AI built for teachers across Africa. Pay only for what you generate — no subscription.",
  openGraph: {
    type: "website",
    siteName: "PressClass",
    title: "PressClass — AI for African teachers",
    description:
      "Plan lessons, generate notes, and build assessments in seconds. No subscription — pay only for what you generate.",
    locale: "en_GH",
  },
  twitter: {
    card: "summary_large_image",
    title: "PressClass — AI for African teachers",
    description:
      "Plan lessons, generate notes, and build assessments in seconds.",
  },
  robots: { index: true, follow: true },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
