"use client";

import React, { useState } from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// FAQ Data
const faqs = [
    {
        category: "General",
        questions: [
            {
                q: "Is PressClass free?",
                a: "PressClass AI offers a free tier that provides access to core features. Advanced capabilities and expanded usage limits are available under our paid subscription plans."
            },
            {
                q: "Who can use PressClass?",
                a: "PressClass AI is designed for teachers, educators, students, and schools looking to streamline academic workflows."
            },
            {
                q: "Do I need technical skills to use PressClass?",
                a: "No. The interface is intuitive, and most features can be accessed with minimal setup. Guided tutorials are available within the app."
            },
            {
                q: "Can I use PressClass offline?",
                a: "Currently, PressClass AI requires an active internet connection to generate AI content and sync files. Some previously saved materials may be viewable offline."
            }
        ]
    },
    {
        category: "For Teachers",
        questions: [
            {
                q: "Can I export lesson plans and materials?",
                a: "Yes. All content created can be exported into commonly used formats like PDF for easy sharing and printing."
            },
            {
                q: "Is the generated content curriculum-aligned?",
                a: "PressClass AI is designed to align with Ghana's curriculum frameworks (GES/NaCCA). Educators should always review AI-generated content before use."
            },
            {
                q: "Can I customize the AI output?",
                a: "Yes. All generated materials are fully editable. You can adjust inputs and refine the text to fit your specific needs."
            },
            {
                q: "Does PressClass replace teachers?",
                a: "No. PressClass AI is a support tool designed to reduce administrative workload so teachers can focus on instruction and mentorship."
            }
        ]
    },
    {
        category: "For Students",
        questions: [
            {
                q: "Can PressClass write my essays for me?",
                a: "No. PressClass AI is a study aid to help organize notes and understand topics, not a tool for completing assignments on your behalf."
            },
            {
                q: "Can PressClass help me prepare for exams?",
                a: "Yes. It can generate revision notes, practice questions, and help you create study schedules."
            }
        ]
    }
];

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-border last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-4 text-left focus:outline-none"
            >
                <span className="font-medium text-lg">{question}</span>
                {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-muted-foreground leading-relaxed">{answer}</p>
            </div>
        </div>
    );
};

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="py-20 bg-muted/30">
                    <div className="container px-4 text-center">
                        <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Find answers to common questions about PressClass AI.
                        </p>
                    </div>
                </section>

                <section className="py-20 container px-4 max-w-4xl mx-auto">
                    {faqs.map((section, idx) => (
                        <div key={idx} className="mb-12 last:mb-0">
                            <h2 className="text-2xl font-bold mb-6 text-primary">{section.category}</h2>
                            <div className="bg-card border border-border rounded-xl px-6 md:px-8 shadow-sm">
                                {section.questions.map((item, i) => (
                                    <AccordionItem key={i} question={item.q} answer={item.a} />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="py-20 bg-primary/5">
                    <div className="container px-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-muted-foreground mb-8">
                            We're here to help. Check out our documentation or contact support.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button asChild>
                                <Link href="/contact">Contact Support</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
