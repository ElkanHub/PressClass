"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, School } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

export default function SchoolSignup() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const schoolName = formData.get("schoolName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const contactPerson = formData.get("contactPerson") as string;

        try {
            // 1. Sign up the user (Admin)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/confirm?next=/dashboard`,
                    data: {
                        full_name: schoolName, // Using school name as profile name for now
                        user_type: "school",
                        onboarding_completed: false,
                    },
                },
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Signup failed");

            // 2. Create the School entry
            // The access_key is generated automatically by the database default
            const { data: schoolData, error: schoolError } = await supabase
                .from("schools")
                .insert({
                    name: schoolName,
                    email: email,
                    contact_person: contactPerson,
                })
                .select()
                .single();

            if (schoolError) throw schoolError;

            // 3. Update the user's profile with the school_id
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ school_id: schoolData.id })
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
                        <School className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl">School Registration</CardTitle>
                    </div>
                    <CardDescription>
                        Register your institution to manage teachers and students.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="schoolName">School Name</Label>
                            <Input id="schoolName" name="schoolName" placeholder="e.g. Accra High School" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactPerson">Contact Person (Optional)</Label>
                            <Input id="contactPerson" name="contactPerson" placeholder="e.g. Mr. Mensah" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">School Email</Label>
                            <Input id="email" name="email" type="email" placeholder="admin@school.edu.gh" required />
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
                                "Register School"
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
