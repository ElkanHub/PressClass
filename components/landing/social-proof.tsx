import React from 'react';
import { School } from 'lucide-react';

const SocialProof = () => {
    return (
        <section className="py-10 border-y border-border bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-8">
                    Trusted by forward-thinking institutions
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Using text placeholders with icons for logos to avoid external images */}
                    <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Stanford High</div>
                    <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Berkeley Prep</div>
                    <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Dalton School</div>
                    <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Riverdale</div>
                    <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Horace Mann</div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
