"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
    schoolName: z.string().optional(),
    classLevel: z.string().min(1, "Class is required"),
    subject: z.string().min(1, "Subject is required"),
    strand: z.string().min(1, "Strand is required"),
    subStrand: z.string().min(1, "Sub-strand is required"),
    date: z.date({
        message: "Date is required",
    }),
    weekTerm: z.string().min(1, "Week/Term is required"),
    duration: z.string().min(1, "Duration is required"),
});

export default function NotesGeneratorPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            schoolName: "",
            classLevel: "",
            subject: "",
            strand: "",
            subStrand: "",
            weekTerm: "",
            duration: "1 hour",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch("/api/generate/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    date: format(values.date, "PPP"),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate notes");
            }

            const data = await response.json();

            // Store the generated data in localStorage to pass to the result page
            // In a real app, we might want to save to DB immediately or use a state management library
            // For now, we'll save to DB immediately via a server action call from the client if needed,
            // or just pass data. Let's save it first to get an ID.

            // Actually, the requirement says "Save the notes to the dashboard" is an action on the result page.
            // So we should probably just display it first.
            // But to display it on a dynamic route [id], we need an ID.
            // So we should probably save it as a "draft" or just pass the data via state/storage.
            // Let's use localStorage for the "preview" and then save.
            // OR, we can save it immediately.
            // Let's follow the pattern: Generate -> Show Result (Preview) -> User can Save.
            // But the result page route is `/notes/[id]`. This implies it's already saved or has an ID.
            // If we want a preview, maybe `/notes/preview` or pass data.
            // Let's stick to the plan: "Redirects to result page on success".
            // If we redirect to `/notes/[id]`, it must exist in the DB.
            // So let's save it automatically?
            // "The result page should allow the teacher to: ... Save the notes to the dashboard".
            // This implies it's NOT saved yet.
            // So maybe the result page is a generic component that takes data, or we use a temporary ID/client-side state.
            // Let's use `localStorage` to store the generated content and redirect to a "result" page that reads it.
            // But the plan said `app/(protected)/notes/[id]/page.tsx`.
            // If I use `[id]`, I need an ID.
            // Let's change the plan slightly to have a `result` page that handles the display, 
            // or we save it immediately but mark it as "unsaved" or similar? No, that complicates things.
            // Let's use a query param or localStorage.
            // I'll create a new page `app/(protected)/generator/notes/result/page.tsx` for the immediate result,
            // and `app/(protected)/notes/[id]/page.tsx` for viewing saved notes.
            // Actually, let's just save it immediately for simplicity, but the requirement says "Save the notes to the dashboard" as an action.
            // This strongly suggests it's not saved by default.
            // So, I will use `localStorage` and redirect to `/generator/notes/result`.

            localStorage.setItem("generatedNotes", JSON.stringify(data));
            router.push("/generator/notes/result");

        } catch (error) {
            console.error(error);
            toast.error("Failed to generate notes. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto py-10 px-4 min-h-screen flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
                <Breadcrumb
                    items={[
                        { label: "Generator", href: "/generator" },
                        { label: "Notes Generator" },
                    ]}
                />
            </div>
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Study Notes Generator
                </h1>
                <p className="text-muted-foreground">
                    Provide the details below to generate an effective study note in minutes.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Notes Generator</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="schoolName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>School Name (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter school name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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

                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Mathematics" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="strand"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Strand (Main Topic)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Numbers" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="subStrand"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sub-Strand (Subtopic)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Fractions" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="weekTerm"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Week of Term + Term</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Week 3 of Term 2" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duration</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. 1 hour" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Notes...
                                    </>
                                ) : (
                                    "Generate Notes"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
