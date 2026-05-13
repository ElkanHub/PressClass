import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { siteUrl } from "@/lib/seo";

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
  openGraph: {
    type: "website",
    siteName: "PressClass",
    url: siteUrl,
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
