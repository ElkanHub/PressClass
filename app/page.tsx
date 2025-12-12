
// import Link from "next/link";
// import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";

// export default function LandingPage() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Hero Section */}
//       <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
//         <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

//         <div className="animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10">
//           <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
//             <Sparkles className="mr-2 h-4 w-4" />
//             AI-Powered Assessment Generator
//           </div>

//           <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
//             Create Classroom Assessments <br />
//             <span className="text-primary">In Seconds</span>
//           </h1>

//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
//             Empower your teaching with PressClass. Generate WAEC/GES compliant questions instantly.
//             Save time, reduce workload, and focus on what matters most—your students.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//             <Link
//               href="/generator"
//               className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
//             >
//               Start Generating Now
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Link>
//             <Link
//               href="#features"
//               className="inline-flex items-center justify-center rounded-full border border-input bg-background/50 px-8 py-4 text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground backdrop-blur-sm transition-all"
//             >
//               Learn More
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 px-4 bg-secondary/30">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold mb-4">Why Choose PressClass?</h2>
//             <p className="text-muted-foreground max-w-2xl mx-auto">
//               Designed for modern educators who need efficiency without compromising quality.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Zap,
//                 title: "Instant Generation",
//                 description: "Generate comprehensive assessments in seconds using advanced AI models."
//               },
//               {
//                 icon: CheckCircle2,
//                 title: "Standard Compliant",
//                 description: "Questions aligned with WAEC and GES standards for reliable testing."
//               },
//               {
//                 icon: Sparkles,
//                 title: "Flexible Formats",
//                 description: "Create MCQs, subjective questions, or mixed formats tailored to any class level."
//               }
//             ].map((feature, i) => (
//               <div key={i} className="glass-card p-8 rounded-2xl">
//                 <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
//                   <feature.icon className="h-6 w-6" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
//                 <p className="text-muted-foreground">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 text-center text-sm text-muted-foreground border-t">
//         <p>© 2025 PressClass. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }


//Page variation 2
// import Link from "next/link";
// import { ArrowRight, School, Brain, Timer, LayoutDashboard, Sparkles } from "lucide-react";

// export default function LandingPage() {
//   return (
//     <div className="flex flex-col min-h-screen">

//       {/* Hero Section */}
//       <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden">
//         <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

//         <div className="animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-10 max-w-4xl mx-auto">

//           {/* Badge */}
//           <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
//             <Sparkles className="mr-2 h-4 w-4" />
//             The Complete School Productivity Suite
//           </div>

//           {/* Main Heading */}
//           <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
//             Streamline Teaching.
//             <br />
//             <span className="text-primary">Supercharge Learning.</span>
//           </h1>

//           {/* Subtext */}
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
//             PressClass brings together smart assessments, study analytics, productivity tools, 
//             AI assistance, and school-wide visibility—everything teachers and students need to thrive.
//           </p>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               href="/generator"
//               className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
//             >
//               Try PressClass Free
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Link>

//             <Link
//               href="#features"
//               className="inline-flex items-center justify-center rounded-full border border-input bg-background/50 px-8 py-4 text-lg font-medium shadow-sm hover:bg-accent hover:text-accent-foreground backdrop-blur-sm transition-all"
//             >
//               Explore Features
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Feature Section */}
//       <section id="features" className="py-20 px-4 bg-secondary/30">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl font-bold mb-4">Built for Modern Schools</h2>
//             <p className="text-muted-foreground max-w-2xl mx-auto">
//               Every tool works together—students, teachers, and school admins all stay in sync.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">

//             {/* Feature 1 */}
//             <div className="glass-card p-8 rounded-2xl">
//               <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
//                 <Brain className="h-6 w-6" />
//               </div>
//               <h3 className="text-xl font-semibold mb-3">AI Assessment Generator</h3>
//               <p className="text-muted-foreground">
//                 Create WAEC/GES-compliant assessments instantly—MCQs, structured questions,
//                 passages, listening, and teacher-customized exams.
//               </p>
//             </div>

//             {/* Feature 2 */}
//             <div className="glass-card p-8 rounded-2xl">
//               <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
//                 <Timer className="h-6 w-6" />
//               </div>
//               <h3 className="text-xl font-semibold mb-3">StudyTime & Analytics</h3>
//               <p className="text-muted-foreground">
//                 Pomodoro timers, focus tracking, weekly analytics, attention scores, pause logs—
//                 everything to help students stay productive.
//               </p>
//             </div>

//             {/* Feature 3 */}
//             <div className="glass-card p-8 rounded-2xl">
//               <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary">
//                 <LayoutDashboard className="h-6 w-6" />
//               </div>
//               <h3 className="text-xl font-semibold mb-3">Teacher & Class Tools</h3>
//               <p className="text-muted-foreground">
//                 Organize lessons, track student progress, save resources, collaborate, 
//                 and manage coursework—all in one workspace.
//               </p>
//             </div>

//             {/* Feature 4 */}
//             <div className="glass-card p-8 rounded-2xl md:col-span-3 flex flex-col sm:flex-row gap-6 p-10">
//               <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
//                 <School className="h-6 w-6" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold mb-3">School Admin Dashboard</h3>
//                 <p className="text-muted-foreground">
//                   Schools get powerful insights: teacher activity, student analytics, assessment history,
//                   productivity tracking, and customizable oversight tools.
//                 </p>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-8 text-center text-sm text-muted-foreground border-t">
//         <p>© 2025 PressClass. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }


//Page variation 3
// import React from "react";

// export default function PressClassPage() {
//   return (
//     <div className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white overflow-x-hidden antialiased selection:bg-primary/20 selection:text-primary">
//       {/* Sticky Navigation */}
//       <nav className="fixed top-0 z-50 w-full border-b border-[#f0f2f4] dark:border-white/5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex h-16 items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
//                 <span className="material-symbols-outlined text-[20px]">school</span>
//               </div>
//               <span className="text-lg font-bold tracking-tight">PressClass</span>
//             </div>
//             <div className="hidden md:flex items-center gap-8">
//               <a className="text-sm font-medium text-[#616f89] hover:text-primary transition-colors" href="#">Product</a>
//               <a className="text-sm font-medium text-[#616f89] hover:text-primary transition-colors" href="#">Solutions</a>
//               <a className="text-sm font-medium text-[#616f89] hover:text-primary transition-colors" href="#">Pricing</a>
//               <a className="text-sm font-medium text-[#616f89] hover:text-primary transition-colors" href="#">Changelog</a>
//             </div>
//             <div className="flex items-center gap-3">
//               <a className="hidden sm:block text-sm font-medium hover:text-primary transition-colors" href="#">Log In</a>
//               <button className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm shadow-primary/30">Get Started</button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* MAIN CONTENT */}
//       <main className="relative flex flex-col items-center pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
//         {/* HERO */}
//         <div className="flex flex-col items-center text-center max-w-4xl mx-auto z-10">
//           <div className="inline-flex items-center gap-x-2 rounded-full bg-surface-light dark:bg-white/10 px-3 py-1 mb-8 border border-gray-200 dark:border-white/10 hover:border-primary/30 transition-colors cursor-pointer group">
//             <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
//             <span className="text-xs font-medium text-[#616f89] group-hover:text-primary transition-colors">v2.0 is now live — Read the changelog</span>
//             <span className="material-symbols-outlined text-[14px] text-[#616f89] group-hover:text-primary transition-colors">arrow_forward</span>
//           </div>

