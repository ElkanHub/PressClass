import Link from "next/link";
import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthPageShell } from "@/components/auth-page-shell";

export const dynamic = "force-dynamic";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const message = params?.error;
  return (
    <div className="rounded-xl border bg-destructive/5 p-4 flex items-start gap-3">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
        <AlertTriangle className="h-4 w-4" />
      </span>
      <div className="text-sm leading-relaxed text-foreground/90">
        {message ? (
          <>
            <div className="font-medium">Error</div>
            <div className="text-muted-foreground mt-0.5 break-words">{message}</div>
          </>
        ) : (
          <span className="text-muted-foreground">
            Something went wrong. Try signing in again.
          </span>
        )}
      </div>
    </div>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <AuthPageShell
      eyebrow="Authentication"
      title="That didn't work"
      description="We couldn't complete the action. Try again, or sign in to continue."
    >
      <Suspense>
        <ErrorContent searchParams={searchParams} />
      </Suspense>
      <div className="mt-6 flex flex-col gap-2">
        <Button asChild>
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </AuthPageShell>
  );
}
