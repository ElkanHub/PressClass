import Link from "next/link";
import { WifiOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-static";

export const metadata = {
  title: "Offline",
  description: "You're offline. Cached pages remain available.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <WifiOff className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">You're offline</h1>
          <p className="text-muted-foreground">
            This page hasn't been cached yet. Reconnect to load it. Pages you've already
            visited remain available.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild>
            <Link href="/dashboard">Go to dashboard <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Tip: open this app from your home screen for a faster, app-like experience.
        </p>
      </div>
    </main>
  );
}