//           <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
//             The new operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">modern education.</span>
//           </h1>

//           <p className="text-lg sm:text-xl text-[#616f89] mb-10 max-w-2xl leading-relaxed">
//             PressClass unifies AI grading, lesson planning, and administration into one seamless workflow.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
//             <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-primary hover:bg-primary-dark text-white text-base font-semibold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2">
//               Start for free
//               <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
//             </button>
//             <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-base font-semibold transition-all flex items-center justify-center gap-2">
//               <span className="material-symbols-outlined text-[20px] text-gray-500">play_circle</span>
//               Book a demo
//             </button>
//           </div>
//         </div>

//         {/* HERO IMAGE MOCKUP */}
//         <div className="relative w-full mt-20 mb-20 group">
//           <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10 dark:bg-primary/20"></div>
//           <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-dark shadow-2xl overflow-hidden aspect-[16/10] sm:aspect-[2/1] relative">
//             <div className="h-10 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center px-4 gap-2">
//               <div className="flex gap-1.5">
//                 <div className="size-3 rounded-full bg-red-400/80" />
//                 <div className="size-3 rounded-full bg-yellow-400/80" />
//                 <div className="size-3 rounded-full bg-green-400/80" />
//               </div>
//               <div className="ml-4 h-5 w-40 bg-gray-200/50 dark:bg-white/10 rounded-md" />
//             </div>
//             <div
//               className="w-full h-full bg-cover bg-center"
//               style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAd6pDqp32THU6Vsle2ubJ8HygyMYhBViDpnoVBKGujDC5m5tmDsnkyojfO2rjA59Xv1h-xg_lVzqICt3To3-T9jL5_0AmXNkKkAG5Ic_0thz4dLcmKrGiyGruOpG6BY8H2NZmcLTmYHZqWu6liEOcYnq4ahLogJ9umndNWGMpo6FVrdxfJUH6Aod81iQgnl3_7QZ_RrT8agxN4v7kjWqdOiLrJmFMDhQjRB1qCI-VY1AvLoBCGBwljj8UQS--ERK5C4zJfD8V7Vyc')" }}
//             />
//           </div>
//         </div>

//         {/* ---- OMITTED FOR BREVITY (Your full page content continues...) ---- */}

//       </main>

//       {/* FOOTER */}
//       <footer className="bg-surface-light dark:bg-[#0b0f17] border-t border-gray-200 dark:border-white/5 py-12 lg:py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
//             <div className="col-span-2 lg:col-span-2">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="size-6 rounded bg-primary flex items-center justify-center text-white">
//                   <span className="material-symbols-outlined text-[14px]">school</span>
//                 </div>
//                 <span className="text-base font-bold">PressClass</span>
//               </div>
//               <p className="text-sm text-[#616f89] max-w-xs mb-6">
//                 The operating system for modern education.
//               </p>
//             </div>
//           </div>
//           <div className="pt-8 border-t border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-sm text-[#616f89]">© 2024 PressClass Inc. All rights reserved.</p>
//             <div className="flex gap-6">
//               <a className="text-xs text-[#616f89] hover:text-primary" href="#">Privacy Policy</a>
//               <a className="text-xs text-[#616f89] hover:text-primary" href="#">Terms of Service</a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

//False Duplicate
// Next.js page version of provided HTML
// export default function PressClassPage() {
//   return (
//     <main className="bg-background-light dark:bg-background-dark text-[#111318] dark:text-white overflow-x-hidden antialiased selection:bg-primary/20 selection:text-primary">
//       {/* Navigation */}
//       <nav className="fixed top-0 z-50 w-full border-b border-[#f0f2f4] dark:border-white/5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex h-16 items-center justify-between">
//             <div className="flex items-center gap-2">
//               <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
//                 <span className="material-symbols-outlined text-[20px]">school</span>
//               </div>
//               <span className="text-lg font-bold tracking-tight">PressClass</span>
//             </div>

//             <div className="hidden md:flex items-center gap-8">
//               <a className="text-sm font-medium text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">Product</a>
//               <a className="text-sm font-medium text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">Solutions</a>
//               <a className="text-sm font-medium text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">Pricing</a>
//               <a className="text-sm font-medium text-[#616f89] dark:text-gray-400 hover:text-primary" href="#">Changelog</a>
//             </div>

//             <div className="flex items-center gap-3">
//               <a className="hidden sm:block text-sm font-medium hover:text-primary" href="#">Log In</a>
//               <button className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm shadow-primary/30 transition-all">Get Started</button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content Converted */}
//       <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
//         {/* Hero */}
//         <div className="flex flex-col items-center text-center max-w-4xl mx-auto z-10">
//           <div className="inline-flex items-center gap-x-2 rounded-full bg-surface-light dark:bg-white/10 px-3 py-1 mb-8 border border-gray-200 dark:border-white/10 hover:border-primary/30 transition-colors cursor-pointer group">
//             <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
//             <span className="text-xs font-medium text-[#616f89] dark:text-gray-300 group-hover:text-primary transition-colors">v2.0 is now live — Read the changelog</span>
//             <span className="material-symbols-outlined text-[14px] text-[#616f89] group-hover:text-primary transition-colors">arrow_forward</span>
//           </div>

//           <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
//             The new operating system for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">modern education.</span>
//           </h1>

//           <p className="text-lg sm:text-xl text-[#616f89] dark:text-gray-400 mb-10 max-w-2xl leading-relaxed">
//             PressClass unifies AI grading, lesson planning, and administration into one seamless workflow.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
//             <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-primary hover:bg-primary-dark text-white text-base font-semibold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2">
//               Start for free
//               <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
//             </button>
//             <button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-base font-semibold transition-all flex items-center justify-center gap-2">
//               <span className="material-symbols-outlined text-[20px] text-gray-500">play_circle</span>
//               Book a demo
//             </button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


