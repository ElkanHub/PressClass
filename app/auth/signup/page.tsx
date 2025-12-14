import Link from "next/link";
import { School, GraduationCap, BookOpen, User, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function SignupRoleSelection() {
    const roles = [
        {
            title: "School",
            description: "Register your institution to manage teachers and students.",
            icon: School,
            href: "/auth/signup/school",
        },
        {
            title: "Teacher",
            description: "Join your school and create assessments.",
            icon: GraduationCap,
            href: "/auth/signup/teacher",
        },
        {
            title: "Student",
            description: "Take assessments and track your progress.",
            icon: BookOpen,
            href: "/auth/signup/student",
        },
        {
            title: "Regular User",
            description: "Personal use access to the platform.",
            icon: User,
            href: "/auth/signup/regular",
        },
    ];

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center space-y-2">
                    <div className="h-16 flex items-center justify-center px-6 border-b border-border/50">
                        <Link href="/" className="flex items-center justify-center gap-2 font-bold text-3xl text-primary">
                            <div className="bg-primary/10 p-1.5 rounded-lg">
                                <Zap className="h-5 w-5 text-primary" />
                            </div>
                            <span>PressClass</span>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Join PressClass AI</h1>
                    <p className="text-muted-foreground">Choose how you want to use the platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roles.map((role) => (
                        <Link key={role.title} href={role.href} className="block group">
                            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <role.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle>{role.title}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {role.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
