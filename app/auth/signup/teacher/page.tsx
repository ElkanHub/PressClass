"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TeacherSignup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const fullName = formData.get("fullName") as string;
        const schoolName = formData.get("schoolName") as string;
        const accessKey = formData.get("accessKey") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            // 1. Verify School Name and Access Key
            const { data: school, error: schoolError } = await supabase
                .from("schools")
                .select("id")
                .ilike("name", schoolName) // Case-insensitive match
                .eq("access_key", accessKey)
                .single();

            if (schoolError || !school) {
                throw new Error("Invalid School Name or Access Key. Please verify with your school admin.");
            }

            // 2. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/confirm?next=/protected`,
                    data: {
                        full_name: fullName,
                        user_type: "teacher",
                        onboarding_completed: false,
                    },
                },
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Signup failed");

            // 3. Update profile with school_id
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ school_id: school.id })
                .eq("id", authData.user.id);

            if (profileError) throw profileError;

            router.push("/auth/sign-up-success");
        } catch (err: any) {
            console.error("Signup error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl">Teacher Registration</CardTitle>
                    </div>
                    <CardDescription>
                        Join your school to start creating assessments.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" placeholder="e.g. John Doe" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="schoolName">School Name</Label>
                            <Input id="schoolName" name="schoolName" placeholder="Enter your school's name" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="accessKey">School Access Key</Label>
                            <Input id="accessKey" name="accessKey" placeholder="Provided by your school admin" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="teacher@school.edu.gh" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required minLength={6} />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Register as Teacher"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-sm text-muted-foreground text-center">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                        <Link href="/auth/signup" className="hover:underline">
                            Back to role selection
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