//Page variation 4
"use client"
// import React, { useState } from 'react';
// import { 
//   Check, 
//   Menu, 
//   X, 
//   ChevronRight, 
//   Play, 
//   Wand2, 
//   Calendar, 
//   BarChart3, 
//   Users, 
//   Zap, 
//   Shield, 
//   Keyboard, 
//   ArrowRight,
//   School
// } from 'lucide-react';

// // Reusable Button Component
// const Button = ({ children, variant = 'primary', className = '', icon: Icon, ...props }) => {
//   const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-200 text-sm md:text-base";

//   const variants = {
//     primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200",
//     secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm",
//     dark: "bg-white text-gray-900 hover:bg-gray-100",
//     link: "text-gray-600 hover:text-blue-600 px-0 py-0 bg-transparent"
//   };

//   return (
//     <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
//       {children}
//       {Icon && <Icon className="ml-2 w-4 h-4" />}
//     </button>
//   );
// };

// // Navbar Component
// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           <div className="flex items-center gap-2">
//             <div className="bg-blue-600 p-1.5 rounded-lg">
//               <div className="w-4 h-4 bg-white rounded-sm" />
//             </div>
//             <span className="font-bold text-xl tracking-tight text-gray-900">PressClass</span>
//           </div>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center gap-8">
//             <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Product</a>
//             <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Solutions</a>
//             <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
//             <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Changelog</a>
//           </div>

//           <div className="hidden md:flex items-center gap-4">
//             <a href="/auth/login" className="text-sm font-medium text-gray-900">Log In</a>
//             <Button className="px-5 py-2.5 text-sm">Get Started</Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
//               {isOpen ? <X /> : <Menu />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Nav */}
//       {isOpen && (
//         <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4 shadow-lg">
//           <a href="#" className="block text-base font-medium text-gray-600">Product</a>
//           <a href="#" className="block text-base font-medium text-gray-600">Solutions</a>
//           <a href="#" className="block text-base font-medium text-gray-600">Pricing</a>
//           <a href="#" className="block text-base font-medium text-gray-600">Changelog</a>
//           <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
//             <a href="#" className="text-center font-medium text-gray-900">Log In</a>
//             <Button className="w-full">Get Started</Button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// // Mock Dashboard Component for Hero
// const MockDashboard = () => (
//   <div className="relative bg-white rounded-t-2xl shadow-2xl overflow-hidden border border-gray-200">
//     {/* Browser Bar */}
//     <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
//       <div className="flex gap-1.5">
//         <div className="w-3 h-3 rounded-full bg-red-400" />
//         <div className="w-3 h-3 rounded-full bg-yellow-400" />
//         <div className="w-3 h-3 rounded-full bg-green-400" />
//       </div>
//       <div className="ml-4 bg-white border border-gray-200 rounded-md px-3 py-1 w-64 h-6" />
//     </div>

//     {/* Content */}
//     <div className="flex h-[400px] md:h-[500px] bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-48 border-r border-gray-200 bg-white p-4 hidden sm:block">
//         <div className="space-y-4">
//           <div className="h-4 w-24 bg-gray-100 rounded" />
//           <div className="space-y-2 pt-4">
//             {[1, 2, 3, 4, 5].map(i => (
//               <div key={i} className="h-3 w-full bg-gray-50 rounded" />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Area */}
//       <div className="flex-1 p-6 md:p-8">
//         <div className="flex justify-between items-center mb-8">
//           <div className="h-8 w-48 bg-gray-200 rounded" />
//           <div className="flex gap-2">
//             <div className="h-8 w-8 rounded-full bg-gray-200" />
//             <div className="h-8 w-8 rounded-full bg-gray-200" />
//           </div>
//         </div>

//         {/* Chart Area */}
//         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-64 flex items-end justify-between gap-2 md:gap-4">
//           {[35, 55, 40, 70, 45, 60, 85, 50, 65, 90].map((h, i) => (
//             <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
//               <div 
//                 className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all duration-1000"
//                 style={{ height: `${h}%` }} 
//               />
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 grid grid-cols-3 gap-4">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="bg-white h-24 rounded-lg border border-gray-200" />
//           ))}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
//       <Navbar />

//       {/* Hero Section */}
//       <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-white -z-10" />

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <a href="#" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-8 hover:bg-blue-100 transition-colors">
//             <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
//             v2.0 is now live — Read the changelog
//             <ArrowRight className="w-3 h-3" />
//           </a>

//           <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6">
//             The new operating system<br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
//               for modern education.
//             </span>
//           </h1>

//           <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
//             PressClass unifies AI grading, lesson planning, and administration into one seamless workflow. Stop wrestling with fragmented tools.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
//             <Button className="w-full sm:w-auto h-12 px-8 text-base">
//               Start for free
//               <ChevronRight className="w-4 h-4 ml-1" />
//             </Button>
//             <Button variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base group">
//               <Play className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-500 transition-colors" />
//               Book a demo
//             </Button>
//           </div>

//           <div className="relative mx-auto max-w-5xl">
//             <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl blur opacity-30" />
//             <MockDashboard />
//           </div>
//         </div>
//       </section>

//       {/* Social Proof */}
//       <section className="py-10 border-y border-gray-50 bg-gray-50/50">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-8">
//             Trusted by forward-thinking institutions
//           </p>
//           <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
//              {/* Using text placeholders with icons for logos to avoid external images */}
//              <div className="flex items-center gap-2 font-serif font-bold text-xl"><School className="w-6 h-6"/> Stanford High</div>
//              <div className="flex items-center gap-2 font-serif font-bold text-xl"><School className="w-6 h-6"/> Berkeley Prep</div>
//              <div className="flex items-center gap-2 font-serif font-bold text-xl"><School className="w-6 h-6"/> Dalton School</div>
//              <div className="flex items-center gap-2 font-serif font-bold text-xl"><School className="w-6 h-6"/> Riverdale</div>
//              <div className="flex items-center gap-2 font-serif font-bold text-xl"><School className="w-6 h-6"/> Horace Mann</div>
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section className="py-24 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Everything you need to run a modern school.
//             </h2>
//             <p className="text-lg text-gray-600">
//               Replace your patchwork of disconnected tools with one cohesive operating system.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {/* Feature 1: AI Assessment */}
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
//                 <Wand2 className="w-5 h-5 text-blue-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">AI Assessment Engine</h3>
//               <p className="text-gray-600 mb-8 max-w-md">
//                 Grade essays, quizzes, and code in seconds. Our AI understands context, providing personalized feedback that mimics your teaching style.
//               </p>

