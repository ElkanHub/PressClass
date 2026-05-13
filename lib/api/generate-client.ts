// lib/api/generate-client.ts — single client-side wrapper for /api/generate*.
// Surfaces typed errors so generator forms can show the right CTA.

import { toast } from "sonner";

export class GenerateApiError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function callGenerate<T = any>(endpoint: string, body: unknown): Promise<T & { _meta?: { creditsSpent: number; balanceAfter: number } }> {
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new GenerateApiError("NETWORK", "Couldn't reach the server. Check your connection.", 0);
  }
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const code = payload?.error ?? "INTERNAL";
    const message = payload?.message ?? "Generation failed.";
    throw new GenerateApiError(code, message, res.status);
  }
  return payload as any;
}

/** Show a sensible toast for the generation error. Returns true if it should also redirect to /credits. */
export function reportGenerateError(err: unknown): { redirectToCredits: boolean } {
  if (err instanceof GenerateApiError) {
    switch (err.code) {
      case "INSUFFICIENT_CREDITS":
        toast.error("You're out of credits.", {
          description: "Top up to continue generating.",
          action: { label: "Top up", onClick: () => { window.location.href = "/credits"; } },
        });
        return { redirectToCredits: false };
      case "RATE_LIMITED":
        toast.warning("You're generating too quickly. Wait a moment and try again.");
        return { redirectToCredits: false };
      case "UNAUTHENTICATED":
        toast.error("Please sign in again.");
        return { redirectToCredits: false };
      case "AI_PROVIDER_ERROR":
        toast.error("The AI provider had a hiccup. We refunded your credits — try again.");
        return { redirectToCredits: false };
      case "AI_PARSE_ERROR":
        toast.error("The AI returned an unexpected format. Credits refunded — please retry.");
        return { redirectToCredits: false };
      case "NETWORK":
        toast.error("Couldn't reach the server. Check your connection.");
        return { redirectToCredits: false };
      default:
        toast.error(err.message || "Something went wrong.");
        return { redirectToCredits: false };
    }
  }
  toast.error(err instanceof Error ? err.message : "Something went wrong.");
  return { redirectToCredits: false };
}
