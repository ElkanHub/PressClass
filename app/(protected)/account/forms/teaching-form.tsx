"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateProfileTeaching, type ProfileTeachingInput } from "@/actions/profile";

const SUBJECTS = [
  "Mathematics", "English Language", "Science", "Integrated Science",
  "Social Studies", "ICT", "French", "Religious & Moral Education",
  "Creative Arts", "Physical Education", "History", "Geography",
  "Economics", "Government", "Literature", "Biology", "Chemistry", "Physics",
];

const CLASS_LEVELS = [
  "Kindergarten", "Primary 1-3", "Primary 4-6",
  "JHS 1", "JHS 2", "JHS 3",
  "SHS 1", "SHS 2", "SHS 3", "Tertiary",
];

const EXPERIENCE = [
  { value: "less_than_1", label: "Less than a year" },
  { value: "1_3", label: "1 – 3 years" },
  { value: "3_7", label: "3 – 7 years" },
  { value: "7_plus", label: "7+ years" },
];

const USE_CASES = [
  { value: "lesson_plans", label: "Lesson plans" },
  { value: "notes", label: "Study notes" },
  { value: "assessments", label: "Quizzes & assessments" },
  { value: "all", label: "All of the above" },
];

interface Props {
  initial: ProfileTeachingInput;
}

export function ProfileTeachingForm({ initial }: Props) {
  const [form, setForm] = useState<ProfileTeachingInput>(initial);
  const [pending, startTransition] = useTransition();

  function toggleArray(key: "preferredSubjects" | "preferredClassLevels", value: string) {
    setForm((f) => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }

  function save() {
    startTransition(async () => {
      try {
        await updateProfileTeaching(form);
        toast.success("Preferences saved");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't save");
      }
    });
  }

  return (
    <Card className="p-6 sm:p-8 space-y-8">
      <header>
        <h2 className="text-lg font-semibold">Teaching</h2>
        <p className="text-sm text-muted-foreground">
          We use these to calibrate generations to your classroom.
        </p>
      </header>

      <section className="space-y-3">
        <Label>Subjects you teach</Label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => {
            const active = form.preferredSubjects.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleArray("preferredSubjects", s)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:bg-muted"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <Label>Class levels</Label>
        <div className="flex flex-wrap gap-2">
          {CLASS_LEVELS.map((cl) => {
            const active = form.preferredClassLevels.includes(cl);
            return (
              <button
                key={cl}
                type="button"
                onClick={() => toggleArray("preferredClassLevels", cl)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:bg-muted"
                }`}
              >
                {cl}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <Label>Experience</Label>
          <RadioGroup
            value={form.teachingExperience}
            onValueChange={(v) =>
              setForm({ ...form, teachingExperience: v as ProfileTeachingInput["teachingExperience"] })
            }
            className="space-y-2"
          >
            {EXPERIENCE.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted cursor-pointer"
              >
                <RadioGroupItem value={opt.value} id={`exp-${opt.value}`} />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Primary use case</Label>
          <RadioGroup
            value={form.primaryUseCase}
            onValueChange={(v) =>
              setForm({ ...form, primaryUseCase: v as ProfileTeachingInput["primaryUseCase"] })
            }
            className="space-y-2"
          >
            {USE_CASES.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted cursor-pointer"
              >
                <RadioGroupItem value={opt.value} id={`uc-${opt.value}`} />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      </section>

      <section className="border-t pt-6">
        <label className="flex items-start gap-3 rounded-lg p-2">
          <Checkbox
            checked={form.marketingOptIn}
            onCheckedChange={(v) => setForm({ ...form, marketingOptIn: v === true })}
            className="mt-0.5"
          />
          <div>
            <div className="font-medium text-sm">Product updates & teaching tips</div>
            <div className="text-xs text-muted-foreground">
              Useful emails only — we don't spam.
            </div>
          </div>
        </label>
      </section>

      <div className="flex justify-end">
        <Button onClick={save} disabled={pending}>
          {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : "Save changes"}
        </Button>
      </div>
    </Card>
  );
}