//               {/* Mock UI */}
//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//                 <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-start gap-4">
//                   <div className="flex-1 space-y-2">
//                     <div className="flex items-center gap-2 mb-2">
//                       <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">GRADED</span>
//                       <span className="text-xs text-gray-500">History Essay - 10th Grade</span>
//                     </div>
//                     <div className="h-2 w-3/4 bg-gray-100 rounded" />
//                     <div className="h-2 w-full bg-gray-100 rounded" />
//                     <div className="h-2 w-5/6 bg-gray-100 rounded" />
//                   </div>
//                 </div>
//                 <div className="mt-3 flex gap-2 items-center text-xs text-gray-500 bg-blue-50/50 p-2 rounded border border-blue-50">
//                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//                      <Check className="w-3 h-3" />
//                    </div>
//                    Excellent analysis of the primary sources...
//                 </div>
//               </div>
//             </div>

//             {/* Feature 2: Smart Scheduling */}
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//               <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
//                 <Calendar className="w-5 h-5 text-orange-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Scheduling</h3>
//               <p className="text-gray-600 mb-8 text-sm">
//                 Automatically optimize study blocks and faculty meetings based on availability.
//               </p>

//               {/* Mock UI */}
//               <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
//                 <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 font-medium mb-2 text-center">
//                   <div>MON</div><div>TUE</div><div>WED</div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-2 h-24">
//                   <div className="bg-blue-100 rounded col-span-1 h-16 mt-2" />
//                   <div className="bg-orange-100 rounded col-span-1 h-full border-l-2 border-orange-300" />
//                   <div className="bg-blue-100 rounded col-span-1 h-12" />
//                 </div>
//               </div>
//             </div>

//             {/* Feature 3: Analytics */}
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
//                 <BarChart3 className="w-5 h-5 text-purple-600" />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Campus Analytics</h3>
//               <p className="text-gray-600 mb-8 text-sm">
//                 Real-time insights into attendance, grades, and resource utilization across the district.
//               </p>

//               {/* Mock UI */}
//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-end justify-between gap-2 h-32">
//                  <div className="w-full bg-purple-200 h-[40%] rounded-t-sm" />
//                  <div className="w-full bg-purple-300 h-[60%] rounded-t-sm" />
//                  <div className="w-full bg-purple-400 h-[30%] rounded-t-sm" />
//                  <div className="w-full bg-purple-500 h-[80%] rounded-t-sm" />
//                  <div className="w-full bg-purple-600 h-[50%] rounded-t-sm" />
//               </div>
//             </div>

//             {/* Feature 4: Collaboration */}
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
//               <div className="flex flex-col md:flex-row gap-8 items-center">
//                 <div className="flex-1">
//                   <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-6">
//                     <Users className="w-5 h-5 text-green-600" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">Teacher & Student Collaboration</h3>
//                   <p className="text-gray-600">
//                     A unified whiteboard and document space where classes come alive. Real-time sync, embedded video, and infinite canvas.
//                   </p>
//                 </div>

//                 {/* Mock UI */}
//                 <div className="flex-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex items-center justify-center">
//                   <div className="flex items-center -space-x-3">
//                     <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">JD</div>
//                     <div className="w-10 h-10 rounded-full border-2 border-white bg-green-200 flex items-center justify-center text-xs font-bold text-green-700">AS</div>
//                     <div className="w-10 h-10 rounded-full border-2 border-white bg-yellow-200 flex items-center justify-center text-xs font-bold text-yellow-700">MR</div>
//                     <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">+5</div>
//                   </div>
//                   <button className="ml-6 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-200">
//                     Needs Review
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Focus & Speed Section */}
//       <section className="py-24 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col lg:flex-row gap-16 items-center">
//             <div className="lg:w-1/2">
//               <h2 className="text-4xl font-bold text-gray-900 mb-12">
//                 Designed for focus.<br />
//                 Built for speed.
//               </h2>

//               <div className="space-y-8">
//                 <div className="flex gap-4">
//                   <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
//                     <Check className="w-3.5 h-3.5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
//                       <Keyboard className="w-4 h-4 text-gray-400" /> Keyboard-first Navigation
//                     </h3>
//                     <p className="text-gray-600 text-sm leading-relaxed">
//                       Move through your gradebook and lesson plans without lifting your hands from the keyboard. Command palette included.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
//                     <Zap className="w-3.5 h-3.5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
//                       Instant Sync
//                     </h3>
//                     <p className="text-gray-600 text-sm leading-relaxed">
//                       Changes reflect instantly across all devices. Offline mode ensures you never lose work during spotty connectivity.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
//                     <Shield className="w-3.5 h-3.5 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
//                       Enterprise-Grade Security
//                     </h3>
//                     <p className="text-gray-600 text-sm leading-relaxed">
//                       FERPA and COPPA compliant. Your data is encrypted at rest and in transit.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Dark Mode UI Preview */}
//             <div className="lg:w-1/2 w-full">
//               <div className="bg-[#0f172a] rounded-2xl p-2 shadow-2xl ring-1 ring-gray-900/10">
//                 <div className="bg-[#1e293b] rounded-xl h-[400px] flex items-center justify-center relative overflow-hidden">
//                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10" />

//                    {/* Command Palette Mockup */}
//                    <div className="relative w-3/4 max-w-sm">
//                       <div className="bg-[#0f172a] border border-gray-700 rounded-lg shadow-2xl p-4">
//                         <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-3">
//                            <Wand2 className="w-4 h-4 text-blue-400" />
//                            <span className="text-gray-400 text-sm">Assign quiz to...</span>
//                         </div>
//                         <div className="space-y-1">
//                            <div className="flex items-center justify-between px-2 py-1.5 bg-blue-600/20 text-blue-100 rounded text-sm cursor-pointer">
//                               <span>Grade 10 - History</span>
//                               <span className="text-xs text-blue-300">Enter</span>
//                            </div>
//                            <div className="px-2 py-1.5 text-gray-400 text-sm hover:bg-gray-800 rounded cursor-pointer">Grade 11 - History</div>
//                            <div className="px-2 py-1.5 text-gray-400 text-sm hover:bg-gray-800 rounded cursor-pointer">Grade 9 - Civics</div>
//                         </div>
//                       </div>
//                       <div className="text-center mt-6">
//                          <span className="text-gray-600 text-sm font-mono tracking-widest">command palette dark</span>
//                       </div>
//                    </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-[#0f172a] rounded-[2rem] p-12 md:p-24 text-center relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
//             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

