"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createClient();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    const [formData, setFormData] = useState({
        goals: "",
        usagePlan: "",
        additionalDetails: "",
    });

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/auth/login");
                return;
            }
            setUser(user);

            const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile?.onboarding_completed) {
                router.push("/protected"); // Or dashboard
            }
            setProfile(profile);
        };
        getUser();
    }, [router, supabase]);

    const handleNext = () => setStep((prev) => prev + 1);
    const handleBack = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // 1. Save responses
            const { error: responseError } = await supabase
                .from("onboarding_responses")
                .insert({
                    user_id: user.id,
                    goals: formData.goals,
                    usage_plan: formData.usagePlan,
                    additional_details: { details: formData.additionalDetails },
                });

            if (responseError) throw responseError;

            // 2. Mark onboarding as completed
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ onboarding_completed: true })
                .eq("id", user.id);

            if (profileError) throw profileError;

            // 3. Redirect
            router.push("/protected");
        } catch (error) {
            console.error("Onboarding error:", error);
            alert("Failed to save onboarding data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || !profile) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-muted-foreground">Step {step} of {totalSteps}</div>
                        <Progress value={progress} className="w-1/3" />
                    </div>
                    <CardTitle className="text-2xl">
                        {step === 1 && `Welcome, ${profile.full_name || "User"}!`}
                        {step === 2 && "Your Goals"}
                        {step === 3 && "All Set!"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Let's get you set up. Tell us a bit about what you're looking for."}
                        {step === 2 && "How do you plan to use PressClass AI?"}
                        {step === 3 && "You're ready to start creating assessments."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="goals">What are your primary goals?</Label>
                                <Textarea
                                    id="goals"
                                    placeholder="e.g. Save time on grading, create more diverse questions..."
                                    value={formData.goals}
                                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="usagePlan">How will you use the generated assessments?</Label>
                                <Textarea
                                    id="usagePlan"
                                    placeholder="e.g. Weekly quizzes, end of term exams, practice tests..."
                                    value={formData.usagePlan}
                                    onChange={(e) => setFormData({ ...formData, usagePlan: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="details">Any specific requirements? (Optional)</Label>
                                <Input
                                    id="details"
                                    placeholder="e.g. Specific curriculum alignment..."
                                    value={formData.additionalDetails}
                                    onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <CheckCircle2 className="h-8 w-8" />
                            </div>
                            <p className="text-muted-foreground">
                                Thank you for sharing your details. We've customized your experience based on your role as a <strong>{profile.user_type}</strong>.
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={step === 1 || isLoading}
                        className={step === 1 ? "invisible" : ""}
                    >
                        Back
                    </Button>

                    {step < totalSteps ? (
                        <Button onClick={handleNext}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Finishing...
                                </>
                            ) : (
                                "Get Started"
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
