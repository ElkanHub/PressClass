import React from 'react';
import { Check, Keyboard, Zap, Shield, Wand2 } from 'lucide-react';

const FocusSpeed = () => {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl font-bold text-foreground mb-12">
                            Designed for focus.<br />
                            Built for speed.
                        </h2>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                    <Check className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                                        <Keyboard className="w-4 h-4 text-muted-foreground" /> Keyboard-first Navigation
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Move through your gradebook and lesson plans without lifting your hands from the keyboard. Command palette included.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                    <Zap className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                                        Instant Sync
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Changes reflect instantly across all devices. Offline mode ensures you never lose work during spotty connectivity.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                    <Shield className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                                        Enterprise-Grade Security
                                    </h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        FERPA and COPPA compliant. Your data is encrypted at rest and in transit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dark Mode UI Preview - Intentionally kept dark as it shows off dark mode capabilities */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-slate-950 rounded-2xl p-2 shadow-2xl ring-1 ring-slate-800">
                            <div className="bg-slate-900 rounded-xl h-[400px] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10" />

                                {/* Command Palette Mockup */}
                                <div className="relative w-3/4 max-w-sm">
                                    <div className="bg-slate-950 border border-slate-800 rounded-lg shadow-2xl p-4">
                                        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
                                            <Wand2 className="w-4 h-4 text-primary" />
                                            <span className="text-slate-400 text-sm">Assign quiz to...</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between px-2 py-1.5 bg-primary/20 text-primary-foreground rounded text-sm cursor-pointer">
                                                <span>Grade 10 - History</span>
                                                <span className="text-xs text-primary/60">Enter</span>
                                            </div>
                                            <div className="px-2 py-1.5 text-slate-400 text-sm hover:bg-slate-800 rounded cursor-pointer">Grade 11 - History</div>
                                            <div className="px-2 py-1.5 text-slate-400 text-sm hover:bg-slate-800 rounded cursor-pointer">Grade 9 - Civics</div>
                                        </div>
                                    </div>
                                    <div className="text-center mt-6">
                                        <span className="text-slate-600 text-sm font-mono tracking-widest">command palette dark</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FocusSpeed;