//             <div className="relative z-10 max-w-3xl mx-auto">
//               <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
//                 Ready to upgrade your school?
//                 <br />
//                 Join the waitlist today.
//               </h2>
//               <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
//                 Experience the future of educational management. Free for individual teachers, powerful for districts.
//               </p>
//               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                 <Button variant="dark" className="h-12 px-8 w-full sm:w-auto">Get started</Button>
//                 <button className="text-white font-medium hover:text-blue-300 transition-colors flex items-center gap-2">
//                   Learn more <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
//             <div className="col-span-2 lg:col-span-2">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="bg-blue-600 p-1.5 rounded-lg">
//                   <div className="w-3 h-3 bg-white rounded-sm" />
//                 </div>
//                 <span className="font-bold text-lg text-gray-900">PressClass</span>
//               </div>
//               <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
//                 The operating system for modern education. Empowering teachers, engaging students, and simplifying administration.
//               </p>
//               <div className="flex gap-4">
//                  <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer" />
//                  <div className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer" />
//               </div>
//             </div>

//             <div>
//               <h4 className="font-bold text-gray-900 mb-4 text-sm">Product</h4>
//               <ul className="space-y-3 text-sm text-gray-600">
//                 <li><a href="#" className="hover:text-blue-600">Features</a></li>
//                 <li><a href="#" className="hover:text-blue-600">Integrations</a></li>
//                 <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
//                 <li><a href="#" className="hover:text-blue-600">Changelog</a></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold text-gray-900 mb-4 text-sm">Resources</h4>
//               <ul className="space-y-3 text-sm text-gray-600">
//                 <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
//                 <li><a href="#" className="hover:text-blue-600">API</a></li>
//                 <li><a href="#" className="hover:text-blue-600">Community</a></li>
//                 <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold text-gray-900 mb-4 text-sm">Company</h4>
//               <ul className="space-y-3 text-sm text-gray-600">
//                 <li><a href="#" className="hover:text-blue-600">About</a></li>
//                 <li><a href="#" className="hover:text-blue-600">Blog</a></li>
//                 <li><a href="#" className="hover:text-blue-600">Careers</a></li>
//                 <li><a href="#" className="hover:text-blue-600">Legal</a></li>
//               </ul>
//             </div>
//           </div>

//           <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-xs text-gray-400">
//               © 2024 PressClass Inc. All rights reserved.
//             </p>
//             <div className="flex gap-6 text-xs text-gray-400">
//               <a href="#" className="hover:text-gray-600">Privacy Policy</a>
//               <a href="#" className="hover:text-gray-600">Terms of Service</a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


//page variation 5 support theme switching
// import React, { useState } from 'react';
// import {
//   Check,
//   Menu,
//   X,
//   ChevronRight,
//   Play,
//   Wand2,
//   Calendar,
//   BarChart3,
//   Users,
//   Zap,
//   Shield,
//   Keyboard,
//   ArrowRight,
//   School
// } from 'lucide-react';

// // Reusable Button Component
// const Button = ({ children, variant = 'primary', className = '', icon: Icon = null, ...props }) => {
//   const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-200 text-sm md:text-base";

//   const variants = {
//     primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
//     secondary: "bg-card text-card-foreground border border-border hover:bg-muted shadow-sm",
//     // Dark variant is typically used in the already-dark CTA section
//     dark: "bg-background text-foreground hover:bg-muted",
//     link: "text-muted-foreground hover:text-primary px-0 py-0 bg-transparent"
//   };

//   return (
//     <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
//       {children}
//       {Icon && <Icon className="ml-2 w-4 h-4" />}
//     </button>
//   );
// };

// // Navbar Component
// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-20">
//           <div className="flex items-center gap-2">
//             <div className="bg-primary p-1.5 rounded-lg">
//               <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
//             </div>
//             <span className="font-bold text-xl tracking-tight text-foreground">PressClass</span>
//           </div>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center gap-8">
//             <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Product</a>
//             <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
//             <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
//             <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Changelog</a>
//           </div>

//           <div className="hidden md:flex items-center gap-4">
//             <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Log In</a>
//             <Button className="px-5 py-2.5 text-sm">Get Started</Button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden">
//             <button onClick={() => setIsOpen(!isOpen)} className="text-muted-foreground hover:text-foreground">
//               {isOpen ? <X /> : <Menu />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Nav */}
//       {isOpen && (
//         <div className="md:hidden bg-background border-t border-border px-4 py-4 space-y-4 shadow-lg">
//           <a href="#" className="block text-base font-medium text-muted-foreground hover:text-foreground">Product</a>
//           <a href="#" className="block text-base font-medium text-muted-foreground hover:text-foreground">Solutions</a>
//           <a href="#" className="block text-base font-medium text-muted-foreground hover:text-foreground">Pricing</a>
//           <a href="#" className="block text-base font-medium text-muted-foreground hover:text-foreground">Changelog</a>
//           <div className="pt-4 border-t border-border flex flex-col gap-3">
//             <a href="#" className="text-center font-medium text-foreground">Log In</a>
//             <Button className="w-full">Get Started</Button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// // Mock Dashboard Component for Hero
// const MockDashboard = () => (
//   <div className="relative bg-card rounded-t-xl md:rounded-t-2xl shadow-2xl overflow-hidden border border-border">
//     {/* Browser Bar */}
//     <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
//       <div className="flex gap-1.5">
//         <div className="w-3 h-3 rounded-full bg-red-400/80" />
//         <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
//         <div className="w-3 h-3 rounded-full bg-green-400/80" />
//       </div>
//       <div className="ml-4 bg-background/50 border border-border/50 rounded-md px-3 py-1 w-64 h-6 hidden sm:block" />
//     </div>

//     {/* Content - Image Container */}
//     <div className="relative w-full aspect-[16/7.5] bg-muted/20 overflow-hidden group">
//       {/* TODO: Place your 'dashboard.png' in the public folder.
//          The object-cover and object-top classes ensure the top nav is always visible
//          and the image covers the frame nicely without distortion.
//       */}
//       <img
//         src="/dashboard.png"
//         alt="PressClass Dashboard Interface"
//         className="w-full h-full object-contain object-top transition-transform duration-700 hover:scale-[1.01]"
//       />

