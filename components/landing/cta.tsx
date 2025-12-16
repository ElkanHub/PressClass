import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from './button';
import Link from 'next/link';

const CTA = () => {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-foreground text-background rounded-[2rem] p-12 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-background mb-6">
                            Ready to upgrade your school?
                            <br />
                            Join the waitlist today.
                        </h2>
                        <p className="text-lg text-muted/60 mb-10 max-w-xl mx-auto">
                            Experience the future of educational management. Free for individual teachers, powerful for districts.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button as={Link} href="/auth/sign-up" variant="dark" className="h-12 px-8 w-full sm:w-auto">Get started</Button>
                            <button className="text-background font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <Link href="/about">Learn more</Link> <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
