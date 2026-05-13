"use client";

// components/pwa-prompts.tsx
// Handles two app-shell prompts:
//   1. Install — Android/Chrome via the beforeinstallprompt event, iOS Safari
//      via a manual instruction toast (Apple doesn't fire the event).
//   2. Update — listens for a waiting service worker and offers a one-tap
//      reload that activates the new version.
//
// Mount inside the protected layout only so marketing pages stay quiet.

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Download, RefreshCw, Share } from "lucide-react";

// Chrome's beforeinstallprompt event (not yet in lib.dom.d.ts in older TS targets)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY = "pwa_install_dismissed_at";
const REMIND_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  // iOS Safari sets navigator.standalone when the app is installed
  return (window.navigator as any).standalone === true;
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
}

function recentlyDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  const at = Number(raw);
  if (Number.isNaN(at)) return false;
  return Date.now() - at < REMIND_AFTER_MS;
}

function markDismissed() {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }
}

export function PwaPrompts() {
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const shownInstallRef = useRef(false);
  const reloadingRef = useRef(false);

  // ---- INSTALL PROMPT (Chrome/Android) ----
  useEffect(() => {
    if (isStandalone()) return; // already installed
    if (recentlyDismissed()) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      maybeShowInstallToast();
    }

    function onInstalled() {
      // User installed via browser menu or after our prompt — clean up
      deferredPromptRef.current = null;
      shownInstallRef.current = false;
      localStorage.removeItem(STORAGE_KEY);
      toast.success("PressClass installed!", {
        description: "Look for the icon on your home screen.",
      });
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // Show after a short delay so we don't interrupt the very first paint.
    const t = window.setTimeout(maybeShowInstallToast, 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.clearTimeout(t);
    };

    function maybeShowInstallToast() {
      if (shownInstallRef.current) return;
      if (isStandalone()) return;

      // iOS path — no beforeinstallprompt event, show instructions
      if (isIos()) {
        shownInstallRef.current = true;
        toast(
          "Install PressClass on your iPhone",
          {
            duration: Infinity,
            icon: <Share className="h-4 w-4" />,
            description: "Tap the Share icon, then 'Add to Home Screen' for an app-like experience.",
            action: { label: "Got it", onClick: () => markDismissed() },
            onDismiss: markDismissed,
          }
        );
        return;
      }

      // Chrome/Android — only if we captured the deferred prompt
      const deferred = deferredPromptRef.current;
      if (!deferred) return;
      shownInstallRef.current = true;

      toast(
        "Install PressClass as an app",
        {
          duration: Infinity,
          icon: <Download className="h-4 w-4" />,
          description: "Faster launches, full-screen, and a home-screen icon.",
          action: {
            label: "Install",
            onClick: async () => {
              try {
                await deferred.prompt();
                const choice = await deferred.userChoice;
                if (choice.outcome === "dismissed") markDismissed();
                deferredPromptRef.current = null;
              } catch {
                markDismissed();
              }
            },
          },
          onDismiss: markDismissed,
        }
      );
    }
  }, []);

  // ---- SERVICE WORKER UPDATE PROMPT ----
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;

    function offerReload(worker: ServiceWorker) {
      toast(
        "Update ready",
        {
          duration: Infinity,
          icon: <RefreshCw className="h-4 w-4" />,
          description: "A new version of PressClass is ready. Reload to apply.",
          action: {
            label: "Reload",
            onClick: () => {
              reloadingRef.current = true;
              worker.postMessage({ type: "SKIP_WAITING" });
            },
          },
        }
      );
    }

    async function init() {
      try {
        registration = await navigator.serviceWorker.getRegistration() ?? null;
        if (!registration) return;

        // If there's already a waiting worker (we missed the updatefound),
        // surface the prompt now.
        if (registration.waiting && navigator.serviceWorker.controller) {
          offerReload(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          const installing = registration?.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              offerReload(installing);
            }
          });
        });

        // When the new SW takes control, reload the page once.
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (reloadingRef.current) {
            reloadingRef.current = false;
            window.location.reload();
          }
        });

        // Periodically check for updates while the tab is open.
        const checkInterval = window.setInterval(() => {
          registration?.update().catch(() => {});
        }, 60 * 60 * 1000); // every hour

        return () => window.clearInterval(checkInterval);
      } catch {
        // serviceWorker not supported or registration failed — silently ignore
      }
    }

    let cleanup: (() => void) | void;
    init().then((c) => (cleanup = c));

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  return null;
}
