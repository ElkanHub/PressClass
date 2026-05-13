"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorPicker } from "@/components/ui/color-picker";
import { CheckCircle2, Loader2, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { ALL_COUNTRIES, getCountry } from "@/lib/countries";
import { CURATED_SCHOOL_COLORS, CURATED_PERSONAL_COLORS, buildPalette } from "@/lib/brand";
import { completeOnboarding, type OnboardingPayload } from "@/actions/onboarding";
import { toast } from "sonner";

interface Props {
  userId: string;
  email: string;
  initialFullName: string;
  userType: "school" | "teacher" | "student" | "regular";
  initialCountryCode: string;
}

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

const EXPERIENCE_OPTIONS = [
  { value: "less_than_1", label: "Less than a year" },
  { value: "1_3",         label: "1 – 3 years" },
  { value: "3_7",         label: "3 – 7 years" },
  { value: "7_plus",      label: "7+ years" },
];

const USE_CASES = [
  { value: "lesson_plans", label: "Build lesson plans faster",   emoji: "📋" },
  { value: "notes",        label: "Create study notes for my students", emoji: "📝" },
  { value: "assessments",  label: "Generate quizzes & assessments",     emoji: "🎯" },
  { value: "all",          label: "All of the above",                   emoji: "✨" },
];

const REFERRALS = ["A colleague", "Social media", "Google search", "School", "Other"];

function generateDeviceHash(): string {
  if (typeof window === "undefined") return "";
  const raw = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}`,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency ?? "",
  ].join("|");
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h << 5) - h + raw.charCodeAt(i) | 0;
  return `dh_${h.toString(36)}`;
}

export default function OnboardingWizard({ initialFullName, initialCountryCode }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [pending, startTransition] = useTransition();

  const [form, setForm] = useState<OnboardingPayload>({
    fullName: initialFullName,
    countryCode: initialCountryCode,
    phone: "",
    currentSchool: "",
    schoolColor: CURATED_SCHOOL_COLORS[0],
    personalColor: CURATED_PERSONAL_COLORS[0],
    preferredSubjects: [],
    preferredClassLevels: [],
    teachingExperience: "",
    primaryUseCase: "",
    referralSource: "",
    marketingOptIn: true,
    deviceHash: "",
  });

  const steps = useMemo(
    () => [
      { id: "welcome",    title: "Welcome aboard!",                 subtitle: "Let's set up PressClass for the way you teach.", required: () => true },
      { id: "identity",   title: "Tell us about you",               subtitle: "We use this to personalize your dashboard.",   required: () => !!form.fullName.trim() && !!form.countryCode },
      { id: "school",     title: "Where do you teach?",             subtitle: "We'll add your school's name to the PDFs you export.", required: () => !!form.currentSchool.trim() },
      { id: "colors",     title: "Pick your colors",                subtitle: "These brand the PDFs you'll share with students.", required: () => /^#[0-9A-Fa-f]{6}$/.test(form.schoolColor) && /^#[0-9A-Fa-f]{6}$/.test(form.personalColor) },
      { id: "teaching",   title: "What do you teach?",              subtitle: "Pick what's relevant — you can change this later.", required: () => form.preferredSubjects.length > 0 && form.preferredClassLevels.length > 0 },
      { id: "experience", title: "Your experience",                 subtitle: "Helps us calibrate the difficulty of generations.", required: () => !!form.teachingExperience },
      { id: "use_case",   title: "What will you use PressClass for?", subtitle: "We'll surface the right tools first.",         required: () => !!form.primaryUseCase },
      { id: "referral",   title: "How did you hear about us?",      subtitle: "Last question — promise.",                       required: () => true },
      { id: "done",       title: "You're in!",                      subtitle: "Your free credits are loaded. Let's go.",        required: () => true },
    ],
    [form]
  );

  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const current = steps[step];
  const canAdvance = current.required();

  function update<K extends keyof OnboardingPayload>(key: K, value: OnboardingPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleArray(key: "preferredSubjects" | "preferredClassLevels", value: string) {
    setForm((f) => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }

  function next() {
    if (!canAdvance) return;
    if (step === totalSteps - 2) {
      const payload: OnboardingPayload = { ...form, deviceHash: generateDeviceHash() };
      startTransition(async () => {
        try {
          const result = await completeOnboarding(payload);
          if (result.duplicateFingerprint) {
            toast.warning("Welcome back! We noticed an existing account, so the signup bonus wasn't applied.");
          } else {
            toast.success(`🎉 ${result.creditsGranted} free credits added to your account!`);
          }
          setStep((s) => s + 1);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Could not save onboarding.");
        }
      });
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  const palette = buildPalette(form.schoolColor, form.personalColor);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-xl">
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium">Step {step + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{current.title}</h1>
          <p className="mt-2 text-muted-foreground">{current.subtitle}</p>
        </div>

        <div className="min-h-[300px]">
          {current.id === "welcome" && (
            <div className="space-y-4 text-center py-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg">
                Hey {initialFullName?.split(" ")[0] || "there"} 👋 — PressClass helps African teachers
                build lesson plans, notes and assessments in seconds.
              </p>
              <p className="text-sm text-muted-foreground">
                Quick setup (90 seconds, tops) and we'll drop
                <strong> 25 free credits </strong>into your account.
              </p>
            </div>
          )}

          {current.id === "identity" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="e.g. Ama Mensah" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={form.countryCode}
                  onChange={(e) => update("countryCode", e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select your country</option>
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
                {form.countryCode && (
                  <p className="text-xs text-muted-foreground">
                    Your billing currency will be {getCountry(form.countryCode)?.currency}.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number <span className="text-muted-foreground">(optional)</span></Label>
                <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder={getCountry(form.countryCode)?.dialCode || "+233 ..."} />
              </div>
            </div>
          )}

          {current.id === "school" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school">School you currently teach at</Label>
                <Input
                  id="school"
                  value={form.currentSchool}
                  onChange={(e) => update("currentSchool", e.target.value)}
                  placeholder="e.g. Accra Academy"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  This appears on the PDFs you download, so spell it the way you'd like it to look.
                </p>
              </div>
            </div>
          )}

          {current.id === "colors" && (
            <div className="space-y-6">
              <ColorPicker
                label="School color"
                description="Usually your school's main brand color. Used as the primary accent in your PDFs."
                value={form.schoolColor}
                onChange={(v) => update("schoolColor", v)}
                swatches={CURATED_SCHOOL_COLORS}
              />
              <ColorPicker
                label="Your personal color"
                description="A secondary accent. Pick something that feels like you."
                value={form.personalColor}
                onChange={(v) => update("personalColor", v)}
                swatches={CURATED_PERSONAL_COLORS}
              />
              <div className="rounded-lg border overflow-hidden">
                <div className="px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Preview</div>
                <div className="h-2" style={{ backgroundColor: palette.primary }} />
                <div className="h-1" style={{ backgroundColor: palette.accent }} />
                <div className="px-4 py-3 bg-white">
                  <div className="text-sm font-bold" style={{ color: palette.primaryInk }}>Sample Lesson Plan</div>
                  <div className="text-xs text-neutral-500 mt-0.5">Mathematics • JHS 2</div>
                  <div className="mt-3 inline-block rounded-md px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: palette.primarySoft, color: palette.primary }}>
                    OBJECTIVES
                  </div>
                </div>
              </div>
            </div>
          )}

          {current.id === "teaching" && (
            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Subjects you teach</Label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((s) => {
                    const active = form.preferredSubjects.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleArray("preferredSubjects", s)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-muted"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <Label className="mb-3 block">Class levels</Label>
                <div className="flex flex-wrap gap-2">
                  {CLASS_LEVELS.map((cl) => {
                    const active = form.preferredClassLevels.includes(cl);
                    return (
                      <button
                        key={cl}
                        type="button"
                        onClick={() => toggleArray("preferredClassLevels", cl)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-muted"}`}
                      >
                        {cl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {current.id === "experience" && (
            <RadioGroup
              value={form.teachingExperience}
              onValueChange={(v) => update("teachingExperience", v as OnboardingPayload["teachingExperience"])}
              className="space-y-3"
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted cursor-pointer">
                  <RadioGroupItem value={opt.value} id={opt.value} />
                  <span>{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          )}

          {current.id === "use_case" && (
            <RadioGroup
              value={form.primaryUseCase}
              onValueChange={(v) => update("primaryUseCase", v as OnboardingPayload["primaryUseCase"])}
              className="space-y-3"
            >
              {USE_CASES.map((uc) => (
                <label key={uc.value} className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted cursor-pointer">
                  <RadioGroupItem value={uc.value} id={uc.value} />
                  <span className="text-xl mr-1">{uc.emoji}</span>
                  <span>{uc.label}</span>
                </label>
              ))}
            </RadioGroup>
          )}

          {current.id === "referral" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {REFERRALS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => update("referralSource", r)}
                    className={`rounded-lg border p-4 text-left transition ${form.referralSource === r ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <label className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  checked={form.marketingOptIn}
                  onCheckedChange={(v) => update("marketingOptIn", v === true)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">Send me product updates & teaching tips</div>
                  <div className="text-sm text-muted-foreground">Useful emails only — never spam.</div>
                </div>
              </label>
            </div>
          )}

          {current.id === "done" && (
            <div className="space-y-4 text-center py-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-semibold">You're all set!</h2>
              <p className="text-muted-foreground">
                Your dashboard is ready. Let's create your first lesson plan.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={back} disabled={step === 0 || pending} className={step === 0 ? "invisible" : ""}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {step < totalSteps - 1 ? (
            <Button onClick={next} disabled={!canAdvance || pending}>
              {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {step === totalSteps - 2 ? "Finish" : "Continue"}
              {!pending && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          ) : (
            <Button onClick={() => router.push("/dashboard")}>
              Go to dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