//       {/* Fallback overlay in case image is missing (optional visual cue) */}
//       <div className="absolute inset-0 flex items-center justify-center bg-muted/10 -z-10">
//         <span className="text-muted-foreground text-sm">Loading dashboard.png...</span>
//       </div>
//     </div>
//   </div>
// );

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-300">
//       <Navbar />

//       {/* Hero Section */}
//       <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-background -z-10" />

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <a href="#" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8 hover:bg-primary/20 transition-colors">
//             <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
//             v2.0 is now live — Read the changelog
//             <ArrowRight className="w-3 h-3" />
//           </a>

//           <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
//             The new operating system<br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
//               for modern education.
//             </span>
//           </h1>

//           <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
//             PressClass unifies AI grading, lesson planning, and administration into one seamless workflow. Stop wrestling with fragmented tools.
//           </p>

//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
//             <Button className="w-full sm:w-auto h-12 px-8 text-base">
//               Start for free
//               <ChevronRight className="w-4 h-4 ml-1" />
//             </Button>
//             <Button variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base group">
//               <Play className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
//               Book a demo
//             </Button>
//           </div>

//           <div className="relative mx-auto max-w-5xl">
//             <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur opacity-30" />
//             <MockDashboard />
//           </div>
//         </div>
//       </section>

//       {/* Social Proof */}
//       <section className="py-10 border-y border-border bg-muted/30">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-8">
//             Trusted by forward-thinking institutions
//           </p>
//           <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
//             {/* Using text placeholders with icons for logos to avoid external images */}
//             <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Stanford High</div>
//             <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Berkeley Prep</div>
//             <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Dalton School</div>
//             <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Riverdale</div>
//             <div className="flex items-center gap-2 font-serif font-bold text-xl text-foreground"><School className="w-6 h-6" /> Horace Mann</div>
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section className="py-24 bg-muted/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center max-w-3xl mx-auto mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
//               Everything you need to run a modern school.
//             </h2>
//             <p className="text-lg text-muted-foreground">
//               Replace your patchwork of disconnected tools with one cohesive operating system.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-6">
//             {/* Feature 1: AI Assessment */}
//             <div className="bg-card p-6 rounded-2xl shadow-sm border border-border md:col-span-2">
//               <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
//                 <Wand2 className="w-5 h-5 text-primary" />
//               </div>
//               <h3 className="text-xl font-bold text-foreground mb-2">AI Assessment Engine</h3>
//               <p className="text-muted-foreground mb-8 max-w-md">
//                 Grade essays, quizzes, and code in seconds. Our AI understands context, providing personalized feedback that mimics your teaching style.
//               </p>

//               {/* Mock UI */}
//               <div className="bg-muted/30 rounded-xl p-4 border border-border">
//                 <div className="bg-card rounded-lg p-4 shadow-sm border border-border flex items-start gap-4">
//                   <div className="flex-1 space-y-2">
//                     <div className="flex items-center gap-2 mb-2">
//                       <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded">GRADED</span>
//                       <span className="text-xs text-muted-foreground">History Essay - 10th Grade</span>
//                     </div>
//                     <div className="h-2 w-3/4 bg-muted rounded" />
//                     <div className="h-2 w-full bg-muted rounded" />
//                     <div className="h-2 w-5/6 bg-muted rounded" />
//                   </div>
//                 </div>
//                 <div className="mt-3 flex gap-2 items-center text-xs text-muted-foreground bg-primary/5 p-2 rounded border border-primary/10">
//                   <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
//                     <Check className="w-3 h-3" />
//                   </div>
//                   Excellent analysis of the primary sources...
//                 </div>
//               </div>
//             </div>

//             {/* Feature 2: Smart Scheduling */}
//             <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
//               <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
//                 <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
//               </div>
//               <h3 className="text-xl font-bold text-foreground mb-2">Smart Scheduling</h3>
//               <p className="text-muted-foreground mb-8 text-sm">
//                 Automatically optimize study blocks and faculty meetings based on availability.
//               </p>

//               {/* Mock UI */}
//               <div className="bg-muted/30 rounded-xl p-3 border border-border">
//                 <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground font-medium mb-2 text-center">
//                   <div>MON</div><div>TUE</div><div>WED</div>
//                 </div>
//                 <div className="grid grid-cols-3 gap-2 h-24">
//                   <div className="bg-primary/20 rounded col-span-1 h-16 mt-2" />
//                   <div className="bg-orange-100 dark:bg-orange-900/40 rounded col-span-1 h-full border-l-2 border-orange-300 dark:border-orange-500" />
//                   <div className="bg-primary/20 rounded col-span-1 h-12" />
//                 </div>
//               </div>
//             </div>

//             {/* Feature 3: Analytics */}
//             <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
//               <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
//                 <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//               </div>
//               <h3 className="text-xl font-bold text-foreground mb-2">Campus Analytics</h3>
//               <p className="text-muted-foreground mb-8 text-sm">
//                 Real-time insights into attendance, grades, and resource utilization across the district.
//               </p>

//               {/* Mock UI */}
//               <div className="bg-muted/30 rounded-xl p-4 border border-border flex items-end justify-between gap-2 h-32">
//                 <div className="w-full bg-purple-400/30 h-[40%] rounded-t-sm" />
//                 <div className="w-full bg-purple-400/40 h-[60%] rounded-t-sm" />
//                 <div className="w-full bg-purple-400/20 h-[30%] rounded-t-sm" />
//                 <div className="w-full bg-purple-400/60 h-[80%] rounded-t-sm" />
//                 <div className="w-full bg-purple-400/40 h-[50%] rounded-t-sm" />
//               </div>
//             </div>

//             {/* Feature 4: Collaboration */}
//             <div className="bg-card p-6 rounded-2xl shadow-sm border border-border md:col-span-2">
//               <div className="flex flex-col md:flex-row gap-8 items-center">
//                 <div className="flex-1">
//                   <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
//                     <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
//                   </div>
//                   <h3 className="text-xl font-bold text-foreground mb-2">Teacher & Student Collaboration</h3>
//                   <p className="text-muted-foreground">
//                     A unified whiteboard and document space where classes come alive. Real-time sync, embedded video, and infinite canvas.
//                   </p>
//                 </div>

