"use client";
import React from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Clock, Calendar, Users, FileText, CheckCircle2, MonitorPlay } from 'lucide-react';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Header */}
                <section className="py-20 bg-muted/30">
                    <div className="container px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Tools for Modern Educators</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to plan, teach, and organize—supercharged by AI.
                        </p>
                    </div>
                </section>

                {/* Feature 1: AI Generators */}
                <section className="py-20 container px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative aspect-video bg-muted rounded-xl border border-border overflow-hidden shadow-lg">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                {/* Placeholder for AI Generator Screenshot */}
                                <span className="flex items-center gap-2"><Sparkles className="h-6 w-6" /> AI Generation Interface</span>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <Sparkles className="h-4 w-4" />
                                <span>Core Capability</span>
                            </div>
                            <h2 className="text-3xl font-bold">AI-Powered Content Generation</h2>
                            <p className="text-lg text-muted-foreground">
                                Stop spending endless hours on paperwork. PressClass AI creates curriculum-aligned materials in seconds.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                                    <div>
                                        <span className="font-medium block">Lesson Plans</span>
                                        <span className="text-muted-foreground text-sm">Detailed plans with objectives, RPK, materials, and staged activities following GES standards.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                                    <div>
                                        <span className="font-medium block">Structured Notes</span>
                                        <span className="text-muted-foreground text-sm">Comprehensive notes tailored to your subject and class level.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                                    <div>
                                        <span className="font-medium block">Smart Assessments</span>
                                        <span className="text-muted-foreground text-sm">Generate quizzes, MCQs, and essay questions instantly from your lessons.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Feature 2: Productivity */}
                <section className="py-20 bg-muted/30">
                    <div className="container px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium">
                                    <Clock className="h-4 w-4" />
                                    <span>Productivity Suite</span>
                                </div>
                                <h2 className="text-3xl font-bold">Focus & Classroom Management</h2>
                                <p className="text-lg text-muted-foreground">
                                    Tools designed to help you and your students stay on track and make the most of every minute.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-6 mt-4">
                                    <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                                        <Clock className="h-8 w-8 text-blue-500 mb-4" />
                                        <h3 className="font-bold mb-2">Study Timer</h3>
                                        <p className="text-sm text-muted-foreground">Pomodoro, Countdown, and Stopwatch modes for focused study sessions.</p>
                                    </div>
                                    <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                                        <MonitorPlay className="h-8 w-8 text-purple-500 mb-4" />
                                        <h3 className="font-bold mb-2">Interactive Whiteboard</h3>
                                        <p className="text-sm text-muted-foreground">Visual planning and brainstorming tool for keeping ideas organized.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative aspect-square md:aspect-[4/3] bg-background rounded-xl border border-border overflow-hidden shadow-lg">
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    {/* Placeholder for Productivity UI */}
                                    <span className="flex items-center gap-2"><Clock className="h-6 w-6" /> Timer & Whiteboard UI</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Organization */}
                <section className="py-20 container px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative aspect-video bg-muted rounded-xl border border-border overflow-hidden shadow-lg">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                {/* Placeholder for Calendar/Dashboard */}
                                <span className="flex items-center gap-2"><Calendar className="h-6 w-6" /> Dashboard & Calendar</span>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium">
                                <Calendar className="h-4 w-4" />
                                <span>Stay Organized</span>
                            </div>
                            <h2 className="text-3xl font-bold">Your Academic Command Center</h2>
                            <p className="text-lg text-muted-foreground">
                                Keep track of your classes, lessons, and tasks in one unified dashboard.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                                        <span className="text-orange-600 font-bold">1</span>
                                    </div>
                                    <div>
                                        <span className="font-medium block">Smart Dashboard</span>
                                        <span className="text-muted-foreground text-sm">See your week at a glance with recent files and upcoming events.</span>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                                        <span className="text-orange-600 font-bold">2</span>
                                    </div>
                                    <div>
                                        <span className="font-medium block">Integrated Calendar</span>
                                        <span className="text-muted-foreground text-sm">Drag-and-drop scheduling for all your lessons and tasks.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-primary text-primary-foreground">
                    <div className="container px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Ready to transform your classroom?</h2>
                        <div className="flex justify-center gap-4">
                            <Button variant="secondary" size="lg" asChild>
                                <Link href="/auth/sign-up">Get Started for Free</Link>
                            </Button>
                            <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" size="lg" asChild>
                                <Link href="/contact">Contact Sales</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
