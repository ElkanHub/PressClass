
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

        <div className="animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Assessment Generator
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Create Classroom Assessments <br />
            <span className="text-primary">In Seconds</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Empower your teaching with PressClass. Generate WAEC/GES compliant questions instantly.
            Save time, reduce workload, and focus on what matters most—your students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/generator"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              Start Generating Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-input bg-background/50 px-8 py-4 text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground backdrop-blur-sm transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose PressClass?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed for modern educators who need efficiency without compromising quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Generation",
                description: "Generate comprehensive assessments in seconds using advanced AI models."
              },
              {
                icon: CheckCircle2,
                title: "Standard Compliant",
                description: "Questions aligned with WAEC and GES standards for reliable testing."
              },
              {
                icon: Sparkles,
                title: "Flexible Formats",
                description: "Create MCQs, subjective questions, or mixed formats tailored to any class level."
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>© 2025 PressClass. All rights reserved.</p>
      </footer>
    </div>
  );
}
