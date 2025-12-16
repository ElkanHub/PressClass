"use client";
import React from 'react';
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import SocialProof from "@/components/landing/social-proof";
import Features from "@/components/landing/features";
import FocusSpeed from "@/components/landing/focus-speed";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";
import { Chatbot } from "@/components/chatbot/chatbot";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <FocusSpeed />
      <CTA />
      <Footer />
      <Chatbot />
    </div>
  );
}