"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ALL_COUNTRIES, getCountry } from "@/lib/countries";
import { updateProfileBasic, type ProfileBasicInput } from "@/actions/profile";

interface Props {
  email: string;
  currency: string;
  initial: ProfileBasicInput;
}

export function ProfileBasicForm({ email, currency, initial }: Props) {
  const [form, setForm] = useState<ProfileBasicInput>(initial);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      try {
        await updateProfileBasic(form);
        toast.success("Profile updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't save");
      }
    });
  }

  const country = getCountry(form.countryCode);

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Your profile</h2>
        <p className="text-sm text-muted-foreground">
          Your name appears on PDFs you export. Country is used to bill in your local currency.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Ama Mensah"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} disabled readOnly />
          <p className="text-xs text-muted-foreground">
            Email changes aren't supported yet. Contact us if you need to switch.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <select
            id="country"
            value={form.countryCode}
            onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select your country</option>
            {ALL_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Currency: <span className="font-medium">{country?.currency ?? currency}</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone number <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            id="phone"
            value={form.phone ?? ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder={country?.dialCode || "+233 ..."}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} disabled={pending}>
          {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save changes"}
        </Button>
      </div>
    </Card>
  );
}
