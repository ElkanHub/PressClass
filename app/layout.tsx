import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { siteUrl } from "@/lib/seo";
import { OfflineBanner } from "@/components/offline-banner";
import { AppleSplashLinks } from "@/components/apple-splash-links";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PressClass — AI for African teachers",
    template: "%s · PressClass",
  },
  description:
    "Plan lessons, generate notes, and build assessments in seconds. Curriculum-aware AI built for teachers across Africa.",
  applicationName: "PressClass",
  authors: [{ name: "PressClass" }],
  keywords: [
    "African teachers",
    "lesson plan generator",
    "AI lesson plans",
    "Ghana curriculum",
    "GES SBC",
    "WAEC",
    "NECO",
    "assessment generator",
    "teacher productivity",
    "study notes generator",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "PressClass",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "PressClass",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F766E" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <AppleSplashLinks />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <OfflineBanner />
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
