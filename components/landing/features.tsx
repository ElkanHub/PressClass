import React from 'react';
import { Wand2, Check, Calendar, BarChart3, Users } from 'lucide-react';

const Features = () => {
    return (
        <section className="py-24 bg-muted/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Everything you need to run a modern school.
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Replace your patchwork of disconnected tools with one cohesive operating system.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Feature 1: AI Assessment */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border md:col-span-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                            <Wand2 className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">AI Assessment Engine</h3>
                        <p className="text-muted-foreground mb-8 max-w-md">
                            Grade essays, quizzes, and code in seconds. Our AI understands context, providing personalized feedback that mimics your teaching style.
                        </p>

                        {/* Mock UI */}
                        <div className="bg-muted/30 rounded-xl p-4 border border-border">
                            <div className="bg-card rounded-lg p-4 shadow-sm border border-border flex items-start gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded">GRADED</span>
                                        <span className="text-xs text-muted-foreground">History Essay - 10th Grade</span>
                                    </div>
                                    <div className="h-2 w-3/4 bg-muted rounded" />
                                    <div className="h-2 w-full bg-muted rounded" />
                                    <div className="h-2 w-5/6 bg-muted rounded" />
                                </div>
                            </div>
                            <div className="mt-3 flex gap-2 items-center text-xs text-muted-foreground bg-primary/5 p-2 rounded border border-primary/10">
                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check className="w-3 h-3" />
                                </div>
                                Excellent analysis of the primary sources...
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Smart Scheduling */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
                            <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Smart Scheduling</h3>
                        <p className="text-muted-foreground mb-8 text-sm">
                            Automatically optimize study blocks and faculty meetings based on availability.
                        </p>

                        {/* Mock UI */}
                        <div className="bg-muted/30 rounded-xl p-3 border border-border">
                            <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground font-medium mb-2 text-center">
                                <div>MON</div><div>TUE</div><div>WED</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 h-24">
                                <div className="bg-primary/20 rounded col-span-1 h-16 mt-2" />
                                <div className="bg-orange-100 dark:bg-orange-900/40 rounded col-span-1 h-full border-l-2 border-orange-300 dark:border-orange-500" />
                                <div className="bg-primary/20 rounded col-span-1 h-12" />
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Analytics */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Campus Analytics</h3>
                        <p className="text-muted-foreground mb-8 text-sm">
                            Real-time insights into attendance, grades, and resource utilization across the district.
                        </p>

                        {/* Mock UI */}
                        <div className="bg-muted/30 rounded-xl p-4 border border-border flex items-end justify-between gap-2 h-32">
                            <div className="w-full bg-purple-400/30 h-[40%] rounded-t-sm" />
                            <div className="w-full bg-purple-400/40 h-[60%] rounded-t-sm" />
                            <div className="w-full bg-purple-400/20 h-[30%] rounded-t-sm" />
                            <div className="w-full bg-purple-400/60 h-[80%] rounded-t-sm" />
                            <div className="w-full bg-purple-400/40 h-[50%] rounded-t-sm" />
                        </div>
                    </div>

                    {/* Feature 4: Collaboration */}
                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border md:col-span-2">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Teacher & Student Collaboration</h3>
                                <p className="text-muted-foreground">
                                    A unified whiteboard and document space where classes come alive. Real-time sync, embedded video, and infinite canvas.
                                </p>
                            </div>

                            {/* Mock UI */}
                            <div className="flex-1 w-full bg-background rounded-xl shadow-lg border border-border p-6 flex items-center justify-center">
                                <div className="flex items-center -space-x-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-background bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-100">JD</div>
                                    <div className="w-10 h-10 rounded-full border-2 border-background bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-100">AS</div>
                                    <div className="w-10 h-10 rounded-full border-2 border-background bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center text-xs font-bold text-yellow-700 dark:text-yellow-100">MR</div>
                                    <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">+5</div>
                                </div>
                                <button className="ml-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary/20">
                                    Needs Review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
