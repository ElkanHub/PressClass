"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, FileText, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createNote } from "@/actions/notes";
import { toast } from "sonner";

const formSchema = z.object({
    schoolName: z.string().optional(),
    classLevel: z.string().min(1, "Class level is required"),
    subject: z.string().min(1, "Subject is required"),
    strand: z.string().min(1, "Strand (Topic) is required"),
    subStrand: z.string().optional(),
    date: z.date({
        message: "Date is required",
    }),
    weekTerm: z.string().min(1, "Week/Term is required"),
    duration: z.string().min(1, "Duration is required"),
});

export function NotesForm() {
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            schoolName: "",
            classLevel: "",
            subject: "",
            strand: "",
            subStrand: "",
            weekTerm: "",
            duration: "60 mins",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsGenerating(true);
        try {
            // 1. Generate content via API
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "notes",
                    ...values,
                    date: format(values.date, "PPP"),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate notes");
            }

            const generatedContent = await response.json();

            // 2. Save to Database
            const result = await createNote({
                title: `${values.subject}: ${values.strand}`,
                school: values.schoolName,
                class_level: values.classLevel,
                subject: values.subject,
                strand: values.strand,
                sub_strand: values.subStrand,
                duration: values.duration,
                week_term: values.weekTerm,
                date: format(values.date, "yyyy-MM-dd"),
                content: generatedContent,
            });

            if (!result.success) {
                toast.error(result.error || "Failed to save notes");
                return;
            }

            toast.success("Notes generated successfully!");
            router.push(`/notes/${result.note?.id}`);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Notes Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* School Name */}
                        <FormField
                            control={form.control}
                            name="schoolName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>School Name (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. PressClass Academy" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Class Level */}
                            <FormField
                                control={form.control}
                                name="classLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class Level</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Basic 1">Basic 1</SelectItem>
                                                <SelectItem value="Basic 2">Basic 2</SelectItem>
                                                <SelectItem value="Basic 3">Basic 3</SelectItem>
                                                <SelectItem value="Basic 4">Basic 4</SelectItem>
                                                <SelectItem value="Basic 5">Basic 5</SelectItem>
                                                <SelectItem value="Basic 6">Basic 6</SelectItem>
                                                <SelectItem value="JHS 1">JHS 1</SelectItem>
                                                <SelectItem value="JHS 2">JHS 2</SelectItem>
                                                <SelectItem value="JHS 3">JHS 3</SelectItem>
                                                <SelectItem value="SHS 1">SHS 1</SelectItem>
                                                <SelectItem value="SHS 2">SHS 2</SelectItem>
                                                <SelectItem value="SHS 3">SHS 3</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Subject */}
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Science" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Strand */}
                            <FormField
                                control={form.control}
                                name="strand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Strand (Main Topic)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Living Things" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Sub-strand */}
                            <FormField
                                control={form.control}
                                name="subStrand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sub-strand (Sub-topic)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Plants" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date */}
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

                            {/* Duration */}
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. 60 mins" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Week/Term */}
                        <FormField
                            control={form.control}
                            name="weekTerm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Week & Term</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Week 1 of Term 1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Notes...
                                </>
                            ) : (
                                <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Generate Notes
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
