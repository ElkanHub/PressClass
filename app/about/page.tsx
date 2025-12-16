"use client";
import React from "react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="container px-4 md:px-6 relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
              Our Mission
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Education, Made Lighter with <span className="text-primary">PressClass AI</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              PressClass AI exists to become the trusted resource and active community for teachers and students—removing friction from education through thoughtfully applied artificial intelligence.
            </p>
          </div>
        </section>

        {/* What is PressClass Section */}
        <section className="py-20 container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-center px-6">
                A modern classroom supported by intelligent tools
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">What is PressClass AI?</h2>
              <div className="space-y-5 text-lg text-muted-foreground">
                <p>
                  PressClass AI is a comprehensive educational platform built to support the real, day-to-day needs of teachers and students. It helps users <span className="text-foreground font-medium">create, organize, and manage classroom content effortlessly</span>, removing repetitive administrative work that often distracts from meaningful learning.
                </p>
                <p>
                  Using advanced AI, PressClass AI enables the rapid creation of lesson plans, structured notes, and assessments—without compromising academic quality. Content adapts across subjects, grade levels, and teaching styles, making the platform suitable for individual educators, schools, and institutions alike.
                </p>
                <p>
                  At its core, PressClass AI is designed to bring clarity and structure back into education—so teachers can teach, and students can focus on understanding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Grid */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Why PressClass?</h2>
              <p className="text-muted-foreground text-lg">
                Purpose-built tools that simplify teaching workflows while preserving academic depth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border border-border p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">AI-Powered Content</h3>
                <p className="text-muted-foreground">
                  Generate GES and NaCCA-aligned lesson plans, notes, and assessments in seconds—structured, clear, and classroom-ready.
                </p>
              </div>

              <div className="bg-card border border-border p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" /><path d="m7 21 5-5 5 5" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Classroom Productivity</h3>
                <p className="text-muted-foreground">
                  Integrated study timers, interactive whiteboards, and academic calendars—designed to reduce tool overload.
                </p>
              </div>

              <div className="bg-card border border-border p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Community-Driven</h3>
                <p className="text-muted-foreground">
                  A growing network where educators and learners collaborate, share resources, and learn from real classroom experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 container px-4 md:px-6">
          <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-8 max-w-3xl mx-auto">
                We envision a future where technology quietly handles the administrative burden of education—freeing teachers to teach deeply, mentor intentionally, and inspire confidently.
              </p>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/auth/sign-up">Join Our Journey</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
