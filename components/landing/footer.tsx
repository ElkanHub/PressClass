import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-muted/10 pt-16 pb-8 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
                    <div className="col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary p-1.5 rounded-lg">
                                <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
                            </div>
                            <span className="font-bold text-lg text-foreground">PressClass</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
                            The operating system for modern education. Empowering teachers, engaging students, and simplifying administration.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer" />
                            <div className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-sm">Product</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">Features</a></li>
                            <li><a href="#" className="hover:text-primary">Integrations</a></li>
                            <li><a href="#" className="hover:text-primary">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary">Changelog</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-sm">Resources</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">Documentation</a></li>
                            <li><a href="#" className="hover:text-primary">API</a></li>
                            <li><a href="#" className="hover:text-primary">Community</a></li>
                            <li><a href="#" className="hover:text-primary">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4 text-sm">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary">About</a></li>
                            <li><a href="#" className="hover:text-primary">Blog</a></li>
                            <li><a href="#" className="hover:text-primary">Careers</a></li>
                            <li><a href="#" className="hover:text-primary">Legal</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2025 PressClass Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-foreground">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
