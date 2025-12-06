"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getNote, updateNote } from "@/actions/notes";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const formSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
    administrativeDetails: z.object({
        school: z.string().optional(),
        class: z.string().min(1, "Class is required"),
        subject: z.string().min(1, "Subject is required"),
        date: z.string().min(1, "Date is required"),
        weekTerm: z.string().min(1, "Week/Term is required"),
        duration: z.string().min(1, "Duration is required"),
    }),
    lessonSummary: z.string().min(1, "Lesson Summary is required"),
    keyPoints: z.array(z.object({ value: z.string().min(1, "Key point cannot be empty") })),
    examples: z.array(z.object({ value: z.string().min(1, "Example cannot be empty") })),
    activity: z.string().min(1, "Activity is required"),
    resources: z.array(z.object({ value: z.string().min(1, "Resource cannot be empty") })),
});

export default function EditNotePage() {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            topic: "",
            administrativeDetails: {
                school: "",
                class: "",
                subject: "",
                date: "",
                weekTerm: "",
                duration: "",
            },
            lessonSummary: "",
            keyPoints: [],
            examples: [],
            activity: "",
            resources: [],
        },
    });

    const { fields: keyPointsFields, append: appendKeyPoint, remove: removeKeyPoint } = useFieldArray({
        control: form.control,
        name: "keyPoints",
    });

    const { fields: examplesFields, append: appendExample, remove: removeExample } = useFieldArray({
        control: form.control,
        name: "examples",
    });

    const { fields: resourcesFields, append: appendResource, remove: removeResource } = useFieldArray({
        control: form.control,
        name: "resources",
    });

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const data = await getNote(params.id as string);
                if (!data) {
                    toast.error("Note not found");
                    router.push("/notes");
                    return;
                }

                // Transform string arrays to object arrays for the form
                const formData = {
                    ...data.content,
                    keyPoints: data.content.keyPoints.map((point: string) => ({ value: point })),
                    examples: data.content.examples.map((example: string) => ({ value: example })),
                    resources: data.content.resources.map((resource: string) => ({ value: resource })),
                };

                form.reset(formData);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch note");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchNote();
        }
    }, [params.id, router, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSaving(true);
        try {
            // Transform object arrays back to string arrays for the API
            const noteData = {
                ...values,
                keyPoints: values.keyPoints.map((item) => item.value),
                examples: values.examples.map((item) => item.value),
                resources: values.resources.map((item) => item.value),
            };

            await updateNote(params.id as string, noteData);
            toast.success("Note updated successfully");
            router.push(`/notes/${params.id}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update note");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container max-w-4xl py-8 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/notes/${params.id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Edit Note</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Administrative Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormLabel>Topic</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="administrativeDetails.school"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>School</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="administrativeDetails.class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="administrativeDetails.subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="administrativeDetails.date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="administrativeDetails.weekTerm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Week/Term</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="administrativeDetails.duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="lessonSummary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lesson Summary</FormLabel>
                                        <FormControl>
                                            <Textarea className="min-h-[150px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-base">Key Points</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendKeyPoint({ value: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Point
                                    </Button>
                                </div>
                                {keyPointsFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`keyPoints.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeKeyPoint(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-base">Examples</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendExample({ value: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Example
                                    </Button>
                                </div>
                                {examplesFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`examples.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeExample(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <FormField
                                control={form.control}
                                name="activity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Activity</FormLabel>
                                        <FormControl>
                                            <Textarea className="min-h-[100px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-base">Resources</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendResource({ value: "" })}
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Resource
                                    </Button>
                                </div>
                                {resourcesFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`resources.${index}.value`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeResource(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Link href={`/notes/${params.id}`}>
                            <Button type="button" variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