//                 {/* Mock UI */}
//                 <div className="flex-1 w-full bg-background rounded-xl shadow-lg border border-border p-6 flex items-center justify-center">
//                   <div className="flex items-center -space-x-3">
//                     <div className="w-10 h-10 rounded-full border-2 border-background bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-100">JD</div>
//                     <div className="w-10 h-10 rounded-full border-2 border-background bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-100">AS</div>
//                     <div className="w-10 h-10 rounded-full border-2 border-background bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center text-xs font-bold text-yellow-700 dark:text-yellow-100">MR</div>
//                     <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">+5</div>
//                   </div>
//                   <button className="ml-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary/20">
//                     Needs Review
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Focus & Speed Section */}
//       <section className="py-24 bg-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col lg:flex-row gap-16 items-center">
//             <div className="lg:w-1/2">
//               <h2 className="text-4xl font-bold text-foreground mb-12">
//                 Designed for focus.<br />
//                 Built for speed.
//               </h2>

//               <div className="space-y-8">
//                 <div className="flex gap-4">
//                   <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
//                     <Check className="w-3.5 h-3.5 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
//                       <Keyboard className="w-4 h-4 text-muted-foreground" /> Keyboard-first Navigation
//                     </h3>
//                     <p className="text-muted-foreground text-sm leading-relaxed">
//                       Move through your gradebook and lesson plans without lifting your hands from the keyboard. Command palette included.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
//                     <Zap className="w-3.5 h-3.5 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
//                       Instant Sync
//                     </h3>
//                     <p className="text-muted-foreground text-sm leading-relaxed">
//                       Changes reflect instantly across all devices. Offline mode ensures you never lose work during spotty connectivity.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
//                     <Shield className="w-3.5 h-3.5 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
//                       Enterprise-Grade Security
//                     </h3>
//                     <p className="text-muted-foreground text-sm leading-relaxed">
//                       FERPA and COPPA compliant. Your data is encrypted at rest and in transit.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Dark Mode UI Preview - Intentionally kept dark as it shows off dark mode capabilities */}
//             <div className="lg:w-1/2 w-full">
//               <div className="bg-slate-950 rounded-2xl p-2 shadow-2xl ring-1 ring-slate-800">
//                 <div className="bg-slate-900 rounded-xl h-[400px] flex items-center justify-center relative overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10" />

//                   {/* Command Palette Mockup */}
//                   <div className="relative w-3/4 max-w-sm">
//                     <div className="bg-slate-950 border border-slate-800 rounded-lg shadow-2xl p-4">
//                       <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
//                         <Wand2 className="w-4 h-4 text-primary" />
//                         <span className="text-slate-400 text-sm">Assign quiz to...</span>
//                       </div>
//                       <div className="space-y-1">
//                         <div className="flex items-center justify-between px-2 py-1.5 bg-primary/20 text-primary-foreground rounded text-sm cursor-pointer">
//                           <span>Grade 10 - History</span>
//                           <span className="text-xs text-primary/60">Enter</span>
//                         </div>
//                         <div className="px-2 py-1.5 text-slate-400 text-sm hover:bg-slate-800 rounded cursor-pointer">Grade 11 - History</div>
//                         <div className="px-2 py-1.5 text-slate-400 text-sm hover:bg-slate-800 rounded cursor-pointer">Grade 9 - Civics</div>
//                       </div>
//                     </div>
//                     <div className="text-center mt-6">
//                       <span className="text-slate-600 text-sm font-mono tracking-widest">command palette dark</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-foreground text-background rounded-[2rem] p-12 md:p-24 text-center relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
//             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

//             <div className="relative z-10 max-w-3xl mx-auto">
//               <h2 className="text-4xl md:text-5xl font-bold text-background mb-6">
//                 Ready to upgrade your school?
//                 <br />
//                 Join the waitlist today.
//               </h2>
//               <p className="text-lg text-muted/60 mb-10 max-w-xl mx-auto">
//                 Experience the future of educational management. Free for individual teachers, powerful for districts.
//               </p>
//               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//                 <Button variant="dark" className="h-12 px-8 w-full sm:w-auto">Get started</Button>
//                 <button className="text-background font-medium hover:text-primary transition-colors flex items-center gap-2">
//                   Learn more <ArrowRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-muted/10 pt-16 pb-8 border-t border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
//             <div className="col-span-2 lg:col-span-2">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="bg-primary p-1.5 rounded-lg">
//                   <div className="w-3 h-3 bg-primary-foreground rounded-sm" />
//                 </div>
//                 <span className="font-bold text-lg text-foreground">PressClass</span>
//               </div>
//               <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
//                 The operating system for modern education. Empowering teachers, engaging students, and simplifying administration.
//               </p>
//               <div className="flex gap-4">
//                 <div className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer" />
//                 <div className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-pointer" />
//               </div>
//             </div>

//             <div>
//               <h4 className="font-bold text-foreground mb-4 text-sm">Product</h4>
//               <ul className="space-y-3 text-sm text-muted-foreground">
//                 <li><a href="#" className="hover:text-primary">Features</a></li>
//                 <li><a href="#" className="hover:text-primary">Integrations</a></li>
//                 <li><a href="#" className="hover:text-primary">Pricing</a></li>
//                 <li><a href="#" className="hover:text-primary">Changelog</a></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold text-foreground mb-4 text-sm">Resources</h4>
//               <ul className="space-y-3 text-sm text-muted-foreground">
//                 <li><a href="#" className="hover:text-primary">Documentation</a></li>
//                 <li><a href="#" className="hover:text-primary">API</a></li>
//                 <li><a href="#" className="hover:text-primary">Community</a></li>
//                 <li><a href="#" className="hover:text-primary">Help Center</a></li>
//               </ul>
//             </div>

//             <div>
//               <h4 className="font-bold text-foreground mb-4 text-sm">Company</h4>
//               <ul className="space-y-3 text-sm text-muted-foreground">
//                 <li><a href="#" className="hover:text-primary">About</a></li>
//                 <li><a href="#" className="hover:text-primary">Blog</a></li>
//                 <li><a href="#" className="hover:text-primary">Careers</a></li>
//                 <li><a href="#" className="hover:text-primary">Legal</a></li>
//               </ul>
//             </div>
//           </div>

//           <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-xs text-muted-foreground">
//               © 2024 PressClass Inc. All rights reserved.
//             </p>
//             <div className="flex gap-6 text-xs text-muted-foreground">
//               <a href="#" className="hover:text-foreground">Privacy Policy</a>
//               <a href="#" className="hover:text-foreground">Terms of Service</a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

//Page variation 6 with changing images
import React, { useState, useEffect } from 'react';
import {
  Check,
  Menu,
  X,
  ChevronRight,
  Play,
  Wand2,
  Calendar,
  BarChart3,
  Users,
  Zap,
  Shield,
  Keyboard,
  ArrowRight,
  School
} from 'lucide-react';
import FlowGradient from "@/components/unicornOrb"

