"use client"
import React from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="py-20 container px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-xl text-muted-foreground">
                            Start for free, upgrade when you need more power.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold">Free Starter</h3>
                                <p className="text-muted-foreground mt-2">Perfect for individual teachers exploring AI.</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">$0</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>5 AI Lessons Plans / Month</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Basic Notes Generation</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Access to Community Resources</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Basic Study Timer</span>
                                </li>
                            </ul>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/auth/sign-up">Get Started</Link>
                            </Button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 shadow-md flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                                POPULAR
                            </div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold">Pro Educator</h3>
                                <p className="text-muted-foreground mt-2">For power users who need unlimited access.</p>
                            </div>
                            <div className="mb-6">
                                <span className="text-4xl font-bold">$12</span> // Placeholder pricing
                                <span className="text-muted-foreground">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Unlimited AI Lesson Plans</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Advanced Assessments (Quizzes/Exams)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Export to PDF & Word</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Unlimited Whiteboard Projects</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>Priority Support</span>
                                </li>
                            </ul>
                            <Button size="lg" className="w-full" asChild>
                                <Link href="/auth/sign-up?plan=pro">Upgrade to Pro</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground">
                            Need a school-wide license? <Link href="/contact" className="text-primary hover:underline">Contact our sales team</Link>.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
