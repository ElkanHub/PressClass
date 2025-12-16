import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from './button';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg">
                            <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">PressClass</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
                        <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                        <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                        <Link href="/faqs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQs</Link>
                    </div>

                    <div className="hidden w-content md:flex items-center gap-4 ">
                        <Link href="/auth/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Log In</Link>
                        <Button as={Link} href="/auth/sign-up">Sign Up</Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-muted-foreground hover:text-foreground">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden bg-background border-t border-border px-4 py-4 space-y-4 shadow-lg">
                    <Link href="/about" className="block text-base font-medium text-muted-foreground hover:text-foreground">About</Link>
                    <Link href="/features" className="block text-base font-medium text-muted-foreground hover:text-foreground">Features</Link>
                    <Link href="/pricing" className="block text-base font-medium text-muted-foreground hover:text-foreground">Pricing</Link>
                    <Link href="/faqs" className="block text-base font-medium text-muted-foreground hover:text-foreground">FAQs</Link>
                    <div className="pt-4 border-t border-border flex flex-col gap-3">
                        <Link href="/auth/login" className="text-center font-medium text-foreground">Log In</Link>
                        <Button as={Link} href="/auth/signup" className="w-full">Sign Up</Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
