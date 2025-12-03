"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

export default function StudentSignup() {
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
        const classLevel = formData.get("classLevel") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/confirm?next=/dashboard`,
                    data: {
                        full_name: fullName,
                        user_type: "student",
                        onboarding_completed: false,
                    },
                },
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Signup failed");

            // Update profile with class_level
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ class_level: classLevel })
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
                        <BookOpen className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl">Student Registration</CardTitle>
                    </div>
                    <CardDescription>
                        Create an account to take assessments and track your progress.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" placeholder="e.g. Jane Doe" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="classLevel">Class Level</Label>
                            <select
                                id="classLevel"
                                name="classLevel"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="">Select Level</option>
                                <option value="B1">Basic 1</option>
                                <option value="B2">Basic 2</option>
                                <option value="B3">Basic 3</option>
                                <option value="B4">Basic 4</option>
                                <option value="B5">Basic 5</option>
                                <option value="B6">Basic 6</option>
                                <option value="JHS 1">JHS 1</option>
                                <option value="JHS 2">JHS 2</option>
                                <option value="JHS 3">JHS 3</option>
                                <option value="SHS 1">SHS 1</option>
                                <option value="SHS 2">SHS 2</option>
                                <option value="SHS 3">SHS 3</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="student@example.com" required />
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
                                "Register as Student"
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
