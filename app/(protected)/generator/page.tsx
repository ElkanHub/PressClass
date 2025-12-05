import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Breadcrumb } from "@/components/ui/breadcrumb";

export default function GeneratorHubPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <Breadcrumb items={[{ label: "Generator" }]} />
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Content Generator
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Select a tool to generate high-quality educational content powered by AI.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Link href="/generator/assessment" className="group">
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Assessment Generator</CardTitle>
                            <CardDescription>
                                Create quizzes, tests, and exams with various question types (objective, subjective, mixed).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                <li>Multiple choice & theory questions</li>
                                <li>Customizable difficulty levels</li>
                                <li>Instant answer keys</li>
                                <li>Export to PDF</li>
                            </ul>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/generator/lesson-plan" className="group">
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-purple-500/50 cursor-pointer">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                <BookOpen className="w-6 h-6 text-purple-600" />
                            </div>
                            <CardTitle className="text-2xl">Lesson Plan Generator</CardTitle>
                            <CardDescription>
                                Generate detailed, structured lesson plans aligned with the curriculum.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                <li>Structured lesson stages</li>
                                <li>Learning objectives & R.P.K.</li>
                                <li>Teaching materials list</li>
                                <li>Integrated assessment ideas</li>
                            </ul>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/generator/notes" className="group">
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-blue-500/50 cursor-pointer">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl">Notes Generator</CardTitle>
                            <CardDescription>
                                Create structured, curriculum-aligned notes for students.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                <li>Clear lesson summaries</li>
                                <li>Key points & definitions</li>
                                <li>Examples & illustrations</li>
                                <li>Review questions & resources</li>
                            </ul>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
