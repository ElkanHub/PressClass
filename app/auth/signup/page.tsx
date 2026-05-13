"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, GraduationCap, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HERO_IMAGE } from "@/lib/images";
import GoogleAuthButton from "@/components/google-auth-button";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const fd = new FormData(event.currentTarget);
    const fullName = String(fd.get("fullName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Default Supabase email templates redirect back here with ?code=...,
          // which `/auth/callback` exchanges for a session. /auth/confirm also
          // accepts ?code= for custom templates.
          emailRedirectTo: `${location.origin}/auth/callback?next=/onboarding`,
          data: { full_name: fullName, user_type: "teacher", onboarding_completed: false },
        },
      });
      if (authError) throw authError;
      router.push("/auth/sign-up-success");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="50vw"
          className="object-cover"
          style={{ objectPosition: HERO_IMAGE.focus }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-primary/60" />
        <div className="relative h-full flex flex-col justify-between text-primary-foreground p-12">
          <Link href="/" className="text-2xl font-bold">PressClass</Link>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 backdrop-blur px-3 py-1 text-sm">
              <Sparkles className="h-4 w-4" />
              Built for African teachers
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Plan lessons. Generate notes. Build assessments — in seconds.
            </h1>
            <p className="text-lg opacity-90">
              Join thousands of teachers using PressClass to reclaim their evenings.
              Get <span className="font-semibold">25 free credits</span> when you finish setup.
            </p>
          </div>
          <p className="text-sm opacity-70">© {new Date().getFullYear()} PressClass</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-medium text-muted-foreground">Teacher signup</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-muted-foreground mt-2">90 seconds. No credit card.</p>
          </div>

          <div className="space-y-4">
            <GoogleAuthButton />
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" placeholder="Ama Mensah" required autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
              <p className="text-xs text-muted-foreground">At least 8 characters.</p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account…</>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