// Reusable Button Component
const Button = ({ children, variant = 'primary', className = '', icon: Icon = null, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-medium transition-all duration-200 text-sm md:text-base";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary: "bg-card text-card-foreground border border-border hover:bg-muted shadow-sm",
    // Dark variant is typically used in the already-dark CTA section
    dark: "bg-background text-foreground hover:bg-muted",
    link: "text-muted-foreground hover:text-primary px-0 py-0 bg-transparent"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
      {Icon && <Icon className="ml-2 w-4 h-4" />}
    </button>
  );
};

// Navbar Component
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
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Product</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Solutions</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Changelog</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="/auth/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Log In</a>
            <Button className="px-5 py-2.5 text-sm">Get Started</Button>
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
          <a href="#" className="block text-base font-medium text-muted-foreground hover:text-foreground">Product</a>
          <a href="#" className="block text-base font-medium text-muted-foreground hover:text-foreground">Solutions</a>
          <a href="#" className="block text-base font-medium text-muted-foreground hover:text-foreground">Pricing</a>
          <a href="#" className="block text-base font-medium text-muted-foreground hover:text-foreground">Changelog</a>
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <a href="#" className="text-center font-medium text-foreground">Log In</a>
            <Button className="w-full">Get Started</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Mock Dashboard Component for Hero
const MockDashboard = ({
  images = ["/dashboard1.png"],
  interval = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative bg-card rounded-t-xl md:rounded-t-2xl shadow-2xl overflow-hidden border border-border">
      {/* Browser Bar */}
      <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-green-400/80" />
        </div>
        <div className="ml-4 bg-background/50 border border-border/50 rounded-md px-3 py-1 w-64 h-6 hidden sm:block" />
      </div>

      {/* Content - Image Container */}
      <div className="relative w-full aspect-[16/7.5] bg-muted/20 overflow-hidden group">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <img
              src={img}
              alt={`Dashboard View ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Fallback/Loading State for background */}
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 -z-10">
          <span className="text-muted-foreground text-sm">Loading dashboard...</span>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-background -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a href="#" className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8 hover:bg-primary/20 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            v2.0 is now live — Read the changelog
            <ArrowRight className="w-3 h-3" />
          </a>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
            The new operating system<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              for modern education.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            PressClass unifies AI grading, lesson planning, and administration into one seamless workflow. Stop wrestling with fragmented tools.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button className="w-full sm:w-auto h-12 px-8 text-base">
              Start for free
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto h-12 px-8 text-base group">
              <Play className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
              Book a demo
            </Button>
          </div>

          <div className='py-3 flex w-full justify-center items-center'>
            <FlowGradient />
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

      {/* Social Proof */}
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

      {/* Features Grid */}
      <section className="py-24 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to run a modern school.
            </h2>
            <p className="text-lg text-muted-foreground">
              Replace your patchwork of disconnected tools with one cohesive operating system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1: AI Assessment */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border md:col-span-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Wand2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">AI Assessment Engine</h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                Grade essays, quizzes, and code in seconds. Our AI understands context, providing personalized feedback that mimics your teaching style.
              </p>

              {/* Mock UI */}
              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <div className="bg-card rounded-lg p-4 shadow-sm border border-border flex items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded">GRADED</span>
                      <span className="text-xs text-muted-foreground">History Essay - 10th Grade</span>
                    </div>
                    <div className="h-2 w-3/4 bg-muted rounded" />
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-5/6 bg-muted rounded" />
                  </div>
                </div>
                <div className="mt-3 flex gap-2 items-center text-xs text-muted-foreground bg-primary/5 p-2 rounded border border-primary/10">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-3 h-3" />
                  </div>
                  Excellent analysis of the primary sources...
                </div>
              </div>
            </div>

            {/* Feature 2: Smart Scheduling */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Smart Scheduling</h3>
              <p className="text-muted-foreground mb-8 text-sm">
                Automatically optimize study blocks and faculty meetings based on availability.
              </p>

              {/* Mock UI */}
              <div className="bg-muted/30 rounded-xl p-3 border border-border">
                <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground font-medium mb-2 text-center">
                  <div>MON</div><div>TUE</div><div>WED</div>
                </div>
                <div className="grid grid-cols-3 gap-2 h-24">
                  <div className="bg-primary/20 rounded col-span-1 h-16 mt-2" />
                  <div className="bg-orange-100 dark:bg-orange-900/40 rounded col-span-1 h-full border-l-2 border-orange-300 dark:border-orange-500" />
                  <div className="bg-primary/20 rounded col-span-1 h-12" />
                </div>
              </div>
            </div>

            {/* Feature 3: Analytics */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Campus Analytics</h3>
              <p className="text-muted-foreground mb-8 text-sm">
                Real-time insights into attendance, grades, and resource utilization across the district.
              </p>

              {/* Mock UI */}
              <div className="bg-muted/30 rounded-xl p-4 border border-border flex items-end justify-between gap-2 h-32">
                <div className="w-full bg-purple-400/30 h-[40%] rounded-t-sm" />
                <div className="w-full bg-purple-400/40 h-[60%] rounded-t-sm" />
                <div className="w-full bg-purple-400/20 h-[30%] rounded-t-sm" />
                <div className="w-full bg-purple-400/60 h-[80%] rounded-t-sm" />
                <div className="w-full bg-purple-400/40 h-[50%] rounded-t-sm" />
              </div>
            </div>

            {/* Feature 4: Collaboration */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border md:col-span-2">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Teacher & Student Collaboration</h3>
                  <p className="text-muted-foreground">
                    A unified whiteboard and document space where classes come alive. Real-time sync, embedded video, and infinite canvas.
                  </p>
                </div>

                {/* Mock UI */}
                <div className="flex-1 w-full bg-background rounded-xl shadow-lg border border-border p-6 flex items-center justify-center">
                  <div className="flex items-center -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-background bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-100">JD</div>
                    <div className="w-10 h-10 rounded-full border-2 border-background bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-100">AS</div>
                    <div className="w-10 h-10 rounded-full border-2 border-background bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center text-xs font-bold text-yellow-700 dark:text-yellow-100">MR</div>
                    <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">+5</div>
                  </div>
                  <button className="ml-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-primary/20">
                    Needs Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Focus & Speed Section */}
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

      {/* CTA Section */}
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
                <Button variant="dark" className="h-12 px-8 w-full sm:w-auto">Get started</Button>
                <button className="text-background font-medium hover:text-primary transition-colors flex items-center gap-2">
                  Learn more <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
              © 2024 PressClass Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}