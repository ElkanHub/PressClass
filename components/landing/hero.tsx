import React from 'react';
import { ArrowRight, ChevronRight, Play } from 'lucide-react';
import Button from './button';
import Link from 'next/link';
import MockDashboard from './mock-dashboard';

const Hero = () => {
    return (
        <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-background -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <a href="#" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8 hover:bg-primary/20 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Press Class is LIVE
                    <ArrowRight className="w-3 h-3" />
                </a>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
                    The new operating system<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                        for modern education.
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
                    PressClass is an AI driven platform designed to help you work faster, practice smarter, and retain what truly matters. No noise. No busywork. For teachers, for students, for everyone.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Button as={Link} href="/auth/signup" className="w-full sm:w-auto h-12 px-8 text-base">
                        Start for FREE
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button variant="secondary" as={Link} href="#" className="w-full sm:w-auto h-12 px-8 text-base group">
                        <Play className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                        Get a walkthrough
                    </Button>
                </div>

                <div className="relative mx-auto max-w-5xl px-4 sm:px-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-xl opacity-30" />
                    <MockDashboard
                        images={[
                            "/dashboard1.png",
                            // Add your additional image paths here to enable the slideshow
                            "/dashboard2.png",
                            "/dashboard3.png",
                            "/dashboard4.png",
                            "/dashboard5.png",
                            "/dashboard6.png"
                        ]}
                        interval={4000} // Time in milliseconds between slides
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
