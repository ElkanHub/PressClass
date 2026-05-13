"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateUserPassword } from "@/actions/profile";

interface Props {
  email: string;
}

export function ProfileSecurityForm({ email }: Props) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    setError(null);
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    startTransition(async () => {
      try {
        await updateUserPassword(current, next);
        toast.success("Password updated");
        setCurrent("");
        setNext("");
        setConfirm("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't update password");
      }
    });
  }

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="text-sm text-muted-foreground">
          Change the password for <span className="font-medium text-foreground">{email}</span>.
        </p>
      </header>

      <div className="rounded-xl border bg-muted/30 p-4 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          We verify your current password before changing it — so a forgotten device can't silently rotate your credentials.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 max-w-2xl">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="current">Current password</Label>
          <Input
            id="current"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new">New password</Label>
          <Input
            id="new"
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm new password</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            minLength={8}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button onClick={save} disabled={pending || !current || !next || !confirm}>
          {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Update password"}
        </Button>
      </div>
    </Card>
  );
}
