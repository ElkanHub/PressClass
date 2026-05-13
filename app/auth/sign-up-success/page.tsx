import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthPageShell } from "@/components/auth-page-shell";

export default function Page() {
  return (
    <AuthPageShell
      eyebrow="Almost there"
      title="Check your email"
      description="We sent you a confirmation link. Click it to finish setting up your account and claim your 25 free credits."
    >
      <div className="rounded-xl border bg-muted/30 p-4 flex items-start gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
          <Mail className="h-4 w-4" />
        </span>
        <div className="text-sm text-muted-foreground leading-relaxed">
          Didn't get it? Check your spam folder. Some networks slow email
          delivery by a minute or two.
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <Button asChild variant="outline">
          <Link href="/auth/login">Back to sign in</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Return home <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
        </Button>
      </div>
    </AuthPageShell>
  );
}
