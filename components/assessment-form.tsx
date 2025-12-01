"use client";

import { useState } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    strand: z.string().min(2, "Topic is required"),
    subStrand: z.string().min(2, "Sub-topic is required"),
    classLevel: z.string().min(1, "Class level is required"),
    questionType: z.enum(["objective", "subjective", "mixed"]),
    quantity: z.coerce.number().min(1).max(20),
    subject: z.string().min(2, "Subject is required"),
    difficulty: z.enum(["easy", "normal", "hard", "mixed"]),
    difficultyConfig: z.object({
        easy: z.number().min(0).max(100),
        normal: z.number().min(0).max(100),
        hard: z.number().min(0).max(100),
    }).optional(),
}).refine((data) => {
    if (data.difficulty === "mixed" && data.difficultyConfig) {
        const total = data.difficultyConfig.easy + data.difficultyConfig.normal + data.difficultyConfig.hard;
        return total === 100;
    }
    return true;
}, {
    message: "Difficulty percentages must total 100%",
    path: ["difficultyConfig"],
});

type AssessmentFormValues = z.infer<typeof formSchema>;

export function AssessmentForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AssessmentFormValues>({
        resolver: zodResolver(formSchema) as Resolver<AssessmentFormValues>,
        defaultValues: {
            strand: "",
            subStrand: "",
            classLevel: "",
            questionType: "mixed",
            quantity: 5,
            subject: "",
            difficulty: "normal",
            difficultyConfig: { easy: 33, normal: 33, hard: 34 },
        },
    });

    const difficulty = form.watch("difficulty");
    const difficultyConfig = form.watch("difficultyConfig");

    const handleSliderChange = (type: "easy" | "normal" | "hard", value: number) => {
        const currentConfig = form.getValues("difficultyConfig") || { easy: 0, normal: 0, hard: 0 };
        const otherTypes = (["easy", "normal", "hard"] as const).filter((t) => t !== type);

        const remaining = 100 - value;
        const otherTotal = otherTypes.reduce((sum, t) => sum + currentConfig[t], 0);

        const newConfig = { ...currentConfig, [type]: value };

        if (otherTotal === 0) {
            // If others are 0, distribute remaining evenly
            const split = Math.floor(remaining / otherTypes.length);
            const remainder = remaining % otherTypes.length;

            otherTypes.forEach((t, index) => {
                newConfig[t] = split + (index < remainder ? 1 : 0);
            });
        } else {
            // Distribute proportionally
            let distributed = 0;
            otherTypes.forEach((t, index) => {
                if (index === otherTypes.length - 1) {
                    // Assign the rest to the last one to ensure exact sum
                    newConfig[t] = remaining - distributed;
                } else {
                    const ratio = currentConfig[t] / otherTotal;
                    const newVal = Math.round(remaining * ratio);
                    newConfig[t] = newVal;
                    distributed += newVal;
                }
            });
        }

        form.setValue("difficultyConfig", newConfig);
    };

    const onSubmit: SubmitHandler<AssessmentFormValues> = async (values) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error("Failed to generate questions");

            const data = await response.json();
            // Store results in localStorage or state management to display on results page
            // For simplicity, we'll pass it via query param or context, but localStorage is safer for large data
            localStorage.setItem("generatedAssessment", JSON.stringify(data));
            router.push("/results");
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto glass-card">
            <CardHeader>
                <CardTitle className="text-2xl">Generate Assessment</CardTitle>
                <CardDescription>
                    Enter the lesson details below to generate a custom assessment.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="e.g. Mathematics, Science"
                                {...form.register("subject")}
                            />
                            {form.formState.errors.subject && (
                                <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="strand">Strand (Topic)</Label>
                            <Input
                                id="strand"
                                placeholder="e.g. Algebra"
                                {...form.register("strand")}
                            />
                            {form.formState.errors.strand && (
                                <p className="text-sm text-destructive">{form.formState.errors.strand.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subStrand">Sub-strand (Sub-topic)</Label>
                            <Input
                                id="subStrand"
                                placeholder="e.g. Linear Equations"
                                {...form.register("subStrand")}
                            />
                            {form.formState.errors.subStrand && (
                                <p className="text-sm text-destructive">{form.formState.errors.subStrand.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="classLevel">Class Level</Label>
                            <select
                                id="classLevel"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...form.register("classLevel")}
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
                            {form.formState.errors.classLevel && (
                                <p className="text-sm text-destructive">{form.formState.errors.classLevel.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="questionType">Question Type</Label>
                            <select
                                id="questionType"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...form.register("questionType")}
                            >
                                <option value="mixed">Mixed Format</option>
                                <option value="objective">Objective (MCQs)</option>
                                <option value="subjective">Subjective</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min={1}
                                max={20}
                                {...form.register("quantity")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty</Label>
                            <select
                                id="difficulty"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...form.register("difficulty")}
                            >
                                <option value="easy">Easy</option>
                                <option value="normal">Normal</option>
                                <option value="hard">Hard</option>
                                <option value="mixed">Mixed</option>
                            </select>
                        </div>
                    </div>

                    {difficulty === "mixed" && (
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                            <h3 className="font-medium">Difficulty Distribution (Must total 100%)</h3>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <Label>Easy ({difficultyConfig?.easy}%)</Label>
                                </div>
                                <Slider
                                    value={[difficultyConfig?.easy || 0]}
                                    onValueChange={(vals) => handleSliderChange("easy", vals[0])}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <Label>Normal ({difficultyConfig?.normal}%)</Label>
                                </div>
                                <Slider
                                    value={[difficultyConfig?.normal || 0]}
                                    onValueChange={(vals) => handleSliderChange("normal", vals[0])}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <Label>Hard ({difficultyConfig?.hard}%)</Label>
                                </div>
                                <Slider
                                    value={[difficultyConfig?.hard || 0]}
                                    onValueChange={(vals) => handleSliderChange("hard", vals[0])}
                                    max={100}
                                    step={1}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-medium">Total:</span>
                                <span className={cn(
                                    "text-sm font-bold",
                                    (difficultyConfig?.easy || 0) + (difficultyConfig?.normal || 0) + (difficultyConfig?.hard || 0) === 100
                                        ? "text-green-600"
                                        : "text-destructive"
                                )}>
                                    {(difficultyConfig?.easy || 0) + (difficultyConfig?.normal || 0) + (difficultyConfig?.hard || 0)}%
                                </span>
                            </div>
                            {form.formState.errors.difficultyConfig && (
                                <p className="text-sm text-destructive">{form.formState.errors.difficultyConfig.message}</p>
                            )}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Questions...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Assessment
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
